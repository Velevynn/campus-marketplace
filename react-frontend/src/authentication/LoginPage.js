import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components';
import logoImage from '../assets/haggle-horizontal.png';
import { Link } from 'react-router-dom';

// Styled components
const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  margin-top: 100px;
  padding: 40px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: Inter;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 2px;
`;

const InputLabel = styled.label`
  position: absolute;
  top: -15%;
  left: 4%;
  font-size: 14px;
  color: #999;
  transition: all 0.3s ease;
  pointer-events: none;
  font-weight: normal;

  ${props => props.hasContent && css`
    transform: translate(0%, -45%);
    font-size: 10px;
    font-weight: normal;
    color: #999;
  `}
`;

const Input = styled.input`
  position: absolute
  width: 100%;
  padding-top: 14px;
  padding-bottom: 6px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 12px;
  transition: border 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: #007b00;
    box-shadow: 0 0 8px rgba(0, 183, 0, 0.8);
  }
`;

const ForgotPasswordLabel= styled.label`
color: #666;
font-size: 11px;
text-align: left;
margin-top: 0px;
margin-bottom: 10px;
`;

const LinkedLabel = styled.label`
  color: #666;
  font-size: 12px;
  text-align: center;
  margin-top: 12px;
  font-weight: normal
`;

const Button = styled.button`
  padding: 8px;
  background-color: #16A44A;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
      background-color: #138A3E;
      border-color: #16A44A;
      
  }

  &:disabled {
    background-color: #8CCBA1;
    cursor: not-allowed;
    border-color: transparent;
  }
`;

const SignUpContainer = styled.div`
  max-width: 400px;
  min-height: 60px;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const SignUpLabel = styled.label`
  color: #666;
  font-size: 14px;
  text-align: center;
  margin: 25px;
  font-weight: normal;
  font-family: Inter;
`;

function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isFormValid, setIsFormValid] = useState(false); // Define isFormValid state
  const [errorMessage, setErrorMessage] = useState(''); // Use this if you want to display error messages (commented out due to ES)

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/users/login', credentials);
      localStorage.setItem('token', response.data.token); // Store the token
      window.location.href = '/profile';  // navigate to profile page (refresh to update nav bar for profile)
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error);
        console.log(errorMessage);
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    }
  };

  useEffect(() => {
    const isValid = credentials.username.length > 0 && credentials.password.length > 0;
    setIsFormValid(isValid);
  }, [credentials]);

  return (
    <>
      <Container>
        <img src={logoImage} alt="Logo" style={{ display: 'block', margin: '0 auto 20px', maxWidth: '200px', height: 'auto' }} />
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="text"
              name="username"
              id="username"
              value={credentials.username}
              onChange={handleChange}
              required/>
            <InputLabel htmlFor="username" hasContent={credentials.username.length > 0}>Username</InputLabel>
          </InputGroup>

          <InputGroup>
            <Input
              type="password"
              name="password"
              id="password"
              value={credentials.password}
              onChange={handleChange}
              required/>
            <InputLabel htmlFor="password" hasContent={credentials.password.length > 0}>Password</InputLabel>
          </InputGroup>

          <ForgotPasswordLabel>
            <Link to="/forgot-password" style={{ display: 'inline', color: '#0056b3'}}>
              Forgot your password?
            </Link>
          </ForgotPasswordLabel>

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
        </Form>
      </Container>

      <SignUpContainer>
        <SignUpLabel>
          Don&apos;t have an account? {}
          <Link to="/signup" style={{ display: 'inline', color: '#0056b3'}}>
            Sign up
          </Link>
        </SignUpLabel>
      </SignUpContainer>
    </>
  );
}

export default LoginPage;