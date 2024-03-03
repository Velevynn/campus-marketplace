const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');

const AWS = require('aws-sdk');

const multer = require('multer');
const upload = multer(); // Set the destination folder for uploaded files
const fs = require('fs'); // Node.js file system module

const app = express();
const PORT = 8000;
const secretKey = 'YourSecretKey';

app.use(cors());
app.use(express.json());

AWS.config.update({
  accessKeyId: 'AKIAYS2NQRDTUW6UD4LX',
  secretAccessKey: 'ybDU+i3pBZFf3OUbjEwCR7VDxFJnh1obV29lvwJn',
  region: 'us-east-1'
});

const s3 = new AWS.S3();

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: ''
};

async function setupDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    await connection.query("CREATE DATABASE IF NOT EXISTS haggle_db");
    console.log("Database created or already exists.");

    await connection.query("USE haggle_db");

    dbConfig.database = "haggle_db";

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

    await connection.query(`
      CREATE TABLE IF NOT EXISTS listings (
        listingID INT AUTO_INCREMENT PRIMARY KEY,
        userID INT NOT NULL, -- Link to users table
        title VARCHAR(255) NOT NULL,
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

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) return res.status(403).send({ message: "Token is required" });

  const token = bearerHeader.split(' ')[1];
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Invalid Token" });
    req.user = decoded;
    next();
  });
};

app.post('/users/check', async (req, res) => {
  const { username, email, phoneNum } = req.body;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query("USE haggle_db");
    
    let conflict = null;

    // Check if username exists
    const [usernameResult] = await connection.execute(
      'SELECT 1 FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    if (usernameResult.length > 0) conflict = 'Username';

    // Check if email exists
    const [emailResult] = await connection.execute(
      'SELECT 1 FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (emailResult.length > 0) conflict = 'Email';

    // Check if phone number exists
    const [phoneResult] = await connection.execute(
      'SELECT 1 FROM users WHERE phoneNumber = ? LIMIT 1',
      [phoneNum]
    );
    if (phoneResult.length > 0) conflict = 'Phone Number';

    if (conflict) {
      res.status(409).json({
        exists: true,
        message: `${conflict} already exists.`,
        conflict
      });
    } else {
      res.status(200).json({
        exists: false,
        message: 'No conflicts with username, email, or phone number.'
      });
    }
  } catch (error) {
    console.error('Error checking user details:', error);
    res.status(500).json({ error: 'Failed to check user details' });
  }
});


app.post('/users/register', async (req, res) => {
  const { username, full_name, password, email, phoneNum: phoneNumber } = req.body;
  
  // It appears bcrypt was intended to be used but not imported. Ensure bcrypt is imported.
  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query("USE haggle_db");

    const [result] = await connection.execute(
      'INSERT INTO users (username, full_name, password, email, phoneNumber) VALUES (?, ?, ?, ?, ?)',
      [username, full_name, hashedPassword, email, phoneNumber]
    );

    const token = jwt.sign({ username: username }, secretKey, { expiresIn: '24h' });
    await connection.end();
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      // Handle duplicate entry error
      res.status(409).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
});

app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query("USE haggle_db");
    
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length > 0) {
      const user = users[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const token = jwt.sign({ username: username }, secretKey, { expiresIn: '24h' });
        await connection.end();
        res.status(200).json({ message: 'User logged in successfully', token });
      } else {
        res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

app.get('/users/profile', verifyToken, async (req, res) => {
  const username = req.user.username; // Extracted from token

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query("USE haggle_db");

    const [user] = await connection.execute(
      'SELECT username, full_name, email, phoneNumber FROM users WHERE username = ?',
      [username]
    );

    if (user.length > 0) {
      res.status(200).json(user[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

app.post("/listings", upload.array('image'), async (req, res) => {
  try {
    console.log(req.body); // This will log information about other form fields
    console.log(req.files); // This will log information about uploaded files

    const listingToAdd = req.body;
    const images = req.files; // Get the uploaded images

    const listingID = await addListing(listingToAdd);


    for (const image of images) {
      let i = 0;
      const imageData = image.buffer;
      console.log(imageData);
      await uploadImageToS3(`${listingID}/image${i}`, image.buffer);
      i++;
    }

    res.status(201).send(listingToAdd);
  } catch (error) {
    console.error("Error adding listing:", error);
    res.status(500).json({ error: "Failed to add listing" });
  }
});

app.get("/listings", async (req, res) => {
  try {
    const { q } = req.query; // Extract the search query parameter

    const connection = await mysql.createConnection(dbConfig);

    let query = "SELECT * FROM listings";

    // If there is a search query, modify the SQL query to include a WHERE clause
    if (q) {
      query += ` WHERE name LIKE '%${q}%' OR description LIKE '%${q}%'`;
    }

    const [results, fields] = await connection.execute(query);

    res.send(results);

    await connection.end();
  } catch (error) {
    console.error("An error occurred while fetching listings:", error);
    res.status(500).send("An error occurred while fetching listings");
  }
});

app.get("/listings/:listingID", async (req, res) => {
  try {
    const { listingID } = req.params; // Extract the listingID from request parameters
    const connection = await mysql.createConnection(dbConfig);
    // Construct SQL query to fetch the listing by its ID
    const query = "SELECT * FROM listings WHERE listingID = ?";
    const [results, fields] = await connection.execute(query, [listingID]);

    res.send(results);

    await connection.end();
  } catch (error) {
    console.error("An error occurred while fetching the listing:", error);
    res.status(500).send("An error occurred while fetching the listing");
  }
});

async function addListing(listing) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    if(listing.expirationDate === 'null') {
      listing.expirationDate = null;
    }

    //Insert the listing into the listing table
    const [result] = await connection.execute(
      "INSERT INTO listings (userID, title, price, description, expirationDate, quantity) VALUES (?, ?, ?, ?, ?, ?)",
      [
        listing.userID,
        listing.title,
        listing.price,
        listing.description,
        listing.expirationDate,
        listing.quantity,
      ],
    );

    const listingID = result.insertId;

    //Close the connection to database
    await connection.end();

    //return success
    return listingID;
  } catch (error) {
    console.error("An error occured while posting this listing:", error);
    throw error;
  }
}

const uploadImageToS3 = async (imageName, imageData) => {
  const params = {
    Bucket: 'haggle-images',
    Key: imageName,
    Body: imageData
  };

  try {
    const data = await s3.upload(params).promise();
    console.log('Image uploaded successfully:', data.Location);
    return data.Location; // Return the URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};


setupDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;