/*
Citation for users.js with the exception of the DOM to get modal (line 6).
Date: 02/16/25
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

// Get modal 
document.addEventListener("DOMContentLoaded", function () {
    // Get buttons
    const createUserBtn = document.getElementById("createUserBtn");

    // Get modals
    const createUserForm = document.getElementById("createUserForm");

    // Get all close buttons
    const closeButtons = document.querySelectorAll("#closeForm");

    // Open modal when "Create New User" is clicked
    createUserBtn?.addEventListener("click", () => createUserForm.showModal());

    // Close modals when "Cancel" is clicked
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            this.closest("dialog").close();
        });
    });
});

// --- CREATE NEW USER ---

// Get the form for adding a user
let addUserForm = document.getElementById('add-user-form-ajax');

addUserForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let inputUserName = document.getElementById("input-userName").value.trim();
    let inputPassword = document.getElementById("input-password").value.trim();
    let inputEmail = document.getElementById("input-email").value.trim();

    if (!inputUserName || !inputPassword || !inputEmail) {
        alert("All fields must be filled out.");
        return;
    }

    let data = { 
        userName: inputUserName, 
        password: inputPassword, 
        email: inputEmail 
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-user-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let response = JSON.parse(xhttp.response);
            // Check for 'success: true' in server response
            if (response.success) {
                // Add the newly inserted user to the table
                addRowToTable(response.users[response.users.length - 1]);
                document.getElementById("createUserForm").close();
            } else {
                console.error("Failed to add user.");
            }
        }
    };
    xhttp.send(JSON.stringify(data));
});

function addRowToTable(newUser) {
    let tableBody = document.querySelector("#users_table tbody");

    let row = document.createElement("tr");
    row.setAttribute('data-value', newUser.userID);

    // Create cells in the same order as columns
    let userIDCell = document.createElement("td");
    let userNameCell = document.createElement("td");
    let passwordCell = document.createElement("td");
    let emailCell = document.createElement("td");
    let actionsCell = document.createElement("td");

    // Fill in cell values
    userIDCell.innerText = newUser.userID;
    userNameCell.innerText = newUser.userName;
    passwordCell.innerText = newUser.password;
    emailCell.innerText = newUser.email;

    // Set up edit and delete buttons
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () {
        editUser(newUser.userID, newUser.userName, newUser.password, newUser.email);
    };

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        deleteUser(newUser.userID);
    };

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Append all cells to new row
    row.appendChild(userIDCell);
    row.appendChild(userNameCell);
    row.appendChild(passwordCell);
    row.appendChild(emailCell);
    row.appendChild(actionsCell);

    tableBody.appendChild(row);
}

// EDIT user
function editUser(userID, userName, password, email) {
    document.getElementById("editUserId").value = userID;
    document.getElementById("editUserName").value = userName;
    // If password is null/undefined, default to empty string
    document.getElementById("editPassword").value = password || "";
    document.getElementById("editEmail").value = email;

    document.getElementById("editUserForm").showModal();
}

// Form submission for editing a user
let editUserForm = document.querySelector("#editUserForm form");
editUserForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let userID = document.getElementById("editUserId").value;
    let userName = document.getElementById("editUserName").value;
    let password = document.getElementById("editPassword").value;
    let email = document.getElementById("editEmail").value;

    let data = { 
        userID: userID, 
        userName: userName, 
        email: email 
    };
    // Only include password if user actually entered one
    if (password) {
        data.password = password;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/edit-user-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let response = JSON.parse(xhttp.response);
            if (response.success) {
                // Update table row with the new data
                updateUserInTable(userID, userName, email);
                document.getElementById("editUserForm").close();
            } else {
                console.error("Failed to update user.");
            }
        }
    };
    xhttp.send(JSON.stringify(data));
});

// Update after edit
function updateUserInTable(userID, userName, email) {
    let row = document.querySelector(`tr[data-value="${userID}"]`);
    if (!row) return;

    row.cells[1].innerText = userName;
    // Keep password masked or unchanged in the table (row.cells[2])
    row.cells[3].innerText = email;
}

// DELETE user
function deleteUser(userID) {
    if (window.confirm("Are you sure you want to delete this user?")) {
        let link = '/delete-user-ajax/';
        let data = { userID: userID };

        $.ajax({
            url: link,
            type: 'DELETE',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function () {
                deleteRow(userID);
            }
        });
    }
}

// Remove row after delete
function deleteRow(userID) {
    let table = document.getElementById("users_table");
    for (let i = 0; i < table.rows.length; i++) {
        let row = table.rows[i];
        if (row.getAttribute("data-value") == userID) {
            table.deleteRow(i);
            break;
        }
    }
}