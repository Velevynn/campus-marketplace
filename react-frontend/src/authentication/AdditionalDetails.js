// Importing necessary React hooks and Axios for HTTP requests
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Importing navigation hooks and components for routing and navigation
import { Link } from 'react-router-dom';
// Importing logo, icons, and styled components for UI
import logoImage from '../assets/haggle-horizontal.png';
import { FaEye, FaEyeSlash  } from 'react-icons/fa';
import { Container, Form, LogoImage, ErrorLabel, InputGroup, Input, InputLabel, HeaderLabel, VisibilityToggle, Button, LinkedLabel, ForgotPasswordLabel, BottomContainer, BottomLabel } from './AuthenticationStyling';



// LoginPage component for handling user login
function AdditionalDetailsPage() {
  const [userData, setUserData] = useState({
    username: '',
    phoneNumber: '',
    email: window.location.search.split('email=')[1].split('&')[0], // Assuming email is passed as a query parameter
    name: decodeURIComponent(window.location.search.split('name=')[1])
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://haggle.onrender.com/register-google-user', userData);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/profile'; // Redirect to profile page or dashboard
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Handles changes in input fields and updates the credentials state
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Effect hook to update the form validity based on the credentials state
  useEffect(() => {
    const isValid = credentials.identifier.length > 0 && credentials.password.length > 0;
    setIsFormValid(isValid);
  }, [credentials]);

  // Renders the login form, providing fields for identifier and password, and displays error messages if any exist
  return (
    <>
      <Container>
        <LogoImage src={logoImage} alt="Logo"/>
        
        <HeaderLabel style={{ marginTop: '0px'}}>
            Enter username and phone number to finish registering with Google
        </HeaderLabel>

        <Form onSubmit={handleSubmit}>
          {errorMessage && (
            <ErrorLabel>
              {errorMessage}
            </ErrorLabel>
          )}
            <InputGroup>
                <Input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={user.phoneNumber}
                    maxLength = "10"
                    onChange={handleChange}
                    hasContent={user.phoneNumber.length > 0}
                    required />
                <InputLabel htmlFor="phoneNumber" hasContent={user.phoneNumber.length > 0}>Mobile Number</InputLabel>
                <ValidationIcon isValid={isInputValid('phoneNumber', user.phoneNumber)}>
                    {user.phoneNumber.length > 0 ? (isInputValid('phoneNumber', user.phoneNumber) ? <FaCheckCircle /> : <FaTimesCircle />) : null}
                </ValidationIcon>
            </InputGroup>

            <InputGroup>
                <Input
                    type="text"
                    name="username"
                    id="username"
                    value={user.username}
                    maxLength = "25"
                    onChange={handleChange}
                    hasContent={user.username.length > 0}
                    required />
                <InputLabel htmlFor="username" hasContent={user.username.length > 0}>Username</InputLabel>
                <ValidationIcon isValid={isInputValid('username', user.username)}>
                    {user.username.length > 0 ? (isInputValid('username', user.username) ? <FaCheckCircle /> : <FaTimesCircle />) : null}
                </ValidationIcon>
            </InputGroup>

          <Button type="submit" disabled={!isFormValid}>
              Complete registration
          </Button>

          <LinkedLabel>
              By registering you agree to our {}
                <Link to="/terms-of-service" style={{ display: 'inline', color: '#0056b3', fontWeight: 'bold'}}>
                  Terms of Service
                </Link>
              {} and acknowledge our {}
                <Link to="/privacy-policy" style={{ display: 'inline', color: '#0056b3', fontWeight: 'bold'}}>
                  Privacy Policy
                </Link>
            </LinkedLabel>

            <ForgotPasswordLabel>
            <Link to="/forgot-password" style={{ display: 'inline', color: '#0056b3'}}>
              Forgot password?
            </Link>
          </ForgotPasswordLabel>
        </Form>
      </Container>

      <BottomContainer>
        <BottomLabel>
          Don&apos;t have an account? {}
          <Link to="/signup" style={{ display: 'inline', color: '#0056b3', fontWeight: 'bold'}}>
            Sign up
          </Link>
        </BottomLabel>
      </BottomContainer>
    </>
  );
}

export default AdditionalDetailsPage;