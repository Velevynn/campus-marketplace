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

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        userID INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE, -- Ensure username is unique
        full_name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL, -- Consider hashing passwords for security
        joinedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table 'users' created or already exists.");

    // Create the "Listing" table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS listings (
        listingID INT AUTO_INCREMENT PRIMARY KEY,
        userID INT NOT NULL, -- Link to users table
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        postDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expirationDate TIMESTAMP,
        bookmarkCount INT DEFAULT 0,
        quantity INT NOT NULL,
        FOREIGN KEY (userID) REFERENCES users(userID) -- Foreign key to reference users
      );
    `);
    console.log("Table 'listings' created or already exists.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        transactionID INT AUTO_INCREMENT PRIMARY KEY,
        buyerID INT NOT NULL,
        sellerID INT NOT NULL,
        listingID INT NOT NULL,
        transactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        amount DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (buyerID) REFERENCES users(userID),
        FOREIGN KEY (sellerID) REFERENCES users(userID),
        FOREIGN KEY (listingID) REFERENCES listings(listingID)
      );
    `);
    console.log("Table 'transactions' created or already exists.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS listingsDetails (
        detailsID INT AUTO_INCREMENT PRIMARY KEY,
        sellerID INT NOT NULL,
        listingID INT NOT NULL,
        location VARCHAR(255) NOT NULL,
        isBookmarked BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (sellerID) REFERENCES users(userID),
        FOREIGN KEY (listingID) REFERENCES listings(listingID)
      );
    `);
    console.log("Table 'listingsDetails' created or already exists.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        reviewID INT AUTO_INCREMENT PRIMARY KEY,
        reviewerID INT NOT NULL,
        revieweeID INT NOT NULL, -- Assuming reviews can be about sellers
        listingID INT NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        FOREIGN KEY (reviewerID) REFERENCES users(userID),
        FOREIGN KEY (revieweeID) REFERENCES users(userID),
        FOREIGN KEY (listingID) REFERENCES listings(listingID)
      );
    `);
    console.log("Table 'reviews' created or already exists.");

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