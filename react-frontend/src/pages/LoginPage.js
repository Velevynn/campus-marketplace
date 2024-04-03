import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoImage from '../assets/haggle-horizontal.png';
import { FaEye, FaEyeSlash  } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, InputGroup, Input, InputLabel, VisibilityToggle, Button, LinkedLabel, ForgotPasswordLabel, BottomContainer, BottomLabel } from './AuthenticationStyling';

function LoginPage() {
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestBody = {
        identifier: credentials.identifier,
        password: credentials.password,
      };
      const response = await axios.post('http://localhost:8000/users/login', requestBody);
      localStorage.setItem('token', response.data.token); // Store the token
      navigate('/profile')
    } catch (error) {
      if (error.response) {
        setErrorMessage('Error: ' + error.response.data.error);
      } else {
        setErrorMessage('Error: Login failed. Please try again.');
      }
    }
  };

  useEffect(() => {
    const isValid = credentials.identifier.length > 0 && credentials.password.length > 0;
    setIsFormValid(isValid);
  }, [credentials]);

  return (
    <>
      <Container>
        <img src={logoImage} alt="Logo" style={{ display: 'block', margin: '0 auto 20px', maxWidth: '200px', height: 'auto' }} />
        <Form onSubmit={handleSubmit}>
        {errorMessage && (
          <div style={{ color: 'red', marginTop: '20px', fontSize: '12px' }}>
            {errorMessage}
          </div>
        )}
          <InputGroup>
            <Input
              type="text"
              name="identifier"
              id="identifier"
              value={credentials.identifier}
              onChange={handleChange}
              hasContent={credentials.identifier.length > 0}
              required/>
            <InputLabel htmlFor="identifier" hasContent={credentials.identifier.length > 0}>Email, Phone, or Username</InputLabel>
          </InputGroup>

          <InputGroup>
            <Input
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              value={credentials.password}
              onChange={handleChange}
              hasContent={credentials.password.length > 0}
              required/>
            <InputLabel htmlFor="password" hasContent={credentials.password.length > 0}>Password</InputLabel>
            <VisibilityToggle onClick={togglePasswordVisibility}>
                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
              </VisibilityToggle>
          </InputGroup>

          <Button type="submit" disabled={!isFormValid}>
              Log in
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
          Don't have an account? {}
          <Link to="/signup" style={{ display: 'inline', color: '#0056b3', fontWeight: 'bold'}}>
            Sign up
          </Link>
        </BottomLabel>
      </BottomContainer>
    </>
  );
}

export default LoginPage;