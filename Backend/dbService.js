const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.message);
        return;
    }
    console.log('Connected to the MySQL server.');
});

let instance = null; // Declare the instance variable to keep the singleton instance

class DbService {
    static getDbServiceInstance() {
        if (!instance) {
            instance = new DbService(); // Only create a new instance if it doesn't already exist
        }
        return instance;
    }

    async createUser({ username, password, firstname, lastname, salary, age, registerday, signintime }) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `INSERT INTO Users (username, password, firstname, lastname, salary, age, registerday, signintime) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
                connection.query(query, [username, password, firstname, lastname, salary, age, registerday, signintime], (err, result) => {
                    if (err) reject(new Error(err.message));
                    else resolve(result.insertId);
                });
            });
            return {
                id: response,
                username,
                password,
                firstname,
                lastname,
                salary,
                age,
                registerday,
                signintime
            };
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async getAllUsers() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Users;";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async updateUserById(username, { firstname, lastname, salary, age }) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Users SET firstname = ?, lastname = ?, salary = ?, age = ? WHERE username = ?;";
                connection.query(query, [firstname, lastname, salary, age, username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    else resolve(result.affectedRows);
                });
            });
            return response === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async deleteUserById(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM Users WHERE username = ?;";
                connection.query(query, [username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    else resolve(result.affectedRows);
                });
            });
            return response === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

module.exports = DbService;
