// Importing necessary React hooks and Axios for HTTP requests
import React, { useState } from 'react';
import axios from 'axios';
// Importing logo and styling components
import logoImage from '../assets/haggle-horizontal.png';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle  } from 'react-icons/fa';
import { Container, ValidationIcon, SuccessLabel, Description, HeaderLabel, Form, InputGroup, Input, InputLabel, Button, BottomContainer, BottomLabel } from './AuthenticationStyling';

// Component for the "Forgot Password" page
const ForgotPasswordPage = () => {
  // State hooks for managing email input and message display
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  //const navigate = useNavigate();

  // check if valid email
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Event handler for updating the email state on input change
  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  // Event handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/users/forgot-password', { email });
      // Assuming the API responds with a success message
      setMessage(response.data.message || 'If an account with that email exists, we have sent a reset password link.');
    } catch (error) {
      setMessage('Error: Failed to reset password. Please try again.');
    }
  };

  // Rendering the Forgot Password page
  return (
    <>
      <Container>
        <img src={logoImage} alt="Logo" style={{ display: 'block', margin: '0 auto 20px', maxWidth: '200px', height: 'auto' }} />
        <HeaderLabel style={{ marginTop: '0px'}}>
            Forgot Password?
        </HeaderLabel>
        <Description style={{ marginTop: '0px'}}>
            Enter your email and we will send you a link to reset your password.
        </Description>

        <Form onSubmit={handleSubmit}>
          {message && (
              <SuccessLabel>
                  {message}
              </SuccessLabel>
          )}

          <InputGroup>
            <Input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleChange}
              hasContent={email.length > 0}
              required />
            <InputLabel htmlFor="email" hasContent={email.length > 0}>Email Address</InputLabel>
            <ValidationIcon isValid={isValidEmail(email)}>
                {email.length > 0 ? (isValidEmail(email) ? <FaCheckCircle /> : <FaTimesCircle />) : null}
              </ValidationIcon>
          </InputGroup>
          
          <Button type="submit" disabled={!isValidEmail(email)} style={{ marginTop: '20px'}}>
            Send Reset Link
          </Button>
        </Form>
      </Container>

      <BottomContainer>
        <BottomLabel>
          Return to {}
          <Link to="/login" style={{ display: 'inline', color: '#0056b3', fontWeight: 'bold'}}>
            Log in
          </Link>
        </BottomLabel>
      </BottomContainer>
    </>
  );
};

export default ForgotPasswordPage;