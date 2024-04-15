// userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { verifyToken } = require('../util/middleware');
const { Pool } = require('pg');
const {google} = require('googleapis');
require('dotenv').config();

const connectionString = process.env.DB_CONNECTION_STRING; // stores supabase db connection string, allowing us to connect to supabase db

const secretKey = process.env.JWT_SECRET_KEY; // stores jtw secret key
console.log('JWT key:', secretKey);


const oauth2Client = new google.auth.OAuth2(
  process.env.REACT_APP_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/additional-details'
);
console.log('OAuth2 client initialized:', oauth2Client);
console.log('Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET);

// Create connection pool to connect to the database.
function createConnection() {
  console.log('Creating database connection...');
  const pool = new Pool({
    connectionString: connectionString,
  });
  return pool;
}

// Asynchronous route handler to check if non-duplicate user info already exists in the database.
router.post('/check', async (req, res) => { // async function means we can use await keyword to pause the function's execution at asynchronous operations without blocking the entire server's execution
    const { username, email, phoneNumber } = req.body;
    let conflict = false;

    try {
      // throw error if any fields are empty (which they shouldn't be)
      if (username === null || email === null || phoneNumber === null) {throw Error;}
      const connection = createConnection();
      // Check if username already exists in db. If so, conflict is the username
      const { rows: usernameResult } = await connection.query(
        'SELECT 1 FROM users WHERE username = $1 LIMIT 1',
        [username]
      );
      if (usernameResult.length > 0) {
        conflict = 'Username';
      }

      // Check if phone number already exists in db. If so, conflict is phone number
      const { rows: phoneResult } = await connection.query(
        `SELECT 1 FROM users WHERE "phoneNumber" = $1 LIMIT 1`,
        [phoneNumber]
      );
      if (phoneResult.length > 0) {
        conflict = 'Phone Number';
      }

      // Check if email already exists in db...
      const { rows: emailResult } = await connection.query(
        'SELECT 1 FROM users WHERE email = $1 LIMIT 1',
        [email]
      );
      if (emailResult.length > 0) {
        conflict = 'Email';
      }
  
      // If conflict for any of the above is found, we send back the error message
      if (conflict) {
        res.status(409).json({
          exists: true,
          message: `${conflict} already exists.`,
          conflict
        }); // HTTP 409 (Conflict) - element already exists for one of user's attributes
      } else { // else there is no conflict
        res.status(200).json({
          exists: false,
          message: 'No conflicts with username, email, or phone number.'
        }); // HTTP 200 (OK)
      }
    // catch any missed errors
    } catch (error) {
      // console.error('Error checking user details:', error);
      res.status(500).json({ error: 'Failed to check user details' });
    } // HTTP 500 (Internal Server Error) - unexpected conditions
});

// Insert user info into database upon signup.
router.post('/register', async (req, res) => {
    const { username, full_name, password, email, phoneNumber: phoneNumber } = req.body;
    try {
      console.log("Making Null Checks");
      if (username === null || full_name === null || password === null || email === null || phoneNumber === null) {throw Error;} // ensure fields are filled, throw error if not
      // Asynchronously hash the password using bcrypt library. 10 saltrounds = hash password 10 times. the more rounds the longer it takes to finish hashing
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash(password, 10); // await pauses execution of async function for bcrypt.hash to run
      console.log("Hashed Password: ", hashedPassword);
      const connection = createConnection();

      console.log("Inserting into users table");
      // Insert user details into the users table.
      // result is used only to execute the query... we don't actually need it for anything else
      const  { result } = await connection.query( 
        'INSERT INTO users (username, "fullName", password, email, "phoneNumber") VALUES ($1, $2, $3, $4, $5)',
        [username, full_name, hashedPassword, email, phoneNumber]
      );

      await connection.end();
      res.status(201).json({ message: 'User registered successfully', token }); // HTTP 201 (Created) - led to creation of new resource
    } catch (error) {
      //console.error('Error registering user:', error);
      res.status(500).json({ error: 'Failed to register user' }); // HTTP 500 (Internal Server Error) - unexpected condition
    }
});

// Sign in user after verifying account details.
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  console.log('Received login request with:', { identifier, password });

  if (typeof identifier !== 'string' || typeof password !== 'string') {
    console.log('Validation error: Identifier or password is not a string.');
    return res.status(400).json({ error: 'Identifier and password are required and must be strings.' }); // HTTP 400 (Bad Request) - invalid user input format
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
    } else if (/^\d+$/.test(identifier) && identifier.length === 10) {
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
        // creating JWT
        const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '24h' });
        console.log('JWT token generated:', token);
        await connection.end();
        console.log('Database connection released.');
        res.status(200).json({ message: 'User logged in successfully', token }); // HTTP 200 (OK)
      } else {
        console.log('Password verification failed.');
        res.status(401).json({ error: 'Invalid password' }); // HTTP 401 (Unauthorized) - incorrect credentials/password
      }
    } else {
      console.log('No user found matching the criteria.');
      res.status(404).json({ error: 'User not found' }); // HTTP 404 (Not Found) - can't find existing resource (user)
    }
  } catch (error) {
    console.error('Error during login process:', error);
    res.status(500).json({ error: 'Failed to log in' }); // HTTP 500 (Internal Server Error) - unexpected error/condition
  }
});

router.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Indicates that we need to retrieve a refresh token
    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    redirect_uri: 'http://localhost:3000/additional-details'
  });
  console.log('Generated Google Auth URL:', authUrl);
  res.redirect(authUrl);
});

router.get('/auth/google/callback', async (req, res) => {
  // Existing Google callback code
  try {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });
    const userInfo = await oauth2.userinfo.get();

    // Temporarily store user info (consider using sessions or a temporary store)
    // Redirect to additional input page
    res.redirect(`/additional-details?email=${encodeURIComponent(userInfo.data.email)}&name=${encodeURIComponent(userInfo.data.name)}`);
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.status(500).json({ error: 'Authentication failed', details: error });
  }
});

async function findUserByEmail(email) {
  const connection = createConnection();
  try {
    console.log(`Searching for user by email: ${email}`);
    const result = await connection.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    console.log('Database query result:', result.rows);
    return result.rows[0]; // returns undefined if no user is found
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

router.post('/register-google-user', async (req, res) => {
  const { email, name, username, phoneNumber } = req.body;
  try {
    const connection = createConnection();
    const result = await connection.query(
      'INSERT INTO users (email, "fullName", username, "phoneNumber") VALUES ($1, $2, $3, $4) RETURNING *',
      [email, name, username, phoneNumber]
    );
    connection.end();
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering Google user:', error);
    res.status(500).json({ error: 'Failed to register user' });
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
        res.status(200).json(user[0]); // HTTP (OK) - user exists
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' }); // HTTP 500 (Internal Server Error) - unexpected error/condition
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
        res.status(200).json({ userID: user[0].userID }); // HTTP 200 (OK) - user exists, return userId
      } else {
        res.status(404).json({ error: 'User not found' }); // HTTP 404 (Not Found) - error finding resource (user)
      }
    } catch (error) {
      console.error('Error fetching userID:', error);
      res.status(500).json({ error: 'Failed to fetch userID' }); // HTTP 500 (Internal Server Error) - Unexpected condition met
    }
});


// this will need to be modified to delete all listings, reviews, etc... that are dependent on userID as foreign key
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
        res.status(200).json({ message: 'Account deleted successfully' }); // HTTP 200 (OK)
      } else {
        res.status(401).json({ error: 'Invalid password' }); // HTTP 401 (Unauthorized) - lacks valid authentication credentials
      }
    } else {
      res.status(404).json({ error: 'User not found' }); // HTTP 404 (Not Found) - resource not found
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' }); // HTTP 500 (Internal Server Error) - unexpected condition met, throw error
  }
});


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const connection = createConnection();
    // Verify if email exists
    const { rows: users } = await connection.query('SELECT * FROM users WHERE email = $1', [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // use crypto to generate a new password reset token + expiration time (1 hour from now)
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now (60 * 60 * 1000) ms

    // Save the resetToken and expiration time to the user's record in the database
    await connection.query('UPDATE users SET "resetPasswordToken" = $1, "resetPasswordExpires" = $2 WHERE email = $3', [resetToken, resetExpires, email]);

    // create the reset password url using the token
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    // use nodemailer 
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: 'no-reply.haggle@outlook.com',
        pass: 'haggle1234!' // store more securely in .env file
      }
    });
  
    const mailOptions = {
      from: 'no-reply.haggle@outlook.com', // Replace with your email
      to: email, // The user's email address
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to set a new password:</p>
             <p>
                <a href="${resetUrl}">Reset Password</a>
             </p>`
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
