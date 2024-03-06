// userRoutes.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {verifyToken} = require('../util/middleware');
const secretKey = 'YourSecretKey';

const { dbConfig } = require('../util/database');

router.post('/check', async (req, res) => {
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

router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
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

router.get('/profile', verifyToken, async (req, res) => {
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

router.post('/userID', async (req, res) => {
    const { username } = req.body;

    try {
      const connection = await mysql.createConnection(dbConfig);
      await connection.query("USE haggle_db");
  
      const [user] = await connection.execute(
        'SELECT userID FROM users WHERE username = ?',
        [username]
      );
  
      if (user.length > 0) {
        res.status(200).json({ userID: user[0].userID });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
      res.status(500).json({ error: 'Failed to fetch user ID' });
    }
});

module.exports = router;
