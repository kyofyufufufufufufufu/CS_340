//{{!-- Code adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main --}}

function deleteAuthor(authorID) {
// Code adapted from: https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
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
    let table = document.getElementById("authors-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == authorID) {
            table.deleteRow(i);
            break;
        }
    }
}

  