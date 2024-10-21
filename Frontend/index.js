document.addEventListener('DOMContentLoaded', function() {
    // Fetch and load all users on page load
    fetch('http://localhost:5050/getAllUsers')
    .then(response => response.json())
    .then(responseData => {
        const users = responseData.data; // Access the `data` property of the response
        if (users && Array.isArray(users)) {
            loadHTMLTable(users);
        } else {
            console.error('Unexpected data format:', responseData);
        }
    })
    .catch(error => console.error('Error fetching users:', error));

    // Event listener for adding a new user
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            const usernameInput = document.getElementById('username-input').value.trim();
            const passwordInput = document.getElementById('password-input').value.trim();
            const firstnameInput = document.getElementById('firstname-input').value.trim();
            const lastnameInput = document.getElementById('lastname-input').value.trim();
            const salaryInput = parseFloat(document.getElementById('salary-input').value.trim());
            const ageInput = parseInt(document.getElementById('age-input').value.trim());
            const registerdayInput = document.getElementById('registerday-input').value;
            const signintimeInput = document.getElementById('signintime-input').value;

            // Input validation (basic example)
            if (!usernameInput || !passwordInput || !firstnameInput || !lastnameInput || isNaN(salaryInput) || isNaN(ageInput)) {
                alert('Please fill out all fields correctly.');
                return;
            }

            fetch('http://localhost:5050/createUser', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    username: usernameInput,
                    password: passwordInput,
                    firstname: firstnameInput,
                    lastname: lastnameInput,
                    salary: salaryInput,
                    age: ageInput,
                    registerday: registerdayInput,
                    signintime: signintimeInput
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('User added:', data);
                if (data && data.username) {
                    insertRowIntoTable(data);  // Insert new user into table
                    clearInputFields();  // Clear form fields after successful submission
                } else {
                    console.error('Unexpected response format:', data);
                    alert('Error adding user.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error adding user.');
            });
        });
    } else {
        console.error('Add User button not found');
    }

    // Function to clear form input fields
    function clearInputFields() {
        document.getElementById('username-input').value = '';
        document.getElementById('password-input').value = '';
        document.getElementById('firstname-input').value = '';
        document.getElementById('lastname-input').value = '';
        document.getElementById('salary-input').value = '';
        document.getElementById('age-input').value = '';
        document.getElementById('registerday-input').value = '';
        document.getElementById('signintime-input').value = '';
    }

    // Setup event delegation for the table buttons
    document.querySelector('table tbody').addEventListener('click', function(event) {
        if (event.target.className === "delete-row-btn") {
            const id = event.target.dataset.id;
            fetch(`http://localhost:5050/deleteUser/${id}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    }
                });
        }
        if (event.target.className === "edit-row-btn") {
            // Additional logic for handling user edit
        }
    });
});

function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');

    if (data.hasOwnProperty('username') && data.hasOwnProperty('password')) {
        let tableHtml = `<tr>`;
        tableHtml += `<td>${data.username || ''}</td>`;
        tableHtml += `<td>${typeof data.password === 'object' ? JSON.stringify(data.password) : data.password}</td>`;
        tableHtml += `<td>${data.firstname || ''}</td>`;
        tableHtml += `<td>${data.lastname || ''}</td>`;
        tableHtml += `<td>${data.salary || ''}</td>`;
        tableHtml += `<td>${data.age || ''}</td>`;
        tableHtml += `<td>${new Date(data.registerday).toLocaleDateString()}</td>`;
        tableHtml += `<td>${new Date(data.signintime).toLocaleString()}</td>`;
        tableHtml += `<td><button class='delete-row-btn' data-id='${data.username}'>Delete</button></td>`;
        tableHtml += `<td><button class='edit-row-btn' data-id='${data.username}'>Edit</button></td>`;
        tableHtml += `</tr>`;

        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    } else {
        console.error('Data format incorrect:', data);
    }
}


function loadHTMLTable(users) {
    console.log(users); 
    const table = document.querySelector('table tbody');
    let tableHtml = "";
    if (users.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='9'>No Data</td></tr>";
        return;
    }
    users.forEach(user => {
        tableHtml += `<tr>`;
        tableHtml += `<td>${user.username}</td>`;
        tableHtml += `<td>${user.password}</td>`;
        tableHtml += `<td>${user.firstname}</td>`;
        tableHtml += `<td>${user.lastname}</td>`;
        tableHtml += `<td>${user.salary}</td>`;
        tableHtml += `<td>${user.age}</td>`;
        tableHtml += `<td>${new Date(user.registerday).toLocaleDateString()}</td>`;
        tableHtml += `<td>${new Date(user.signintime).toLocaleString()}</td>`;
        tableHtml += `<td><button class='delete-row-btn' data-id='${user.username}'>Delete</button></td>`;
        tableHtml += `<td><button class='edit-row-btn' data-id='${user.username}'>Edit</button></td>`;
        tableHtml += `</tr>`;
    });
    table.innerHTML = tableHtml;
}


