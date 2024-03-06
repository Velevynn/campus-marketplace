const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authMiddleware = require('./middleware/authMiddleware');
const authController = require('./controllers/authController');
const listingController = require('./controllers/listingController');
const userController = require('./controllers/userController');

const db = require('./utils/database');
const s3 = require('./utils/s3');

const app = express();
const PORT = 8000;
const secretKey = 'YourSecretKey';

app.use(cors());
app.use(express.json());

// Middleware for verifying JWT token
app.use(authMiddleware.verifyToken);

// Routes for authentication
app.post('/users/register', authController.registerUser);
app.post('/users/login', authController.loginUser);
app.get('/users/profile', authController.getUserProfile);

// Routes for listings
app.post("/listings", upload.array('image'), listingController.addListing);
app.get("/listings", listingController.getListings);
app.get("/listings/:listingID", listingController.getListingByID);

// Routes for user details
app.post('/users/check', userController.checkUserDetails);
app.post('/users/userID', userController.getUserID);

// Initialize database
db.setupDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
