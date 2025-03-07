//{{!-- Code adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main --}}
document.addEventListener("DOMContentLoaded", function () {
    // Get buttons
    const createUserBtn = document.getElementById("createUserBtn");

    // Get modals
    const createUserForm = document.getElementById("createUserForm");

    // Get all close buttons
    const closeButtons = document.querySelectorAll("#closeForm");

    // Open modals when buttons are clicked
    createUserBtn?.addEventListener("click", () => createUserForm.showModal());

    // Close modals when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            this.closest("dialog").close();
        });
    });
});

/// Get the objects we need to modify
let addUserForm = document.getElementById('add-user-form-ajax');

// Modify the objects we need
addUserForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputUserName = document.getElementById("input-userName");
    let inputPassword = document.getElementById("input-password");
    let inputEmail = document.getElementById("input-email");
    

    // Get the values from the form fields
    let userNameValue = inputUserName.value;
    let passwordValue = inputPassword.value;
    let emailValue = inputEmail.value;
    

    if (!userNameValue) {
        alert("Username cannot be blank.");
        return; 
    }
    if (!passwordValue) {
        alert("Password cannot be blank.");
        return;
    }
    if (!emailValue) {
        alert("Email cannot be blank.");
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        userName: userNameValue,
        password: passwordValue,
        email: emailValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-user-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputUserName.value = '';
            inputPassword.value = '';
            inputEmail.value = '';
            
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function deleteUser(userID) {
    // Code adapted from: https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
        if (window.confirm("Are you sure you want to delete this Author from the database?")) {
            let link = '/delete-user-ajax/';
            let data = {
                userID: userID
            };
        
            $.ajax({
            url: link,
            type: 'DELETE',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function(result) {
                deleteRow(userID);
            }
            });
        }
    }
          
function deleteRow(userID){
    let table = document.getElementById("users_table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == userID) {
            table.deleteRow(i);
            break;
        }
    }
}

// Creates a single row from an Object representing a single record from 
// Users
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("user_table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let userIDCell = document.createElement("TD");
    let userNameCell = document.createElement("TD");
    let passwordCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let actionsCell = document.createElement("TD");


    // Fill the cells with correct data
    userIDCell.innerText = newRow.userID;
    userNameCell.innerText = newRow.userName;
    passwordCell.innerText = newRow.password;
    emailCell.innerText = newRow.email;

    // Add edit & delete buttons
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () {
        editUser(data.userID);
    };

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        deleteUser(data.userID);
    };

    // Append buttons to actions cell
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);


    // Add the cells to the row 
    row.appendChild(userIDCell);
    row.appendChild(userNameCell);
    row.appendChild(passwordCell);
    row.appendChild(emailCell);
    row.appendChild(actionsCell);
 
    // Add the row to the table
    currentTable.appendChild('data-value', newRow.userID);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (userName, userID),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.userName;
    option.value = newRow.userID;
    selectMenu.add(option);
    // End of new step 8 code.

}