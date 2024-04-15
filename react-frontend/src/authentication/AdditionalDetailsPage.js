import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import navigate hook for redirection after form submission

import { HeaderLabel, Container, Form, LogoImage, ErrorLabel, InputGroup, Input, InputLabel, Button, LinkedLabel } from './AuthenticationStyling'; // Ensure all these components are properly imported
import logoImage from '../assets/haggle-horizontal.png'; // Adjust path as necessary

function AdditionalDetailsPage() {
  const [userData, setUserData] = useState({
    username: '',
    phoneNumber: '',
    email: new URLSearchParams(window.location.search).get('email'),
    name: new URLSearchParams(window.location.search).get('name')
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Using navigate to redirect

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  // Validate form
  useEffect(() => {
    const isValid = userData.username.trim().length > 0 && userData.phoneNumber.trim().length > 0;
    setIsFormValid(isValid);
  }, [userData]);

  // Submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://haggle.onrender.com/register-google-user', userData);
      localStorage.setItem('token', response.data.token);
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <Container>
      <LogoImage src={logoImage} alt="Haggle Logo"/>
      <Form onSubmit={handleSubmit}>
        <HeaderLabel>Complete Your Registration</HeaderLabel>
        {errorMessage && <ErrorLabel>{errorMessage}</ErrorLabel>}
        <InputGroup>
          <InputLabel htmlFor="username">Username</InputLabel>
          <Input
            type="text"
            name="username"
            id="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <InputLabel htmlFor="phoneNumber">Phone Number</InputLabel>
          <Input
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <Button type="submit" disabled={!isFormValid}>
          Complete Registration
        </Button>
        <LinkedLabel>
          By registering you agree to our <Link to="/terms-of-service">Terms of Service</Link> and acknowledge our <Link to="/privacy-policy">Privacy Policy</Link>.
        </LinkedLabel>
      </Form>
    </Container>
  );
}

export default AdditionalDetailsPage;