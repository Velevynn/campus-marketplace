const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root', // Use your MySQL username
  password: '', // Use your MySQL password
  database: 'haggle_db' // Specify the database name
};

// Async function to establish database connection, create a database, and add tables
async function setupDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Create a new database
    await connection.query("CREATE DATABASE IF NOT EXISTS haggle_db");
    console.log("Database created or already exists.");

    // Use the newly created database
    await connection.query("USE haggle_db");

    // Create a new table with corrected NOT NULL constraint
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        userID INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        joinedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'users' created or already exists.");

    await connection.end();
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

// Function to create new user in the users table
async function createNewUser(username, full_name, password) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const sql = "INSERT INTO users (username, full_name, password) VALUES (?, ?, ?)";
    const values = [username, full_name, password];
    const [rows, fields] = await connection.query(sql, values);
    console.log("User inserted successfully:", rows);
    await connection.end();
  } catch (error) {
    console.error("An error occurred while inserting user:", error.message);
  }
}

// Function to edit user information in the users table based on username
async function editUserByUsername(username, newUsername, newFullName, newPassword) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const sql = "UPDATE users SET username = ?, full_name = ?, password = ? WHERE username = ?";
    const values = [newUsername, newFullName, newPassword, username];
    const [rows, fields] = await connection.query(sql, values);
    if (rows.affectedRows === 0) {
      console.log("User with username", username, "not found.");
    } else {
      console.log("User with username", username, "updated successfully.");
    }
    await connection.end();
  } catch (error) {
    console.error("An error occurred while editing user:", error.message);
  }
}

// Function to delete a user from the users table based on username
async function deleteUserByUsername(username) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const sql = "DELETE FROM users WHERE username = ?";
    const values = [username];
    const [rows, fields] = await connection.query(sql, values);
    if (rows.affectedRows === 0) {
      console.log("User with username", username, "not found.");
    } else {
      console.log("User with username", username, "deleted successfully.");
    }
    await connection.end();
  } catch (error) {
    console.error("An error occurred while deleting user:", error.message);
  }
}

// Run the setup
setupDatabase();

// Example to user 'createNewUser'
const username = "john_doe";
const full_name = "John Doe";
const password = "password123";
insertUser(username, full_name, password);

// Example usage: edit user with username 'jane_doe'
const currUsername = 'john_doe'
const currFullName = 'John Doe'
const currPassword = 'oldpassword123'
const newUsername = "janedoe";
const newFullName = "Jane Doe";
const newPassword = "newpassword123";
editUserByUsername(currentUsername, newUsername, newFullName, newPassword);

// Example usage: delete a user with username 'john_doe'
deleteUserByUsername('john_doe');