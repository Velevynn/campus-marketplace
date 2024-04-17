// Importing necessary React hooks and Axios for HTTP requests
import React, { useState } from 'react';
import axios from 'axios';
// Navigation hooks for redirection and accessing URL parameters
import { useNavigate, useSearchParams } from 'react-router-dom';
// Importing the logo image, icons, and styled components for the layout
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import logoImage from '../assets/haggle-horizontal.png';
import {
  Container,
  Form,
  HeaderLabel,
  Description,
  InputGroup,
  InputLabel,
  Input,
  VisibilityToggle,
  Button,
  PasswordRules,
} from './AuthenticationStyling';

// ResetPasswordPage component for handling password reset functionality
const ResetPasswordPage = () => {
  // State hooks for managing password input and visibility
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Password validity checks
  const passwordHasContent = password.length > 0;
  const isPasswordValid = password.length >= 8 && /[0-9]/.test(password) && /[\W_]/.test(password);

  // Toggles the visibility of the password input field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Functions to set focus on the password field, used to show/hide password rules
  const handlePasswordFocus = () => setPasswordFocused(true);
  const handlePasswordBlur = () => setPasswordFocused(false);

  // Handles the form submission for password reset
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submit action... until form is filled

    // Validates the password before attempting to reset
    if (!isPasswordValid) {
      alert("Password does not meet the required criteria.");
      return;
    }

    try {
      // Attempts to reset password in db
      await axios.post('http://localhost:8000/users/reset-password', {
        token,
        password
      });
      // Alerts the user of success and navigates to login page... show something on page instead
      alert('Password has been successfully reset. You can now login with your new password.');
      navigate('/login');
    } catch (error) {
      // Alerts the user in case of an error... show something on page instead
      alert('Failed to reset password. Please try again or request a new password reset link.');
    }
  };

  // Renders the reset password form
  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <img src={logoImage} alt="Logo" style={{ display: 'block', margin: '0 auto 20px', maxWidth: '200px', height: 'auto' }} />
        <HeaderLabel style={{ marginTop: '0px'}}>
            Reset Password
        </HeaderLabel>
        <Description style={{ marginTop: '0px'}}>
            Enter your new password and check it to confirm it&apos;s correct.
        </Description>
        <InputGroup>
          <Input
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            hasContent={passwordHasContent}
          />

          <InputLabel hasContent={passwordHasContent}>New Password</InputLabel> 
          {passwordFocused && (
            <PasswordRules>
            <div style={{ color: password.length >= 8 ? 'green' : 'red' }}>
              {password.length >= 8 ? <FaCheckCircle style={{ marginRight: '8px', position: 'relative', top: '2px' }} /> : <FaTimesCircle style={{ marginRight: '8px', position: 'relative', top: '2px' }} />}
              At least 8 characters
            </div>
            <div style={{ color: /[0-9]/.test(password) ? 'green' : 'red' }}>
              {/[0-9]/.test(password) ? <FaCheckCircle style={{ marginRight: '8px', position: 'relative', top: '2px' }} /> : <FaTimesCircle style={{ marginRight: '8px', position: 'relative', top: '2px' }} />}
              At least one number
            </div>
            <div style={{ color: /[\W_]/.test(password) ? 'green' : 'red' }}>
              {/[\W_]/.test(password) ? <FaCheckCircle style={{ marginRight: '8px', position: 'relative', top: '2px' }} /> : <FaTimesCircle style={{ marginRight: '8px', position: 'relative', top: '2px' }} />}
              At least one special character
            </div>
          </PasswordRules>
          )}
          <VisibilityToggle onClick={togglePasswordVisibility}>
            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
          </VisibilityToggle>
        </InputGroup>
        <Button type="submit" disabled={!isPasswordValid} style={{ marginTop: '20px'}}>Reset</Button>
      </Form>
    </Container>
  );
};

export default ResetPasswordPage;