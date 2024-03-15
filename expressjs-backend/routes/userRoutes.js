// userRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('../util/database');

const secretKey = 'YourSecretKey';

const { verifyToken } = require('../util/middleware');

const { Pool } = require('pg');
require('dotenv').config();
const connectionString = process.env.DB_CONNECTION_STRING;

function createConnection() {
  const pool = new Pool({
    connectionString: connectionString,
  });
  return pool
}

router.post('/check', async (req, res) => {
    const { username, email, phoneNumber } = req.body;
    //TODO: let phoneNumber = 1234567890
    let conflict = false;

    try {
      const connection = createConnection();
      // Check if username exists
      const { rows: usernameResult } = await connection.query(
        'SELECT 1 FROM users WHERE username = $1 LIMIT 1',
        [username]
      );
      if (usernameResult.length > 0) { conflict = 'Username'; }
      // Check if email exists
      const { rows: emailResult } = await connection.query(
        'SELECT 1 FROM users WHERE email = $1 LIMIT 1',
        [email]
      );
      if (emailResult.length > 0) { conflict = 'Email'; }

      // Check if phone number exists
      const { rows: phoneResult } = await connection.query(
        'SELECT 1 FROM users WHERE "phoneNumber" = $1 LIMIT 1',
        [phoneNumber]
      );
      if (phoneResult.length > 0) { conflict = 'Phone Number'; }
  
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
    //TODO:
    //const fullName = 'testUser';
    // It appears bcrypt was intended to be used but not imported. Ensure bcrypt is imported.
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const connection = createConnection();
      const  { result } = await connection.query(
        'INSERT INTO users (username, "fullName", password, email, "phoneNumber") VALUES ($1, $2, $3, $4, $5)',
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
      const connection = createConnection();
      const { users } = await connection.query(
        'SELECT username, password FROM users WHERE username = ?',
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
      const connection = createConnection();
      const { user } = await connection.query(
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
      const connection = createConnection();
      const { user } = await connection.query(
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
