// Importing necessary React hooks and Axios for HTTP requests
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//Importing navigation hook
import { useNavigate } from 'react-router-dom';
// Importing profile image placeholder and styled components
import profileImagePlaceholder from '../assets/profile-placeholder.png';
import { Container, Button, ButtonContainer, ProfileImage, ProfileField, ProfileLabel, ProfileValue} from '../authentication/AuthenticationStyling';


// ProfilePage component to display the user's profile information
function ProfilePage() {
  // State to store the user's profile information
  const [userProfile, setUserProfile] = useState({
    username: '',
    full_name: '',
    email: '',
    phoneNumber: '',
  });

  const navigate = useNavigate();

  // Function to handle sign out action
  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Function to navigate to the change password page
  const handleChangePassword = () => {
    navigate('/change-password');
  };

  // Effect hook to fetch the user's profile information on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      // Redirects to login page if no token is found
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Attempting to fetch user profile data with the stored token
        const response = await axios.get(`http://localhost:8000/users/profile`, {
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

    fetchUserProfile();
  }, [navigate]);

  // Render the user's profile information and options to change password or sign out
  return (
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
        {/*<Button onClick={handleDeleteProfile}>Delete Profile</Button>*/}
      </ButtonContainer>
    </Container>
  );
}

export default ProfilePage;