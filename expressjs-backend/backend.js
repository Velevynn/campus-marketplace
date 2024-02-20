const express = require('express');
const app = express();
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
        email VARCHAR(255) NOT NULL UNIQUE, -- Ensure email is unique and not null
        phoneNumber VARCHAR(20) NOT NULL UNIQUE, -- Ensure phoneNumber is unique and not null
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

setupDatabase();

// Async function to check if a user already exists
async function checkIfUserExists(username, email, phoneNumber) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Check if the provided username, email, or phone number already exists
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? OR email = ? OR phoneNumber = ?', [username, email, phoneNumber]);

    // Close the connection
    await connection.end();

    // Return true if any user with the provided username, email, or phone number exists
    return rows.length > 0;
  } catch (error) {
    console.error("An error occurred while checking if the user exists:", error);
    throw error;
  }
}

// Async function to register a new user
async function registerUser(user) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Check if the user already exists
    const userExists = await checkIfUserExists(user.username, user.email, user.phoneNumber);

    if (userExists) {
      throw new Error('User with provided username, email, or phone number already exists');
    }

    // Insert the new user into the users table
    await connection.execute('INSERT INTO users (username, full_name, password, email, phoneNumber) VALUES (?, ?, ?, ?, ?)', [user.username, user.full_name, user.password, user.email, user.phoneNumber]);

    // Close the connection
    await connection.end();

    // Return success message or any other data if needed
    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    console.error("An error occurred while registering the user:", error);
    throw error;
  }
}

app.post('/users/register', async (req, res) => {
  try {
    const { username, full_name, password, email, phoneNum } = req.body;
    // Call the registerUser function passing user data
    const result = await registerUser({ username, full_name, password, email, phoneNumber: phoneNum });
    res.status(201).json(result); // Send success response
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' }); // Send error response
  }
});

module.exports = app;