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





