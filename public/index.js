const createButton = document.getElementById('create');
const editButton = document.getElementById('edit');
const deleteButton = document.getElementById('delete');
const createDialog = document.getElementById('createForm');
const editDialog = document.getElementById('editForm');
const deleteDialog = document.getElementById('deleteForm');

createButton.addEventListener('click', () => {
	createDialog.showModal();
});

editButton.addEventListener('click', () => {
	editDialog.showModal();
});

deleteButton.addEventListener('click', () => {
	deleteDialog.showModal();
});

// Select all check box in table
var boxes = document.getElementsByClassName('select-row');
document.getElementById('select-all').addEventListener('change', function(e) {
	for(var i = 0; i < boxes.length; i++)
		boxes[i].checked = e.target.checked;
});

// De-select "select all" if one box unchecked.
for(var i = 0; i < boxes.length; i++) {
	boxes[i].addEventListener('change', function(e) {
		if(!e.target.checked)
			document.getElementById('select-all').checked = false;
	});
}
