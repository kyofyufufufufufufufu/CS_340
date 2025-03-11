// Code adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main --}}

// Get the objects we need to modify
let addAuthorBookForm = document.getElementById('add-author-book-form-ajax');

// Modify the objects we need
addAuthorBookForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAuthorID = document.getElementById("input-AuthorName");
    let inputBookID = document.getElementById("input-BookTitle");

    // Get the values from the form fields
    let authorIDValue = inputAuthorID.value;
    let bookIDValue = inputBookID.value;

    //Console Debugging
    console.log(`authorID: ${authorIDValue}, bookID ${bookIDValue}`)

    // Put our data we want to send in a javascript object
    let data = {
        authorID: authorIDValue,
        bookID: bookIDValue,
    }

    //Console Debugging
    console.log(`data.authorID: ${data.authorID}, data.bookID ${data.bookID}`)
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-author-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputAuthorID.value = '';
            inputBookID.value = '';
            //Code Adapted From: https://www.geeksforgeeks.org/how-to-refresh-a-page-using-jquery/
            location.reload()
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// AuthorsofBooks
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("authors-books-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let authorBookIDCell = document.createElement("TD");
    let authorNameCell = document.createElement("TD");
    let bookTitleCell = document.createElement("TD")
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    authorBookIDCell.innerText = newRow.authorBookID;
    authorNameCell.innerText = newRow.authorID;
    bookTitleCell.innerText = newRow.bookID;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteAuthor(newRow.authorBookID);
    };


    // Add the cells to the row 
    row.appendChild(authorBookIDCell);
    row.appendChild(authorNameCell);
    row.appendChild(bookTitleCell);
    row.appendChild(deleteCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.authorBookID);

    // Add the row to the table
    currentTable.appendChild(row);
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


function deleteAuthorBook(authorBookID) {
    let link = '/delete-author-book-ajax/';
    let data = {
      authorBookID: authorBookID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(authorBookID);
      }
    });
  }
  
function deleteRow(authorBookID){
    let table = document.getElementById("authors-books-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == authorBookID) {
            table.deleteRow(i);
            break;
        }
    }
}