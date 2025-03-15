
/*
Citation for genres.js with the exception of handling the modal.
Date: 02/16/25 - 03/14/25
Adapted from: NodeJS CS340 Starter Code
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

AJAX/HTTP Requests
02/22/2025
Based on: jQuery.ajax()
Source URL: https://api.jquery.com/jQuery.ajax/

AJAX/jQuery API Documentation
02/22/2025
Based on: Category: Ajax
Source URL: https://api.jquery.com/category/ajax/

Innertext usage
02/22/2025
Based on: HTMLElement: innerText property
Source URL: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText

Reloading page (so reloading page won't be necessary)
03/07/2025
Based on: XML HttpRequest
Source URL: https://www.w3schools.com/xml/xml_http.asp
*/

document.addEventListener("DOMContentLoaded", function () {
    const addGenreForm = document.getElementById("add-genre-form");
    addGenreForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const inputGenreName = document.getElementById("genreName");
      const genreNameValue = inputGenreName.value.trim();

      if (!genreNameValue) {
        alert("Genre name cannot be empty.");
        return;
      }
      
      const data = { genreName: genreNameValue };
      const xhttp = new XMLHttpRequest();
      
      xhttp.open("POST", "/add-genre-ajax", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
          try {
            const response = JSON.parse(xhttp.response);
            if (response.success) {
              addRowToTable(response.genres[response.genres.length - 1]);
              inputGenreName.value = "";
            } else {
              console.error("Failed to add genre.");
            }
          } catch (error) {
            console.error("Error parsing response:", error);
          }
        } else if (xhttp.readyState === 4 && xhttp.status !== 200) {
          console.error("There was an error with the input.");
        }
      };
      
      xhttp.send(JSON.stringify(data));
    });
  
    const closeBtn = document.getElementById("closeForm");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        document.getElementById("createGenreForm").close();
      });
    }
  
    const editGenreForm = document.getElementById("edit-genre-form");
    editGenreForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const genreID = editGenreForm.dataset.genreid;
      const updatedGenreName = document.getElementById("editGenreName").value.trim();
      if (!updatedGenreName) {
        alert("Genre name cannot be empty.");
        return;
      }
      
      const data = { genreID: genreID, genreName: updatedGenreName };
      const xhttp = new XMLHttpRequest();
      
      xhttp.open("POST", "/edit-genre-ajax", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
          try {
            const response = JSON.parse(xhttp.response);
            if (response.success) {
              updateGenreInTable(genreID, updatedGenreName);
              document.getElementById("createGenreForm").close();
            } else {
              console.error("Failed to update genre.");
            }
          } catch (error) {
            console.error("Error parsing response:", error);
          }
        }
      };
      
      xhttp.send(JSON.stringify(data));
    });
  });
  
  function addRowToTable(newGenre) {
    const currentTableBody = document.getElementById("genres_table").querySelector("tbody");
    const row = document.createElement("tr");
    row.setAttribute("data-value", newGenre.genreID);
    
    const genreIDCell = document.createElement("td");
    genreIDCell.innerText = newGenre.genreID;
    
    const genreNameCell = document.createElement("td");
    genreNameCell.innerText = newGenre.genreName;
    
    const actionsCell = document.createElement("td");
    
    const editButton = document.createElement("button");
    
    editButton.textContent = "Edit";
    editButton.onclick = function () {
      editGenre(newGenre.genreID);
    };
    
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
      deleteGenre(newGenre.genreID);
    };
    
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    
    row.appendChild(genreIDCell);
    row.appendChild(genreNameCell);
    row.appendChild(actionsCell);
    
    currentTableBody.appendChild(row);
  }
  
  function deleteGenre(genreID) {
    if (window.confirm("Are you sure you want to delete this Genre from the database?")) {
      const link = "/delete-genre-ajax/";
      const data = { genreID: genreID };
      
      $.ajax({
        url: link,
        type: "DELETE",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function () {
          deleteRow(genreID);
        },
        error: function (err) {
          console.error("Error deleting genre:", err);
        }
      });
    }
  }
  
  function deleteRow(genreID) {
    const table = document.getElementById("genres_table");
    
    for (let i = 0; i < table.rows.length; i++) {
      if (table.rows[i].getAttribute("data-value") == genreID) {
        table.deleteRow(i);
        break;
      }
    }
  }
  
  function editGenre(genreID) {
    const row = document.querySelector(`tr[data-value="${genreID}"]`);
    const genreName = row.querySelector("td:nth-child(2)").innerText;
    
    //Get modal to edit genre
    const editModal = document.getElementById("createGenreForm");
    editModal.showModal();
    
    const editInput = document.getElementById("editGenreName");
    editInput.value = genreName;
    
    const editGenreForm = document.getElementById("edit-genre-form");
    editGenreForm.dataset.genreid = genreID;
  }
  
  function updateGenreInTable(genreID, updatedGenreName) {
    const row = document.querySelector(`tr[data-value="${genreID}"]`);
    if (!row) return;
    row.querySelector("td:nth-child(2)").innerText = updatedGenreName;
  }
  