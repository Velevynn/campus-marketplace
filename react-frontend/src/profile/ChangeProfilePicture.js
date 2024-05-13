import React, { useState } from 'react';
import Notify from '../components/ErrorNotification';
import axios from 'axios';
import PropTypes from "prop-types";
import LoadingSpinner from '../components/LoadingSpinner';

function ChangeProfilePicture(props) {
  const [profileImage, setProfileImage] = useState(`https://haggleimgs.s3.amazonaws.com/user/${props.userID}/bruh0.jpg`);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [loading, setLoading] = useState(false);

  function displayNotification(message) {
    setNotificationMsg(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3300);
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const userID = props.userID;
    if (!file) return;
    console.log(file);
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userID', userID);
      console.log(userID);

      console.log('FormData:', formData);

      // Send formData to backend to store in database
      // Replace the endpoint below with your backend API endpoint for changing profile picture
      const response = await axios.post(process.env.REACT_APP_BACKEND_LINK + '/users/change-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update profile image URL
      setProfileImage(URL.createObjectURL(file));
      displayNotification(response.data.message);
    } catch (error) {
      console.error('Error changing profile picture:', error);
      displayNotification('Failed to change profile picture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-picture-container">
      {loading && (
        <div className="loading-spinner">
          <LoadingSpinner />
        </div>
      )}
      <div className="profile-picture-wrapper">
        <img src={profileImage} alt="Profile" className="profile-picture" />
        <label htmlFor="profileImage" className="overlay">
          <span className="overlay-text">Change Image</span>
        </label>
        <input
          type="file"
          id="profileImage"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      {showNotification && <Notify message={notificationMsg} />}
    </div>
  );
}

ChangeProfilePicture.propTypes = {
  userID: PropTypes.string.isRequired,
};

export default ChangeProfilePicture;
