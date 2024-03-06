const db = require('../utils/database');

const registerUser = async (userData) => {
  try {
    const connection = await db.getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO users (username, full_name, password, email, phoneNumber) VALUES (?, ?, ?, ?, ?)',
      [userData.username, userData.full_name, userData.password, userData.email, userData.phoneNumber]
    );

    // Close the connection to database
    await db.closeConnection(connection);

    return result;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

const loginUser = async (username, password) => {
  try {
    const connection = await db.getConnection();
    
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    // Close the connection to database
    await db.closeConnection(connection);

    if (users.length > 0) {
      const user = users[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        return user;
      }
    }
    return null;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

const getUserProfile = async (username) => {
  try {
    const connection = await db.getConnection();

    const [user] = await connection.execute(
      'SELECT username, full_name, email, phoneNumber FROM users WHERE username = ?',
      [username]
    );

    // Close the connection to database
    await db.closeConnection(connection);

    return user[0];
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

const checkUserDetails = async (username, email, phoneNum) => {
  try {
    const connection = await db.getConnection();

    let conflict = null;

    const [usernameResult] = await connection.execute(
      'SELECT 1 FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    if (usernameResult.length > 0) conflict = 'Username';

    const [emailResult] = await connection.execute(
      'SELECT 1 FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (emailResult.length > 0) conflict = 'Email';

    const [phoneResult] = await connection.execute(
      'SELECT 1 FROM users WHERE phoneNumber = ? LIMIT 1',
      [phoneNum]
    );
    if (phoneResult.length > 0) conflict = 'Phone Number';

    // Close the connection to database
    await db.closeConnection(connection);

    return conflict;
  } catch (error) {
    console.error('Error checking user details:', error);
    throw error;
  }
};

const getUserID = async (username) => {
  try {
    const connection = await db.getConnection();

    const [user] = await connection.execute(
      'SELECT userID FROM users WHERE username = ?',
      [username]
    );

    // Close the connection to database
    await db.closeConnection(connection);

    if (user.length > 0) {
      return user[0].userID;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  checkUserDetails,
  getUserID
};
