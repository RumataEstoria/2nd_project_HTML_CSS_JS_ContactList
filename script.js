

const addButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');
const resetButton = document.getElementById('reset-button');
const recordContainer = document.querySelector('.record-container');
const deleteButton = document.getElementById('delete-button');
const searchButton = document.getElementById('search-button');

/************************************************ */
const name = document.getElementById('name');
const vacancy = document.getElementById('vacancy');
const number = document.getElementById('contact-num');

let ContactArray = [];
let id = 0;


// Object constructor for Contact
function Contact(id, name, vacancy, number) {
    this.id = id;
    this.name = name;
    this.vacancy = vacancy;
    this.number = number;
}

// Display available record
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('contacts') == null) {
        ContactArray = [];
    } else {
        ContactArray = JSON.parse(localStorage.getItem('contacts'));
        lastID(ContactArray);
    }
    displayRecord();
});

// Display Function
function displayRecord() {
    ContactArray.forEach(function (singleContact) {
        addToList(singleContact);
    });
}

// Finding the last id
function lastID(ContactArray) {
    if (ContactArray.length > 0) {
        id = ContactArray[ContactArray.length - 1].id;
    } else {
        id = 0;
    }
}

// Adding contact record

addButton.addEventListener('click', function () {
    if (checkInputFields([name, vacancy, number])) {
        // Check for duplicate contact
        if (isDuplicateContact(name.value, number.value)) {
            setMessage("error", "This contact already exists!");
        } else {
            setMessage("success", "Record added successfully!");
            id++;
            const contact = new Contact(id, name.value, vacancy.value, number.value);
            ContactArray.push(contact);
            // Storing contact record in local storage
            localStorage.setItem('contacts', JSON.stringify(ContactArray));
            clearInputFields();

            // Adding to list
            addToList(contact);
        }
    } else {
        setMessage("error", "Empty input fields or invalid input!");
    }

});

// Function to check if contact already exists

function isDuplicateContact(name, number) {
    for (let i = 0; i < ContactArray.length; i++) {
        if (ContactArray[i].name === name && ContactArray[i].number === number) {
            return true; // Contact already exists
        }
    }
    return false; // Contact does not exist
}

// Adding to List (on the DOM)
function addToList(item) {
    const newRecordDiv = document.createElement('div');
    newRecordDiv.classList.add('record-item');
    newRecordDiv.innerHTML = `
        <div class = "record-el">
            <span id = "labelling">Contact ID: </span>
            <span id = "contact-id-content">${item.id}</span>
        </div>

        <div class = "record-el">
            <span id = "labelling">Name: </span>
            <span id = "name-content">${item.name}</span>
        </div>

        <div class = "record-el">
            <span id = "labelling">Vacancy: </span>
            <span id = "vacancy-content">${item.vacancy}</span>
        </div>

        <div class = "record-el">
            <span id = "labelling">Contact Number: </span>
            <span id = "contact-num-content">${item.number}</span>
        </div>

        <button type = "button" id = "delete-button">
            <span>
                <i class = "fas fa-trash"></i>
            </span> Delete
        </button>

        <button type = "button" id = "edit-button">
            <span>
                <i class = "fas fa-edit"></i>
            </span> Edit
        </button>
        `;
    recordContainer.appendChild(newRecordDiv);
}




// Deletion of record
recordContainer.addEventListener('click', function (event) {
    //console.log(event.target);
    if (event.target.id === 'delete-button') {
        // removing from DOM
        let recordItem = event.target.parentElement;
        recordContainer.removeChild(recordItem);
        let tempContactList = ContactArray.filter(function (record) {
            return (record.id !== parseInt(recordItem.firstElementChild.lastElementChild.textContent));
        });
        ContactArray = tempContactList;
        //removing from localstorage by overwriting
        localStorage.setItem('contacts', JSON.stringify(ContactArray));
    }
});

// resetting everything (id will get set to 0)
resetButton.addEventListener('click', function () {
    ContactArray = [];
    localStorage.setItem('contacts', JSON.stringify(ContactArray));
    location.reload();
})

// Displaying status/alerts
function setMessage(status, message) {
    let messageBox = document.querySelector('.message');
    if (status == "error") {
        messageBox.innerHTML = `${message}`;
        messageBox.classList.add('error');
        removeMessage(status, messageBox);
    }
    if (status == "success") {
        messageBox.innerHTML = `${message}`;
        messageBox.classList.add('success');
        removeMessage(status, messageBox);
    }
}

// Clearing all input fields
cancelButton.addEventListener('click', function () {
    clearInputFields();
});

function clearInputFields() {
    name.value = "";
    vacancy.value = "";
    number.value = "";
}

// Removing status/alerts
function removeMessage(status, messageBox) {
    setTimeout(function () {
        messageBox.classList.remove(`${status}`);
    }, 2000);
}




// Functionality for editing contacts
function openEditModal(contact) {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'block';

    // Fill modal inputs with contact data
    document.getElementById('edit-name').value = contact.name;
    document.getElementById('edit-vacancy').value = contact.vacancy;
    document.getElementById('edit-contact-num').value = contact.number;

    // Add event listener for save button
    const saveButton = document.getElementById('save-edit-button');
    saveButton.addEventListener('click', function () {
        // Update contact data
        contact.name = document.getElementById('edit-name').value;
        contact.vacancy = document.getElementById('edit-vacancy').value;
        contact.number = document.getElementById('edit-contact-num').value;

        // Update display
        updateContactDisplay(contact);

        // Save updated contacts to localStorage
        localStorage.setItem('contacts', JSON.stringify(ContactArray));

        // Close modal
        modal.style.display = 'none';
    });
}

// Function to update the display of a contact after editing it
function updateContactDisplay(contact) {
    // Find the contact element in the DOM
    const contactElement = document.querySelector(`[data-id="${contact.id}"]`);

    // Update contact data in the DOM
    contactElement.querySelector('.name').innerText = `Name: ${contact.name}`;
    contactElement.querySelector('.vacancy').innerText = `Vacancy: ${contact.vacancy}`;
    contactElement.querySelector('.number').innerText = `Number: ${contact.number}`;
}





// Functionality for searching contacts
searchButton.addEventListener('click', function () {
    openSearchModal();
});

// Function to open search modal
function openSearchModal() {
    const modal = document.getElementById('search-modal');
    modal.style.display = 'block';
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.style.display = 'none';
    searchContacts(); // Search contacts when modal is opened
}

// Function to close search modal
function closeSearchModal() {
    const modal = document.getElementById('search-modal');
    modal.style.display = 'none';
}

// Function to close edit modal
function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'none';
}

// Function to search contacts
function searchContacts() {
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');
    const searchTerm = searchInput.value.toLowerCase();

    searchInput.addEventListener('input', function () {
        searchContacts();
    });

    // Clear previous search results
    searchResultsContainer.innerHTML = '';

    // Filter contacts based on search term
    const filteredContacts = ContactArray.filter(function (contact) {
        return contact.name.toLowerCase().includes(searchTerm) || contact.vacancy.toLowerCase().includes(searchTerm) || contact.number.includes(searchTerm);
    });

    // Display search results
    if (searchTerm.trim() !== '') {
        searchResultsContainer.style.display = 'block'; // Display search results only if there is an entered search query
        filteredContacts.forEach(function (contact) {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result');
            resultItem.innerHTML = `
        <p>Name: ${contact.name}</p>
        <p>Vacancy: ${contact.vacancy}</p>
        <p>Number: ${contact.number}</p>
        <button class="edit-button" data-id="${contact.id}">Edit</button>
        <button class="delete-button" data-id="${contact.id}">Delete</button>
        `;
            searchResultsContainer.appendChild(resultItem);
        });

        // Add event listeners for edit buttons
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const contactId = parseInt(button.getAttribute('data-id'));
                const contactToEdit = ContactArray.find(function (contact) {
                    return contact.id === contactId;
                });
                openEditModal(contactToEdit);
            });
        });
    } else {
        searchResultsContainer.style.display = 'none'; // Hide results if the search query is empty
    }
}

// Close modal when clicking outside of it
window.addEventListener('click', function (event) {
    const modal = document.getElementById('search-modal');
    if (event.target == modal) {
        closeSearchModal();
    }
});





// Input field validation
function checkInputFields(inputArr) {
    for (let i = 0; i < inputArr.length; i++) {
        if (inputArr[i].value === "") {
            return false;
        }
    }
    if (!phoneNumCheck(inputArr[2].value)) {
        return false;
    }
    return true;
}

// Phone number validation function 
function phoneNumCheck(inputtxt) {
    let phoneNo = /^(\d[-\s]?\d{3}[-\s]?\d{3}[-\s]?\d{4})$/;
    if (inputtxt.match(phoneNo)) {
        return true;
    } else {
        return false;
    }
}

// Works for the following formats: 
// X-XXX-XXX-XXXX
// X XXX XXX XXXX
// XXXXXXXXXXX
