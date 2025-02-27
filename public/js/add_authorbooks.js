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