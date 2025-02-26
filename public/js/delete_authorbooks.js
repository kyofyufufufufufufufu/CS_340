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

  