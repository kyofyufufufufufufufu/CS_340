function deleteGenre(genreID) {
    // Code adapted from: https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
    if (window.confirm("Are you sure you want to delete this Genre from the database?")) {
        let link = '/delete-genre-ajax/';
        let data = {
            genreID: genreID
        };
    
        $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(genreID);
        }
        });
    }
}
          
function deleteRow(genreID){
    let table = document.getElementById("genres_table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == genreID) {
            table.deleteRow(i);
            break;
        }
    }
}