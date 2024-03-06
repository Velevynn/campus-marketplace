const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secretKey = 'YourSecretKey';

const registerUser = async (req, res) => {
  const { username, full_name, password, email, phoneNum: phoneNumber } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await userService.registerUser({
      username,
      full_name,
      password: hashedPassword,
      email,
      phoneNumber
    });

    const token = jwt.sign({ username: username }, secretKey, { expiresIn: '24h' });
    
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userService.loginUser(username, password);

    if (user) {
      const token = jwt.sign({ username: username }, secretKey, { expiresIn: '24h' });
      res.status(200).json({ message: 'User logged in successfully', token });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
};

const getUserProfile = async (req, res) => {
  const username = req.user.username; 

  try {
    const userProfile = await userService.getUserProfile(username);

    if (userProfile) {
      res.status(200).json(userProfile);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
