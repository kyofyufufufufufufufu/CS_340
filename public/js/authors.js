
/*
Citation for authors.js with the exception of handling the modal.
Date: 02/16/25 - 03/14/25
Adapted from: NodeJS CS340 Starter Code
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

AJAX/HTTP Requests
02/22/2025
Based on: jQuery.ajax()
Source URL: https://api.jquery.com/jQuery.ajax/

AJAX/jQuery API Documentation
02/22/2025
Based on: Category: Ajax
Source URL: https://api.jquery.com/category/ajax/

Innertext usage
02/22/2025
Based on: HTMLElement: innerText property
Source URL: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText

Reloading page (so reloading page won't be necessary)
03/07/2025
Based on: XML HttpRequest
Source URL: https://www.w3schools.com/xml/xml_http.asp
*/

document.addEventListener("DOMContentLoaded", function () {
    // Get buttons
    const createAuthorBtn = document.getElementById("createAuthorBtn");

    // Get modals
    const createAuthorForm = document.getElementById("createAuthorForm");

    // Get all close buttons
    const closeButtons = document.querySelectorAll("#closeForm");

    // Open modal when button is clicked
    createAuthorBtn?.addEventListener("click", () => createAuthorForm.showModal());

    // Close modals when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            this.closest("dialog").close();
        });
    });
});

// Get the form for adding an author
let addAuthorForm = document.getElementById('add-author-form-ajax');

addAuthorForm.addEventListener("submit", function (e) {
    // Prevent default form submission
    e.preventDefault();

    // Get form fields
    let inputAuthorName = document.getElementById("input-authorName");

    // Get values
    let authorNameValue = inputAuthorName.value;

    if (!authorNameValue) {
        alert("Author name cannot be empty.");
        return;
    }

    // Prepare data to send
    let data = { authorName: authorNameValue };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-author-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            try {
                let response = JSON.parse(xhttp.response);
                console.log("Parsed response:", response);

                if (response.success) {
                    addRowToTable(response.authors[response.authors.length - 1]);

                    // Clear input fields
                    inputAuthorName.value = '';
                    location.reload();
                    document.getElementById("createAuthorForm").close();
                } else {
                    console.error("Failed to add author.");
                }
            } catch (error) {
                console.error("Error parsing response:", error);
            }
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
});

function deleteAuthor(authorID) {
// Window Confirm - Code adapted from: https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
    if (window.confirm("Are you sure you want to delete this Author from the database?")) {
        let link = '/delete-author-ajax/';
        let data = {
            authorID: authorID
        };
    
        $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(authorID);
        }
        });
    }
}
      
function deleteRow(authorID){
    let table = document.getElementById("author_table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == authorID) {
            table.deleteRow(i);
            break;
        }
    }
}

// Add new author row to table
addRowToTable = (newAuthor) => {
    let currentTable = document.getElementById("author_table");

    // Create elements for new row
    let row = document.createElement("TR");

    let authorIDCell = document.createElement("TD");
    let authorNameCell = document.createElement("TD");
    let actionsCell = document.createElement("TD");

    authorIDCell.innerText = newAuthor.authorID;
    authorNameCell.innerText = newAuthor.authorName;

    // Add edit and delete buttons
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () {
        editAuthor(newAuthor.authorID);
    };

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        deleteAuthor(newAuthor.authorID);
    };

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    row.appendChild(authorIDCell);
    row.appendChild(authorNameCell);
    row.appendChild(actionsCell);

    row.setAttribute('data-value', newAuthor.authorID); // Unique identifier

    currentTable.appendChild(row);
}

function editAuthor(authorID) {
    let row = document.querySelector(`tr[data-value="${authorID}"]`);
    let authorName = row.querySelector("td:nth-child(2)").innerText;

    let editModal = document.getElementById("editAuthorForm");
    document.getElementById("editAuthorId").value = authorID;
    document.getElementById("editAuthorName").value = authorName;
    editModal.showModal();
}

// EDIT author
let editAuthorForm = document.getElementById("editAuthorForm");

editAuthorForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let authorID = document.getElementById("editAuthorId").value;
    let authorName = document.getElementById("editAuthorName").value;

    let data = { authorID: authorID, authorName: authorName };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/edit-author-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let response = JSON.parse(xhttp.response);
            if (response.success) {
                // Update the row in the table
                updateAuthorInTable(authorID, authorName);

                // Close the modal
                document.getElementById("editAuthorForm").close();
            } else {
                console.error("Failed to update author.");
            }
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
});

// function to update after edit
function updateAuthorInTable(authorID, authorName) {
    let row = document.querySelector(`tr[data-value="${authorID}"]`);
    let authorNameCell = row.querySelector("td:nth-child(2)");
    authorNameCell.innerText = authorName;
}