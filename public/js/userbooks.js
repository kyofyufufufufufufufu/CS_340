// Function to update rating options based on status selection
$('#status, #editStatus').change(function() {
  let status = $(this).val();
  let ratingSelect = $(this).attr('id') === 'status' ? $('#rating') : $('#editRating');

  // Clear previous rating options
  ratingSelect.empty();

  ratingSelect.append('<option value="">No Rating</option>');

  // If the status is "read" or "dropped", add the 1-5 stars options (this includes when creating and editing a row)
  if (status === "read" || status === "dropped") {
      for (let i = 1; i <= 5; i++) {
          ratingSelect.append('<option value="' + i + '">' + i + ' Stars</option>');
      }
  }
});

// Init rating dropdown
$(document).ready(function() {
  $('#status').change();  // Trigger change event for add
});

// Add new user
$('#add-userbook-form').submit(function(event) {
  event.preventDefault();

  const formData = $(this).serializeArray();
  const data = {};
  formData.forEach(item => {
      data[item.name] = item.value;
  });

  $.ajax({
      url: '/add-userbook-ajax',
      type: 'POST',
      data: data,
      success: function(response) {
          if (response.success) {
              location.reload();  // Reload the page to fetch updated data
          }
      },
      error: function() {
          alert("Error adding userbook");
      }
  });
});

// Handle opening the edit modal and pre-filling data
function editUserBook(userBookID, userID, bookID, status, rating) {
  console.log("Editing UserBook:", userBookID, userID, bookID, status, rating);

  // Pre-fill form with current userbook data
  $('#editUserBookID').val(userBookID);

  // Make sure the correct user and book are selected in the dropdowns
  $('#editUser option').each(function() {
      if ($(this).val() == userID) {
          $(this).prop("selected", true);
      }
  });

  $('#editBook option').each(function() {
      if ($(this).val() == bookID) {
          $(this).prop("selected", true);
      }
  });

  // Set status and rating correctly
  $('#editStatus').val(status);
  $('#editRating').val(rating || ""); // Ensure empty values are handled

  // Update dropdown 
  $('#editStatus').change();

  // Show the modal
  document.getElementById("editUserBookForm").showModal();
}

// Editing existing user
$('#edit-userbook-form').submit(function(event) {
  event.preventDefault();

  let userBookID = $('#editUserBookID').val();
  let userID = $('#editUser').val();
  let bookID = $('#editBook').val();
  let status = $('#editStatus').val();
  let rating = $('#editRating').val();

  let data = { userBookID, userID, bookID, userBookStatus: status, userBookRating: rating };

  $.ajax({
      url: '/edit-userbook-ajax',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(response) {
          if (response.success) {
              location.reload(); // Reload to reflect changes
          }
      },
      error: function() {
          alert("Error updating userbook");
      }
  });
});

// Close edit modal when cancel button is clicked
document.getElementById("closeEditForm").addEventListener("click", function () {
  document.getElementById("editUserBookForm").close();
});

// Handle deleting a UserBook (DELETE)
function deleteUserBook(userBookID) {
  let link = '/delete-userbook-ajax/';
  let data = { userBookID: userBookID };

  $.ajax({
      url: link,
      type: 'DELETE',
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function(result) {
          deleteRow(userBookID);
      },
      error: function() {
          alert("Error deleting userbook");
      }
  });
}

// Function to remove the table row after a successful delete
function deleteRow(userBookID) {
  let row = document.querySelector(`tr[data-value="${userBookID}"]`);
  if (row) row.remove();
}
