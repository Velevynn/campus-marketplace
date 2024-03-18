import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import profileImagePlaceholder from '../assets/profile-placeholder.png';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  margin-top: 50px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin: 20px auto;
  display: block;
`;

const ProfileField = styled.div`
  margin: 10px 0;
`;

const ProfileLabel = styled.span`
  font-weight: bold;
`;

const ProfileValue = styled.span`
  margin-left: 10px;
`;

const SignOutButton = styled.button`
  padding: 10px 20px;
  background-color: #f44336; /* Red */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin: 20px auto;
`;

function ProfilePage() {
  const [userProfile, setUserProfile] = useState({
    username: '',
    full_name: '',
    email: '',
    phoneNumber: '',
  });

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    window.location.href = '/login'; // navigate to profile page (refresh to update nav bar for profile)
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/profile'); // Redirect to login if there's no token
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

    fetchUserProfile();
  }, [navigate]);

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
      <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
    </Container>
  );
}

export default ProfilePage;