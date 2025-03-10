document.addEventListener("DOMContentLoaded", function () {
    // Get buttons
    const createBooksBtn = document.getElementById("createBooksBtn");

    // Get modals
    const createBookForm = document.getElementById("createBookForm");

    // Get all close buttons
    const closeButtons = document.querySelectorAll("#closeForm");

    // Open modals when buttons are clicked
    createBooksBtn?.addEventListener("click", () => createBookForm.showModal());

    // Close modals when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            this.closest("dialog").close();
        });
    });
});

// Get the form for adding a book
let addBookForm = document.getElementById('add-book-form-ajax');

addBookForm.addEventListener("submit", function (e) {
    // Prevent default form submission
    e.preventDefault();

    let inputBookTitle = document.getElementById("input-bookTitle");
    let inputBookDescription = document.getElementById("input-bookDescription");
    let inputBookPublishDate = document.getElementById("input-bookPublishDate");

    let bookTitleValue = inputBookTitle.value;
    let bookDescriptionValue = inputBookDescription.value;
    let bookPublishDateValue = inputBookPublishDate.value;

    if (!bookTitleValue || !bookDescriptionValue || !bookPublishDateValue) {
        alert("All fields must be filled.");
        return;
    }

    let data = {
        bookTitle: bookTitleValue,
        bookDescription: bookDescriptionValue,
        bookPublishDate: bookPublishDateValue
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Log the raw response to check the format
            console.log("Response from server:", xhttp.response);

            try {
                let response = JSON.parse(xhttp.response);
                console.log("Parsed response:", response); 

                if (response.success) {
                    // Add only the new book to the table
                    addRowToTable(response.books[response.books.length - 1]);

                    // Clear input fields
                    inputBookTitle.value = '';
                    inputBookDescription.value = '';
                    inputBookPublishDate.value = '';

                    // Close the modal
                    document.getElementById("createBookForm").close();
                } else {
                    console.error("Failed to add book.");
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

// CREATE book
function addRowToTable(newBook) {
    let currentTable = document.getElementById("books_table");

    // Create elements for new row
    let row = document.createElement("TR");

    let bookIDCell = document.createElement("TD");
    let bookTitleCell = document.createElement("TD");
    let bookDescriptionCell = document.createElement("TD");
    let bookPublishDateCell = document.createElement("TD");
    let actionsCell = document.createElement("TD");

    // Format the book's publish date to YYYY-MM-DD
    let publishDateFormatted = new Date(newBook.bookPublishDate).toISOString().split('T')[0];

    // Fill cells with data
    bookIDCell.innerText = newBook.bookID;
    bookTitleCell.innerText = newBook.bookTitle;
    bookDescriptionCell.innerText = newBook.bookDescription;
    bookPublishDateCell.innerText = publishDateFormatted;

    // Add edit and delete buttons
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () {
        editBook(newBook.bookID);
    };

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        deleteBook(newBook.bookID);
    };

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    row.appendChild(bookIDCell);
    row.appendChild(bookTitleCell);
    row.appendChild(bookDescriptionCell);
    row.appendChild(bookPublishDateCell);
    row.appendChild(actionsCell);

    row.setAttribute('data-value', newBook.bookID); // Unique identifier

    currentTable.appendChild(row);
}

function editBook(bookID) {
    let row = document.querySelector(`tr[data-value="${bookID}"]`);
    let bookTitle = row.querySelector("td:nth-child(2)").innerText;
    let bookDescription = row.querySelector("td:nth-child(3)").innerText;
    let bookPublishDate = row.querySelector("td:nth-child(4)").innerText;

    let editModal = document.getElementById("editBookForm");
    document.getElementById("editBookId").value = bookID;
    document.getElementById("editBookTitle").value = bookTitle;
    document.getElementById("editBookDescription").value = bookDescription;
    document.getElementById("editBookPublishDate").value = bookPublishDate;
    editModal.showModal();
}

// EDIT book
let editBookForm = document.getElementById("editBookForm");

editBookForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let bookID = document.getElementById("editBookId").value;
    let bookTitle = document.getElementById("editBookTitle").value;
    let bookDescription = document.getElementById("editBookDescription").value;
    let bookPublishDate = document.getElementById("editBookPublishDate").value;

    let data = { bookID: bookID, bookTitle: bookTitle, bookDescription: bookDescription, bookPublishDate: bookPublishDate };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/edit-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let response = JSON.parse(xhttp.response);
            if (response.success) {

                updateBookInTable(bookID, bookTitle, bookDescription, bookPublishDate);
                document.getElementById("editBookForm").close();
            } else {
                console.error("Failed to update book.");
            }
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
});

// Update after edit
function updateBookInTable(bookID, bookTitle, bookDescription, bookPublishDate) {
    let row = document.querySelector(`tr[data-value="${bookID}"]`);
    row.querySelector("td:nth-child(2)").innerText = bookTitle;  
    row.querySelector("td:nth-child(3)").innerText = bookDescription;
    row.querySelector("td:nth-child(4)").innerText = bookPublishDate;
}

function deleteBook(bookID) {
    // Code adapted from: https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
    if (window.confirm("Are you sure you want to delete this Book from the database?")) {
        let link = '/delete-book-ajax/';
        let data = {
        bookID: bookID
        };
    
    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(bookID);
        },
        //Code source: https://stackoverflow.com/questions/1637019/how-to-get-the-jquery-ajax-error-response-text
        error: function(xhr, status, error) {
            if (xhr.status == 400) {
                alert("Can't delete this book because it's referenced in userbooks.")
            }
            else {
                alert("An error occured: " + error)
            }
        }

    });
    }
}
      
function deleteRow(bookID){
    let table = document.getElementById("books_table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == bookID) {
            table.deleteRow(i);
            break;
        }
    }
}