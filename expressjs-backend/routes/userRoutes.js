// userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'YourSecretKey';
const crypto = require('crypto');
const { verifyToken } = require('../util/middleware');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DB_CONNECTION_STRING;

// Create connection pool to connect to the database.
function createConnection() {
  const pool = new Pool({
    connectionString: connectionString,
  });
  return pool
}

// Check if non-duplicate user info already exists in the database.
router.post('/check', async (req, res) => {
    const { username, email, phoneNumber } = req.body;
    let conflict = false;

    try {
      if (username === null || email === null || phoneNumber === null) {throw Error;}
      const connection = createConnection();
      // Check if username exists
      const { rows: usernameResult } = await connection.query(
        'SELECT 1 FROM users WHERE username = $1 LIMIT 1',
        [username]
      );
      if (usernameResult.length > 0) {
        conflict = 'Username';
      }

      // Check if email exists
      const { rows: emailResult } = await connection.query(
        'SELECT 1 FROM users WHERE email = $1 LIMIT 1',
        [email]
      );
      if (emailResult.length > 0) {
        conflict = 'Email';
      }

      // Check if phone number exists
      const { rows: phoneResult } = await connection.query(
        `SELECT 1 FROM users WHERE "phoneNumber" = $1 LIMIT 1`,
        [phoneNumber]
      );
      if (phoneResult.length > 0) {
        conflict = 'Phone Number';
      }
  
      // If conflict found, return specific conflict.
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
      // console.error('Error checking user details:', error);
      res.status(500).json({ error: 'Failed to check user details' });
    }
});

// Insert user info into database upon signup.
router.post('/register', async (req, res) => {
    const { username, full_name, password, email, phoneNum: phoneNumber } = req.body;
    //TODO:
    //const fullName = 'testUser';
    // It appears bcrypt was intended to be used but not imported. Ensure bcrypt is imported.
    try {
      if (username === null || full_name === null || password === null || email === null || phoneNumber === null) {throw Error;}
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash(password, 10);
      const connection = createConnection();

      // Insert user details into the users table.
      const  { result } = await connection.query(
        'INSERT INTO users (username, "fullName", password, email, "phoneNumber") VALUES ($1, $2, $3, $4, $5)',
        [username, full_name, hashedPassword, email, phoneNumber]
      );
      
      // Create json web token to maintain sign-in throughout pages.
      const token = jwt.sign({ username: username }, secretKey, { expiresIn: '24h' });

      await connection.end();
      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      //console.error('Error registering user:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
});

// Sign in user after verifying account details.
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  console.log('Received login request with:', { identifier, password });

  if (typeof identifier !== 'string' || typeof password !== 'string') {
    console.log('Validation error: Identifier or password is not a string.');
    return res.status(400).json({ error: 'Identifier and password are required and must be strings.' });
  }
  

  try {
    console.log('Attempting to connect to DB...');
    connection = createConnection();
    console.log('Successfully connected to DB.');

    let query = 'SELECT * FROM users WHERE ';
    let queryParams = [];

    if (identifier.includes('@')) {
      query += 'email = $1';
      queryParams.push(identifier);
      console.log('Attempting to find user by email...');
    } else if (/\d/.test(identifier)) {
      query += '"phoneNumber" = $1';
      queryParams.push(identifier);
      console.log('Attempting to find user by phone number...');
    } else {
      query += 'username = $1';
      queryParams.push(identifier);
      console.log('Attempting to find user by username...');
    }

    console.log(`Constructed query: ${query}`);
    console.log(`Query parameters:`, queryParams);

    const { rows: users } = await connection.query(query, queryParams);
    console.log('Query executed. Number of users found:', users.length);

    if (users.length > 0) {
      const user = users[0];
      console.log('User found:', user);
      const validPassword = await bcrypt.compare(password, user.password);
      console.log('Password verification result:', validPassword);

      if (validPassword) {
        const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '24h' });
        console.log('JWT token generated:', token);
        await connection.end();
        console.log('Database connection released.');
        res.status(200).json({ message: 'User logged in successfully', token });
      } else {
        console.log('Password verification failed.');
        res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      console.log('No user found matching the criteria.');
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error during login process:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});


// Retrieve profile information from token.
router.get('/profile', verifyToken, async (req, res) => {
    // Extract username from token.
    const username = req.user.username;

    try {
      const connection = createConnection();
      // Retrieve user details from extracted username...
      const { rows: user } = await connection.query(
        'SELECT username, "fullName", email, "phoneNumber" FROM users WHERE username = $1',
        [username]
      );
  
      // And if the user exists, return their information.
      if (user.length > 0) {
        res.status(200).json(user[0]);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

router.get('/userID', async (req, res) => {
    const { username } = req.body;
    try {
      if (username === null) throw Error();
      const connection = createConnection();
      // Retrieve userID from queried username.
      const { rows : user } = await connection.query(
        'SELECT "userID" FROM users WHERE username = $1',
        [req.query.username]
      );
  
      // And if user exists, return the userID.
      if (user.length > 0) {
        res.status(200).json({ userID: user[0].userID });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching userID:', error);
      res.status(500).json({ error: 'Failed to fetch userID' });
    }
});

router.delete('/delete', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) throw Error('Username and password are required');

    const connection = createConnection();

    // Check if the username exists
    const { rows: usernameResult } = await connection.query(
      'SELECT 1 FROM users WHERE username = $1 LIMIT 1',
      [username]
    );
    const usernameExists = usernameResult.length > 0;

    if (usernameExists) {
      // Check if the provided password matches the hashed password in the database
      const { rows: users } = await connection.query(
        'SELECT password FROM users WHERE username = $1',
        [username]
      );

      const user = users[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (validPassword) {
        // Delete the user account
        await connection.query(
          'DELETE FROM users WHERE username = $1',
          [username]
        );
        res.status(200).json({ message: 'Account deleted successfully' });
      } else {
        res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log("hello");
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const connection = createConnection();
    console.log("hello");
    // Verify if email exists
    const { rows: users } = await connection.query('SELECT * FROM users WHERE email = $1', [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Save the resetToken and expiration time to the user's record in the database
    await connection.query('UPDATE users SET "resetPasswordToken" = $1, "resetPasswordExpires" = $2 WHERE email = $3', [resetToken, resetExpires, email]);

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: 'no-reply.haggle@outlook.com',
        pass: 'haggle1234!'
      }
    });
  
    const mailOptions = {
      from: 'no-reply.haggle@outlook.com', // Replace with your email
      to: email, // The user's email address
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to set a new password:</p><p><a href="${resetUrl}">Reset Password</a></p>`
    };
  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send forgot password email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ message: 'Reset link sent to your email address' });
      }
    });

    await connection.end();
    
  } catch (error) {
    console.error('Error in forgot-password route:', error);
    res.status(500).json({ error: 'Failed to send forgot password email' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    const connection = createConnection();

    // Verify token and its expiration
    const { rows: users } = await connection.query('SELECT * FROM users WHERE "resetPasswordToken" = $1 AND "resetPasswordExpires" > NOW()', [token]);
    console.log(users);
    if (users.length === 0) {
      console.log("invalid");
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.query('UPDATE users SET password = $1, "resetPasswordToken" = NULL, "resetPasswordExpires" = NULL WHERE "userID" = $2', [hashedPassword, users[0].userID]);

    res.json({ message: 'Password has been reset successfully' });
    
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});


module.exports = router;
