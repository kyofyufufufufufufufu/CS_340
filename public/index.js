document.addEventListener("DOMContentLoaded", function () {
    // Track selected items (this will be reset when Edit/Delete is clicked)
    let selectedItems = {
        books: [],
        users: [],
        authors: []
    };

    // Get buttons for books, authors, and users
    const createBooksButton = document.getElementById('createBooksBtn');
    const editBooksButton = document.getElementById('editBookBtn');
    const deleteBooksButton = document.getElementById('deleteBookBtn');

    const createUsersButton = document.getElementById('createUserBtn');
    const editUsersButton = document.getElementById('editUserBtn');
    const deleteUsersButton = document.getElementById('deleteUserBtn');

    const createAuthorsButton = document.getElementById('createAuthorBtn');
    const editAuthorsButton = document.getElementById('editAuthorBtn');
    const deleteAuthorsButton = document.getElementById('deleteAuthorBtn');

    // Get modals for books, users, and authors
    const createBooksDialog = document.getElementById('createBookForm');
    const editBooksDialog = document.getElementById('editBookForm');
    const deleteBooksDialog = document.getElementById('deleteBookForm');

    const createUserDialog = document.getElementById('createUserForm');
    const editUserDialog = document.getElementById('editUserForm');
    const deleteUserDialog = document.getElementById('deleteUserForm');

    const createAuthorDialog = document.getElementById('createAuthorForm');
    const editAuthorDialog = document.getElementById('editAuthorForm');
    const deleteAuthorDialog = document.getElementById('deleteAuthorForm');

    // Get all close buttons
    const closeButtons = document.querySelectorAll("#closeForm");

    // Open modals when buttons are clicked
    createBooksButton?.addEventListener("click", () => createBooksDialog.showModal());
    createUsersButton?.addEventListener("click", () => createUserDialog.showModal());
    createAuthorsButton?.addEventListener("click", () => createAuthorDialog.showModal());

    // Add event listeners for edit and delete buttons
    editBooksButton?.addEventListener("click", () => openEditModal("book", editBooksDialog));
    deleteBooksButton?.addEventListener("click", () => openDeleteModal("book", deleteBooksDialog));

    editUsersButton?.addEventListener("click", () => openEditModal("user", editUserDialog));
    deleteUsersButton?.addEventListener("click", () => openDeleteModal("user", deleteUserDialog));

    editAuthorsButton?.addEventListener("click", () => openEditModal("author", editAuthorDialog));
    deleteAuthorsButton?.addEventListener("click", () => openDeleteModal("author", deleteAuthorDialog));

    // Close modals when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            this.closest("dialog").close();
        });
    });

    // Track selections for books, users, and authors
    function trackSelection(type) {
        selectedItems[type] = [];
        document.querySelectorAll(`.select-row-${type}`).forEach(row => {
            row.addEventListener("change", function () {
                const id = this.getAttribute(`data-${type}-id`);
                if (this.checked) {
                    selectedItems[type].push(id);
                } else {
                    selectedItems[type] = selectedItems[type].filter(item => item !== id);
                }
            });
        });
    }

    // Capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Initialize selection tracking
    trackSelection("book");
    trackSelection("user");
    trackSelection("author");
});

