document.addEventListener("DOMContentLoaded", function () {
    // Get buttons
    const createUserBtn = document.getElementById("createUserBtn");
    const editUserBtn = document.getElementById("editUserBtn");
    const deleteUserBtn = document.getElementById("deleteUserBtn");

    // Get modals
    const createUserForm = document.getElementById("createUserForm");
    const editUserForm = document.getElementById("editUserForm");
    const deleteUserForm = document.getElementById("deleteUserForm");

    // Get all close buttons
    const closeButtons = document.querySelectorAll("#closeForm");

    // Open modals when buttons are clicked
    createUserBtn?.addEventListener("click", () => createUserForm.showModal());

    //Edit Users event listener
    editUserBtn?.addEventListener("click", () => {
        const selectedRow = document.querySelector('input.select-row:checked');

        // If no checkbox is selected, show an alert
        if (!selectedRow) {
            alert("Please select a user to edit.");
            return;
        }

        // If a checkbox is selected, populate the fields and open the modal
        const tr = selectedRow.closest("tr");
        document.getElementById("editUserId").value = selectedRow.getAttribute("data-user-id");
        document.getElementById("editUserName").value = tr.children[2].textContent;
        document.getElementById("editPassword").value = ""; // You can leave this empty if password isn't part of the initial edit
        document.getElementById("editEmail").value = tr.children[4].textContent;

        editUserForm.showModal();
    });
    //Delete Users event listener
    deleteUserBtn?.addEventListener("click", () => {
        const selectedRow = document.querySelector('input.select-row:checked');
        
        // If no checkbox is selected, show an alert
        if (!selectedRow) {
            alert("Please select a user to delete.");
            return;
        }

        // If a checkbox is selected, show the delete confirmation modal
        const tr = selectedRow.closest("tr");
        document.getElementById("deleteUserId").value = selectedRow.getAttribute("data-user-id");
        document.getElementById("deleteUserNameText").textContent = tr.children[2].textContent;

        deleteUserForm.showModal();
    });

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


    // Fill the cells with correct data
    userIDCell.innerText = newRow.userID;
    userNameCell.innerText = newRow.userName;
    passwordCell.innerText = newRow.password;
    emailCell.innerText = newRow.email;


    // Add the cells to the row 
    row.appendChild(userIDCell);
    row.appendChild(userNameCell);
    row.appendChild(passwordCell);
    row.appendChild(emailCell);
 
    // Add the row to the table
    currentTable.appendChild(row);

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