import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const passwordHasContent = password.length > 0;
  const isPasswordValid = password.length >= 8 && /[0-9]/.test(password) && /[\W_]/.test(password);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordFocus = () => setPasswordFocused(true);
  const handlePasswordBlur = () => setPasswordFocused(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      alert("Password does not meet the required criteria.");
      return;
    }

    try {
      await axios.post('http://localhost:8000/users/reset-password', {
        token,
        password
      });
      alert('Password has been successfully reset. You can now login with your new password.');
      navigate('/login');
    } catch (error) {
      alert('Failed to reset password. Please try again or request a new password reset link.');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <HeaderLabel>Reset Password</HeaderLabel>
        <Description>Please enter your new password below.</Description>
        <InputGroup>
          <Input
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
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
        <Button type="submit" disabled={!isPasswordValid}>Reset</Button>
      </Form>
    </Container>
  );
};

export default ResetPasswordPage;