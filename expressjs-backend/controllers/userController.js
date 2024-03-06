const userService = require('../services/userService');

const checkUserDetails = async (req, res) => {
  const { username, email, phoneNum } = req.body;
  
  try {
    const conflict = await userService.checkUserDetails(username, email, phoneNum);

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
};

const getUserID = async (req, res) => {
  const { username } = req.body;

  try {
    const userID = await userService.getUserID(username);

    if (userID) {
      res.status(200).json({ userID });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
    res.status(500).json({ error: 'Failed to fetch user ID' });
  }
};

module.exports = {
  checkUserDetails,
  getUserID
};
