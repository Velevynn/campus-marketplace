// Importing necessary React hooks and Axios for HTTP requests
import React, { useState } from 'react';
import axios from 'axios';
// Navigation hooks for redirection and accessing URL parameters
import { useNavigate, useSearchParams } from 'react-router-dom';
// Importing the logo image, icons, and styled components for the layout
import logoImage from '../assets/haggle-horizontal.png';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
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

// ChangePasswordPage component for handling password reset functionality
const ChangePasswordPage = () => {
  // State hooks for managing password input, visibility, and focus
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();
  // Accessing the password reset token from the URL search parameters
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Validation checks for the new password
  const passwordHasContent = password.length > 0;
  const isPasswordValid = password.length >= 8 && /[0-9]/.test(password) && /[\W_]/.test(password);
  
  // Toggles the visibility of the password input field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Sets focus state for password field to show/hide password rules
  const handlePasswordFocus = () => setPasswordFocused(true);
  const handlePasswordBlur = () => setPasswordFocused(false);

  // Handles form submission for password reset
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Alert and return if the password doesn't meet criteria... change to displaying an error message on page
    if (!isPasswordValid) {
      alert("Password does not meet the required criteria.");
      return;
    }

    try {
      // Attempt to reset the password with the provided token and new password
      await axios.post('https://haggle.onrender.com/users/reset-password', {
        token,
        password
      });
      // Alert success and redirect to login page... show something on page instead
      alert('Password has been successfully reset. You can now login with your new password.');
      navigate('/login');
    } catch (error) {
      // Alert failure and suggest trying again or requesting a new link... show something on page instead
      alert('Failed to reset password. Please try again or request a new password reset link.');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <img src={logoImage} alt="Logo" style={{ display: 'block', margin: '0 auto 20px', maxWidth: '200px', height: 'auto' }} />
        <HeaderLabel style={{ marginTop: '0px'}}>
            Change Password
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
          <VisibilityToggle onClick={togglePasswordVisibility}>
            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
          </VisibilityToggle>
        </InputGroup>
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
        <Button type="submit" disabled={!isPasswordValid}>Reset</Button>
      </Form>
    </Container>
  );
};

export default ChangePasswordPage;