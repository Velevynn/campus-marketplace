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
function LoginPage() {
  // State for storing user credentials, form validity, error messages, and password visibility
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  // const navigate = useNavigate();

  // Handles changes in input fields and updates the credentials state
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Toggles the visibility of the password input field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handles the form submission event for login
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Constructs the request body and sends a POST request to the login endpoint
      const requestBody = {
        identifier: credentials.identifier,
        password: credentials.password,
      };
      const response = await axios.post('https://haggle.onrender.com/users/login', requestBody);
      localStorage.setItem('token', response.data.token); // Stores the received token in local storage and navigates to the profile page
      window.location.href = '/profile';
    } catch (error) {
      // Sets an error message based on the response from the server or a general failure message
      if (error.response) {
        setErrorMessage('Error: ' + error.response.data.error);
      } else {
        setErrorMessage('Error: Login failed. Please try again.');
      }
    }
  };

  const handleGoogleLogin = () => {
    const clientId = '71122616560-tv80mel7fi0s2etitj1enhk192v06h0e.apps.googleusercontent.com';

    const redirectUrl = 'http://haggle.onrender.com/auth/google/callback';
    const scope = encodeURI('email profile');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
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
            Log in to buy, sell, and trade
        </HeaderLabel>

        <Form onSubmit={handleSubmit}>
          {errorMessage && (
            <ErrorLabel>
              {errorMessage}
            </ErrorLabel>
          )}
          <InputGroup>
            <InputLabel htmlFor="identifier" hasContent={credentials.identifier.length > 0}>Email, Phone, or Username</InputLabel>
            <Input
              type="text"
              name="identifier"
              id="identifier"
              value={credentials.identifier}
              onChange={handleChange}
              hasContent={credentials.identifier.length > 0}
              required/>
          </InputGroup>

          <InputGroup>
            <InputLabel htmlFor="password" hasContent={credentials.password.length > 0}>Password</InputLabel>
            <Input
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              value={credentials.password}
              onChange={handleChange}
              hasContent={credentials.password.length > 0}
              required/>
            <VisibilityToggle onClick={togglePasswordVisibility}>
                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </VisibilityToggle>
          </InputGroup>

          <Button type="submit" disabled={!isFormValid}>
              Log in
          </Button>

          <Button onClick={handleGoogleLogin} style={{ background: '#DB4437', marginTop: '10px' }}>
            Continue with Google
          </Button>

          <LinkedLabel>
              By logging in you agree to our {}
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

export default LoginPage;