import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import profileImagePlaceholder from '../assets/profile-placeholder.png';
import { Container, Button, ButtonContainer, ProfileImage, ProfileField, ProfileLabel, ProfileValue, ErrorMessage } from '../authentication/AuthenticationStyling';

function ProfilePage() {
  const [userProfile, setUserProfile] = useState({
    username: '',
    full_name: '',
    email: '',
    phoneNumber: '',
  });

  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationData, setDeleteConfirmationData] = useState({
    username: '',
    password: '',
  });
  const [deleteError, setDeleteError] = useState('');

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`https://haggle.onrender.com/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      navigate('/login');
    }
  };

  useEffect(() => {
<<<<<<< HEAD
=======
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      // Redirects to login page if no token is found
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Attempting to fetch user profile data with the stored token
        const response = await axios.get(`https://haggle.onrender.com/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Updates the profile state with fetched data
        setUserProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        navigate('/login');  // Redirects to login on error
      }
    };

>>>>>>> a8f4f0a8b9532019e851a1ff21c299d71ef7ed45
    fetchUserProfile();
  }, []);

  const handleDeleteConfirmation = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8000/users/delete`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data: {
          username: deleteConfirmationData.username,
          password: deleteConfirmationData.password
        }
      });
      
      if (response.status === 200) {
        // After successful deletion, redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed to delete profile:', error.response);
      if (error.response && error.response.data && error.response.data.error) {
        setDeleteError(error.response.data.error);
      } else {
        setDeleteError('An error occurred while deleting the profile.');
      }
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteError('');
  };

  const handleDelete = (e) => {
    e.preventDefault();
    // Perform deletion after confirmation
    handleDeleteConfirmation();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeleteConfirmationData({ ...deleteConfirmationData, [name]: value });
  };

  return (
    <div>
      <Container>
        <ProfileImage src={profileImagePlaceholder} alt="Profile" />
        <form>
          {Object.entries(userProfile).map(([key, value]) => (
            <ProfileField key={key}>
              <ProfileLabel>{key.replace('_', ' ')}:</ProfileLabel>
              <ProfileValue>{value}</ProfileValue>
            </ProfileField>
          ))}
        </form>
        <ButtonContainer>
          <Button onClick={handleChangePassword}>Change Password</Button>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </ButtonContainer>
      </Container>
      <Container>
        {!showDeleteConfirmation && (
          <Button onClick={confirmDelete}>Delete Profile</Button>
        )}
        {showDeleteConfirmation && (
          <div className="overlay">
            <form className="confirmation-form" onSubmit={handleDelete}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={deleteConfirmationData.username}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={deleteConfirmationData.password}
                onChange={handleInputChange}
                required
              />
              <div className="button-container">
                <Button type="submit">Confirm Delete</Button>
                <Button type="button" onClick={handleCancelDelete}>Cancel</Button>
              </div>
              {deleteError && <ErrorMessage>{deleteError}</ErrorMessage>}
            </form>
          </div>
        )}
      </Container>
    </div>
  );
}

export default ProfilePage;
