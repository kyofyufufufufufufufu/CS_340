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

// Modify form behavior
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

    // Set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-author-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Debugging step: log the raw response to check the format
            console.log("Response from server:", xhttp.response);

            try {
                let response = JSON.parse(xhttp.response);
                console.log("Parsed response:", response); // Check the structure of the response

                if (response.success) {
                    // Add only the new author to the table (using the first element in authors array)
                    addRowToTable(response.authors[response.authors.length - 1]);

                    // Clear input fields
                    inputAuthorName.value = '';

                    // Close the modal
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

// Function to add a new row to the table (add only the new author)
function addRowToTable(newAuthor) {
    let currentTable = document.getElementById("author_table");

    // Create elements for new row
    let row = document.createElement("TR");
    row.setAttribute('data-value', newAuthor.authorID); // Ensure row has a unique identifier
    
    let authorIDCell = document.createElement("TD");
    let authorNameCell = document.createElement("TD");
    let actionsCell = document.createElement("TD");

    // Fill cells with data
    authorIDCell.innerText = newAuthor.authorID;
    authorNameCell.innerText = newAuthor.authorName;

    // Add edit & delete buttons
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

    // Append buttons to actions cell
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Append cells to row
    row.appendChild(authorIDCell);
    row.appendChild(authorNameCell);
    row.appendChild(actionsCell);

    // Append row to table
    currentTable.appendChild(row);

    // Debugging: log the new row to check if it's properly added
    console.log("New row added:", row);
}


// Handle "Edit" button click
function editAuthor(authorID) {
    // Fetch author details to pre-fill the form
    let row = document.querySelector(`tr[data-value="${authorID}"]`);
    let authorName = row.querySelector("td:nth-child(2)").innerText;

    // Open the edit modal
    let editModal = document.getElementById("editAuthorForm");
    document.getElementById("editAuthorId").value = authorID;
    document.getElementById("editAuthorName").value = authorName;
    editModal.showModal();
}

// Handle form submission for editing an author
let editAuthorForm = document.getElementById("editAuthorForm");

editAuthorForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form fields
    let authorID = document.getElementById("editAuthorId").value;
    let authorName = document.getElementById("editAuthorName").value;

    // Prepare data to send
    let data = { authorID: authorID, authorName: authorName };

    // Set up AJAX request to update the author
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

// Function to update the author in the table after successful update
function updateAuthorInTable(authorID, authorName) {
    let row = document.querySelector(`tr[data-value="${authorID}"]`);
    let authorNameCell = row.querySelector("td:nth-child(2)");
    authorNameCell.innerText = authorName;  // Update the author's name in the table
}

// Handle "Delete" button click
function deleteAuthor(authorID) {
    let row = document.querySelector(`tr[data-value="${authorID}"]`);

    // Send AJAX request to delete author
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/delete-author-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let response = JSON.parse(xhttp.response);
            if (response.success) {
                // Remove the row from the table
                row.remove();
            } else {
                console.error("Failed to delete author.");
            }
        }
    };

    // Send the request
    xhttp.send(JSON.stringify({ authorID: authorID }));
}
