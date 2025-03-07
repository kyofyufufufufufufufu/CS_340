function deleteBookGenre(genreBookID) {
    let link = '/delete-bookgenre-ajax/';
    let data = {
        genreBookID: genreBookID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(genreBookID);
      }
    });
  }
  
function deleteRow(genreBookID){
    let table = document.getElementById("bookgenres_table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == genreBookID) {
            table.deleteRow(i);
            break;
        }
    }
}