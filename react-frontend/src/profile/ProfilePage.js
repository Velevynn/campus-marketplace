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
      
      <div className="vertical-center margin">
        <div className="small-container drop-shadow">
        {!showDeleteConfirmation && (
          <button className="span-button" onClick={confirmDelete}>Delete Profile</button>
        )}
        {showDeleteConfirmation && (
            <form className="" onSubmit={handleDelete}>
              <div className="margin input">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={deleteConfirmationData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="margin input">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={deleteConfirmationData.password}
                onChange={handleInputChange}
                required
              />
              </div>
              <div className="vertical-center flex-column">
                  <button className={deleteConfirmationData.username.length > 0 
                    && deleteConfirmationData.password.length > 0 ? "button" : "disabled"}>Confirm Delete</button>
                  <button onClick={handleCancelDelete}>Cancel</button>
              </div>
              {deleteError && <ErrorMessage>{deleteError}</ErrorMessage>}
            </form>
          
        )}
          </div>
      </div>
    </div>
  );
}

export default ProfilePage;
