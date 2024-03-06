const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: ''
};

const setupDatabase = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    await connection.query("CREATE DATABASE IF NOT EXISTS haggle_db");
    console.log("Database created or already exists.");

    await connection.query("USE haggle_db");

    dbConfig.database = "haggle_db";

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        userID INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        full_name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phoneNumber VARCHAR(20) NOT NULL UNIQUE,
        joinedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table 'users' created or already exists.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS listings (
        listingID INT AUTO_INCREMENT PRIMARY KEY,
        userID INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        postDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expirationDate TIMESTAMP,
        bookmarkCount INT DEFAULT 0,
        quantity INT NOT NULL,
        FOREIGN KEY (userID) REFERENCES users(userID)
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
        revieweeID INT NOT NULL,
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
};

const getConnection = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

const closeConnection = async (connection) => {
  try {
    await connection.end();
  } catch (error) {
    console.error("Error closing database connection:", error);
    throw error;
  }
};

module.exports = {
  setupDatabase,
  getConnection,
  closeConnection
};
