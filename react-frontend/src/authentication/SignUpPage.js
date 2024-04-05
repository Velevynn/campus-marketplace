// Importing necessary React hooks and Axios for HTTP requests
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Importing components for the layout, styling, and form elements
import logoImage from '../assets/haggle-horizontal.png';
import { FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash  } from 'react-icons/fa';
import { Container, Form, InputGroup, Input, InputLabel, VisibilityToggle, Button, LinkedLabel, HeaderLabel, ValidationIcon, PasswordRules, BottomContainer, BottomLabel } from './AuthenticationStyling';
// Importing navigation hooks and components for routing
import { Link, useNavigate } from 'react-router-dom';


// SignUpPage component for the user registration process
function SignUpPage() {
  // State for form data, password visibility, input focus, and form validation
  const [user, setUser] = useState({
    username: '',
    full_name: '',
    password: '',
    email: '',
    phoneNumber: '',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Function to validate form inputs based on predefined rules
  const isInputValid = (name, value) => {
    // Password validation rules
    const passwordRules = {
      minLength: value.length >= 8,
      containsNumber: /[0-9]/.test(value),
      containsSpecialChar: /[\W_]/.test(value),
    };

    // Phone number validation rules
    const phoneNumRules = {
      minLength: value.length === 10,
      maxLength: value.length === 10,
      containsNumber: /[0-9]/.test(value),
    };

    // Validation logic for different inputs
    switch (name) {
      case 'username':
        return value.length >= 3 && value.length <= 25;
      case 'full_name':
        return value.length > 0 && value.length <= 40;
      case 'password':
        return Object.values(passwordRules).every(valid => valid);
      case 'email':
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      case 'phoneNumber':
        return Object.values(phoneNumRules).every(valid => valid);
      default:
        return false;
    }
  };

  // Effect hook to update form validity based on input validation
  useEffect(() => {
    const isValid = Object.keys(user).every((key) =>
      isInputValid(key, user[key])
    );
    setIsFormValid(isValid);
  }, [user]);

  // Handlers for password input focus, visibility toggle, and general input changes
  const handlePasswordFocus = () => setPasswordFocused(true);
  const handlePasswordBlur = () => setPasswordFocused(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Special handling for phoneNumber to ensure only numbers are inputted
    if (name === "phoneNumber") {
      const filteredValue = value.replace(/[^\d]/g, '');
      setUser({
        ...user,
        [name]: filteredValue,
      });
    } else {
      setUser({
        ...user,
        [name]: value,
      });
    }
  };

  // Function to set password visiblity to true if false and vice versa
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Reset error message at the beginning of submission attempt
    setErrorMessage('');

    if (isFormValid) {
      try {
        // Check for existing user information before proceeding to registration
        const checkResponse = await axios.post('http://localhost:8000/users/check', {
          email: user.email,
          phoneNumber: user.phoneNumber,
          username: user.username,
        });
        
        // Display specific error message based on the conflict
        if (checkResponse.data.exists) {
          setErrorMessage(`${checkResponse.data.message} already exists.`);

        // Proceed with registration if no conflicts
        } else {
          const registerResponse = await axios.post('http://localhost:8000/users/register', user);
          if (registerResponse.status === 201) {
            navigate('/profile');
          }
        }
      } catch (error) {
        if (error.response) {
          // Backend provides specific error message in response
          const message = error.response.data.error || error.response.data.message;
          setErrorMessage(`Error:  ${message}`);
        } else {
          // Fallback error message for network issues or unexpected errors
          setErrorMessage('An error occurred during registration. Please try again.');
        }
      }
    // doesn't pop up since submit button is disabled until all fields are filled out... get rid of
    } else {
      setErrorMessage("Please ensure all fields are filled out correctly before submitting.");
    }
  };
  
  // Render the sign-up form with validation feedback and navigation options
  return (
    <>
    <Container>
        <img src={logoImage} alt="Haggle Logo" style={{ display: 'block', margin: '0 auto 0px', maxWidth: '200px', height: 'auto' }} />        <Form onSubmit={handleSubmit}>

          <HeaderLabel style={{ marginTop: '20px'}}>
            Join our community of Cal Poly students to buy, sell, and trade.
          </HeaderLabel>

          {errorMessage && <div style={{ color: 'red', marginTop: '0px', marginBottom: '0px', fontSize: '12px', textAlign: 'left' }}>{errorMessage}</div>}

          <InputGroup style={{ marginTop: '5px' }}>
              <Input
                type="email"
                name="email"
                id="email"
                value={user.email}
                maxLength = "50"
                onChange={handleChange}
                hasContent={user.email.length > 0}
                required />
              <InputLabel htmlFor="email" hasContent={user.email.length > 0}>Email</InputLabel>
              <ValidationIcon isValid={isInputValid('email', user.email)}>
                {user.email.length > 0 ? (isInputValid('email', user.email) ? <FaCheckCircle /> : <FaTimesCircle />) : null}
              </ValidationIcon>
            </InputGroup>

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

            <InputGroup>
                <Input
                    type="text"
                    name="full_name"
                    id="full_name"
                    maxLength = "40"
                    value={user.full_name}
                    onChange={handleChange}
                    hasContent={user.full_name.length > 0}
                    required />
                <InputLabel htmlFor="full_name" hasContent={user.full_name.length > 0}>Full Name</InputLabel>
                <ValidationIcon isValid={isInputValid('full_name', user.full_name)}>
                    {user.full_name.length > 0 ? (isInputValid('full_name', user.full_name) ? <FaCheckCircle /> : <FaTimesCircle />) : null}
                </ValidationIcon>
            </InputGroup>

            <InputGroup>
              <Input
                type={passwordVisible ? "text" : "password"}
                name="password"
                id="password"
                minLength = "8"
                value={user.password}
                onChange={handleChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                hasContent={user.password.length > 0}
                required />
              <InputLabel htmlFor="password" hasContent={user.password.length > 0}>Password</InputLabel>
              {passwordFocused && (
                  <PasswordRules>
                  <div style={{ color: user.password.length >= 8 ? 'green' : 'red' }}>
                    {user.password.length >= 8 ? <FaCheckCircle style={{ marginRight: '8px', position: 'relative', top: '2px' }} /> : <FaTimesCircle style={{ marginRight: '8px', position: 'relative', top: '2px' }} />}
                    At least 8 characters
                  </div>
                  <div style={{ color: /[0-9]/.test(user.password) ? 'green' : 'red' }}>
                    {/[0-9]/.test(user.password) ? <FaCheckCircle style={{ marginRight: '8px', position: 'relative', top: '2px' }} /> : <FaTimesCircle style={{ marginRight: '8px', position: 'relative', top: '2px' }} />}
                    At least one number
                  </div>
                  <div style={{ color: /[\W_]/.test(user.password) ? 'green' : 'red' }}>
                    {/[\W_]/.test(user.password) ? <FaCheckCircle style={{ marginRight: '8px', position: 'relative', top: '2px' }} /> : <FaTimesCircle style={{ marginRight: '8px', position: 'relative', top: '2px' }} />}
                    At least one special character
                  </div>
                </PasswordRules>
              )}
              <VisibilityToggle onClick={togglePasswordVisibility}>
                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
              </VisibilityToggle>
            </InputGroup>
            
            <Button type="submit" disabled={!isFormValid}>
                Sign Up
            </Button>

            <LinkedLabel>
              By signing up you agree to our {}
                <Link to="/terms-of-service" style={{ display: 'inline', color: '#0056b3', fontWeight: 'bold'}}>
                  Terms of Service
                </Link>
              {} and acknowledge our {}
                <Link to="/privacy-policy" style={{ display: 'inline', color: '#0056b3', fontWeight: 'bold'}}>
                  Privacy Policy
                </Link>
            </LinkedLabel>
        </Form>

        </Container>
        <BottomContainer>
          <BottomLabel>
            Already have an account? {}
            <Link to="/login" style={{ display: 'inline', color: '#0056b3', fontWeight: 'bold'}}>
              Log in
            </Link>
          </BottomLabel>
      </BottomContainer>
      </>
  );
}

export default SignUpPage;