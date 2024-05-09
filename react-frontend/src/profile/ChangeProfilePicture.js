import React, { useState } from 'react';
import Notify from '../components/ErrorNotification';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

function ChangeProfilePicture() {
  const [profileImage, setProfileImage] = useState("https://haggleimgs.s3.amazonaws.com/user/1214/bruh0.jpg");
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
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profileImage', file);

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
      <img src={profileImage} alt="Profile" className="profile-picture" />
      <label className="overlay" htmlFor="profileImage">
        <div className="overlay-text">Change Image</div>
        <input
          type="file"
          id="profileImage"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </label>
      {showNotification && <Notify message={notificationMsg} />}
    </div>
  );
}

export default ChangeProfilePicture;
