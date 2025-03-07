function deleteUserBook(userBookID) {
    let link = '/delete-userbook-ajax/';
    let data = {
        userBookID: userBookID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(userBookID);
      }
    });
  }
  
function deleteRow(userBookID){
    let table = document.getElementById("userbooks_table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == userBookID) {
            table.deleteRow(i);
            break;
        }
    }
}