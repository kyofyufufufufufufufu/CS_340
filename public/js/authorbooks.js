
/*
Citation for users.js with the exception of the DOM to get modal (line 6).
Date: 02/16/25
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


//  CREATE AuthorBook function
document.getElementById("add-author-book-form-ajax").addEventListener("submit", function (e) {
    e.preventDefault();

    let authorID = document.getElementById("input-AuthorName").value;
    let bookID = document.getElementById("input-BookTitle").value;

    if (!authorID || !bookID) {
        alert("Please select both an Author and a Book.");
        return;
    }

    let data = { authorID: authorID, bookID: bookID };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-author-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let response = JSON.parse(xhttp.response);
            if (response.success) {
                addRowToTable(response.authorbooks[response.authorbooks.length - 1]);
            } else {
                console.error("Failed to add author-book.");
            }
        }
    };

    xhttp.send(JSON.stringify(data));
});

// Function to add a new row dynamically to the table
function addRowToTable(newEntry) {
    let tableBody = document.querySelector("#authors-books-table tbody");

    // Create the new <tr>
    let row = document.createElement("tr");
    row.setAttribute('data-value', newEntry.authorBookID);

    // Create cells
    let idCell = document.createElement("td");
    let authorCell = document.createElement("td");
    let bookCell = document.createElement("td");
    let actionsCell = document.createElement("td");

    idCell.innerText = newEntry.authorBookID;

    let authorName = document.querySelector(`#input-AuthorName option[value="${newEntry.authorID}"]`)?.textContent || "Unknown Author";
    let bookTitle = document.querySelector(`#input-BookTitle option[value="${newEntry.bookID}"]`)?.textContent || "Unknown Book";

    authorCell.innerText = authorName;
    bookCell.innerText = bookTitle;

    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () {
        editAuthorBook(newEntry.authorBookID, newEntry.authorID, newEntry.bookID);
    };

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        deleteAuthorBook(newEntry.authorBookID);
    };

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Append all cells in correct order
    row.appendChild(idCell);
    row.appendChild(authorCell);
    row.appendChild(bookCell);
    row.appendChild(actionsCell);

    tableBody.appendChild(row);
}

// EDIT authorBook function
function editAuthorBook(authorBookID, authorID, bookID) {
    console.log("Editing authorBookID:", authorBookID, "authorID:", authorID, "bookID:", bookID); // Debugging

    // Pre-fill form with current data
    document.getElementById('edit-authorBookID').value = authorBookID;
    document.getElementById('edit-input-AuthorName').value = authorID; // Prefill Author dropdown
    document.getElementById('edit-input-BookTitle').value = bookID; // Prefill Book dropdown

    // Show the modal
    const modal = document.getElementById("editAuthorBookModal");
    if (modal) {
        modal.showModal();
    } else {
        console.error("Modal element not found.");
    }
}

// UPDATE
document.getElementById('edit-author-book-form-ajax').addEventListener("submit", function (e) {
    e.preventDefault();

    let authorBookID = document.getElementById("edit-authorBookID").value;
    let authorID = document.getElementById("edit-input-AuthorName").value;
    let bookID = document.getElementById("edit-input-BookTitle").value;

    if (!authorBookID || !authorID || !bookID) {
        alert("All fields must be selected before updating.");
        return;
    }

    let data = { 
        authorBookID: authorBookID, 
        authorID: authorID, 
        bookID: bookID 
    };

    // Log before sending request
    console.log("Sending update request:", JSON.stringify(data));

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/edit-author-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                let response = JSON.parse(xhttp.response);
                if (response.success) {
                    console.log("Update successful:", response);
                    updateRow(authorBookID, authorID, bookID);
                    document.getElementById("editAuthorBookModal").close();
                } else {
                    console.error("Error updating author-book relationship:", response);
                }
            } else {
                console.error("Failed to update. Server response:", xhttp.responseText);
            }
        }
    };

    xhttp.send(JSON.stringify(data));
});

// Function to close the edit modal
document.getElementById("closeEditAuthorBookModal").addEventListener("click", function () {
    document.getElementById("editAuthorBookModal").close();
});

// Function to update a row dynamically after edit
function updateRow(authorBookID, authorID, bookID) {
    let row = document.querySelector(`tr[data-value="${authorBookID}"]`);
    if (!row) {
        console.error("Row not found for update:", authorBookID);
        return;
    }

    let updatedAuthorName = document.querySelector(`#edit-input-AuthorName option[value="${authorID}"]`)?.textContent || "Unknown Author";
    let updatedBookTitle = document.querySelector(`#edit-input-BookTitle option[value="${bookID}"]`)?.textContent || "Unknown Book";

    console.log(`Updating row ${authorBookID} → Author: ${updatedAuthorName}, Book: ${updatedBookTitle}`);

    row.cells[1].innerText = updatedAuthorName;
    row.cells[2].innerText = updatedBookTitle;
}

// DELETE
function deleteAuthorBook(authorBookID) {
    let link = '/delete-author-book-ajax/';
    let data = { authorBookID: authorBookID };

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function () {
            console.log(`Deleted authorBookID: ${authorBookID}`);
            deleteRow(authorBookID);
        },
        error: function () {
            console.error("Error deleting author-book relationship.");
        }
    });
}

// Remove row after delete function
function deleteRow(authorBookID) {
    let table = document.getElementById("authors-books-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == authorBookID) {
            table.deleteRow(i);
            break;
        }
    }
}
