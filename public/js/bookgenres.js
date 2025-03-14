//  Citation for bookgenres.js with the exception of the code in line 114 to open the modal to edit BookGenre.
//  Date: 02/16/25
//  Adapted from: NodeJS CS340 Starter Code
//  Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main


// CRREATE genrebook
document.getElementById("add-genrebook-form").addEventListener("submit", function (e) {
  e.preventDefault();

  let bookID = document.getElementById("book").value;
  let genreID = document.getElementById("genre").value;

  let data = { bookID: bookID, genreID: genreID };

  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-bookgenre-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
          let response = JSON.parse(xhttp.response);
          if (response.success) {
              addRowToTable(response.bookgenres[response.bookgenres.length - 1]);
          } else {
              console.error("Failed to add book genre.");
          }
      }
  };

  xhttp.send(JSON.stringify(data));
});

// Add new row
function addRowToTable(newEntry) {
  let tableBody = document.querySelector("#bookgenres_table tbody");

  let row = document.createElement("tr");
  row.setAttribute('data-value', newEntry.genreBookID);

  let idCell = document.createElement("td");
  let genreCell = document.createElement("td");
  let bookCell = document.createElement("td");
  let actionsCell = document.createElement("td");

  idCell.innerText = newEntry.genreBookID;

  let bookName = document.querySelector(`#book option[value="${newEntry.bookID}"]`)?.textContent || "Unknown Book";
  let genreName = document.querySelector(`#genre option[value="${newEntry.genreID}"]`)?.textContent || "Unknown Genre";

  genreCell.innerText = genreName;
  bookCell.innerText = bookName;

  let editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.onclick = function () {
    editBookGenre(newEntry.genreBookID, newEntry.bookID, newEntry.genreID);
  };

  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function () {
    deleteBookGenre(newEntry.genreBookID);
  };

  actionsCell.appendChild(editButton);
  actionsCell.appendChild(deleteButton);

  row.appendChild(idCell);
  row.appendChild(genreCell);
  row.appendChild(bookCell);
  row.appendChild(actionsCell);

  tableBody.appendChild(row);
}

// EDIT bookgenre
function editBookGenre(genreBookID, genreID, bookID) {
  document.getElementById("editGenreBookID").value = genreBookID;
  document.getElementById("editBook").value = bookID;
  document.getElementById("editGenre").value = genreID;
  
  document.getElementById("editBookGenreForm").showModal();
}

document.getElementById("edit-genrebook-form").addEventListener("submit", function (e) {
  e.preventDefault();

  let genreBookID = document.getElementById("editGenreBookID").value;
  let bookID = document.getElementById("editBook").value;
  let genreID = document.getElementById("editGenre").value;

  let data = { genreBookID: genreBookID, bookID: bookID, genreID: genreID };

  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/edit-bookgenre-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
          let response = JSON.parse(xhttp.response);
          if (response.success) {
              updateRow(genreBookID, bookID, genreID);
              document.getElementById("editBookGenreForm").close();
          } else {
              console.error("Failed to update book genre.");
          }
      }
  };

  xhttp.send(JSON.stringify(data));
});

//Opens modal to edit book genre
document.addEventListener("DOMContentLoaded", function() {
  const closeEditButton = document.getElementById("closeEditForm");
  if (closeEditButton) {
    closeEditButton.addEventListener("click", function() {
      document.getElementById("editBookGenreForm").close();
    });
  }
});

// update rows
function updateRow(genreBookID, bookID, genreID) {
  let row = document.querySelector(`tr[data-value="${genreBookID}"]`);
  if (!row) return;

  let bookName = document.querySelector(`#book option[value="${bookID}"]`).textContent;
  let genreName = document.querySelector(`#genre option[value="${genreID}"]`).textContent;

  row.cells[1].innerText = genreName;
  row.cells[2].innerText = bookName;
}

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