const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create a new user
app.post('/createUser', (request, response) => {
    const { username, password, firstname, lastname, salary, age, registerday, signintime } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.createUser({ username, password, firstname, lastname, salary, age, registerday, signintime });
    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ success: false });
        });
});

// Get all users
app.get('/getAllUsers', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllUsers();

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ success: false });
        });
});

// Update a user
app.patch('/updateUser', (request, response) => {
    const { username, firstname, lastname, salary, age } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateUserById(username, { firstname, lastname, salary, age });
    result
        .then(data => response.json({ success: data }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ success: false });
        });
});

// Delete a user
app.delete('/deleteUser/:username', (request, response) => {
    const { username } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteUserById(username);
    result
        .then(data => response.json({ success: data }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ success: false });
        });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});
