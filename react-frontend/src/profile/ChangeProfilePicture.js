import React, { useState, useEffect } from 'react';
import Notify from '../components/ErrorNotification';
import axios from 'axios';
import PropTypes from "prop-types";
import LoadingSpinner from '../components/LoadingSpinner';
import DefaultPfp from '../assets/profile-placeholder.png';

function ChangeProfilePicture(props) {
  const [profileImage, setProfileImage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    fetchIsProfilePicture();
  }, []);

  const fetchIsProfilePicture = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/users/is-profile-picture/${props.userID}`);
      const { isProfilePicture } = response.data;
      setProfileImage(isProfilePicture ? `https://haggleimgs.s3.amazonaws.com/user/${props.userID}/bruh0.jpg?${timestamp}` : DefaultPfp);
    } catch (error) {
      console.error('Error fetching isProfilePicture:', error);
    }
  };

  const handleFileChange = async (event) => {
    const MINIMUM_IMAGE_WIDTH = 100;
    const MINIMUM_IMAGE_HEIGHT = 100;
    const file = event.target.files[0];
    const userID = props.userID;

    if (!file || event.target.files.length > 1) {
      displayNotification("Please submit one image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('userID', userID);

      const validateImage = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
              if (img.width < MINIMUM_IMAGE_WIDTH || img.height < MINIMUM_IMAGE_HEIGHT) {
                reject(new Error(`Minimum image resolution: ${MINIMUM_IMAGE_WIDTH}x${MINIMUM_IMAGE_HEIGHT}px`));
              } else {
                resolve(file);
              }
            };
            img.onerror = () => reject(new Error("Failed to load image"));
          };
          reader.readAsDataURL(file);
        });
      };

      const validatedFile = await validateImage(file);
      formData.append('image', validatedFile);  // Match the field name expected by Multer
      console.log(validatedFile);

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/users/change-profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setTimestamp(Date.now());
      setProfileImage(URL.createObjectURL(validatedFile));
      displayNotification(response.data.message);
    } catch (error) {
      console.error('Error changing profile picture:', error);
      displayNotification(error.message || 'Failed to change profile picture');
    } finally {
      setLoading(false);
    }
  };

  const displayNotification = (message) => {
    setNotificationMsg(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3300);
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
