import React, { useState } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import {Navigate} from 'react-router-dom';

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  margin-top: 35px;
  margin-bottom: 15px;
  padding: 40px;
  padding-bottom: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Header = styled.h2`
  color: #666;
  font-size: 24px;
  text-align: center;
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 0px;
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
  padding-top: ${(props) => (props.hasContent ? "20px" : "12px")};
  padding-bottom: ${(props) => (props.hasContent ? "8px" : "8px")}
  line-height: ${props => props.hasContent ? "24px" : "18px"};
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

const VisibilityToggle = styled.span`
  position: absolute;
  top: 20%;
  right: 10px;
  color: #666;
  cursor: pointer;
`;

const Button = styled.button`
  padding: 8px;
  background-color: #16A44A;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #138A3E;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  }

  &:focus, &:active {
    outline: none;
    border-color: #16A44A;
    box-shadow: 0 0 0 2px rgba(22, 164, 74, 0.5);
  }

  &:disabled {
    background-color: #8CCBA1;
    cursor: not-allowed;
    border-color: transparent;
  }
`;

const PasswordRules = styled.div`
  display: ${props => props.show ? 'block' : 'none'};
  background-color: #f7f7f7;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  position: absolute;
  right: -360px;
  top: 0;
  width: 300px;
  z-index: 1; // Ensure the rules are on top of other elements
`;

const Rule = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 12px;
  color: ${props => props.isValid ? 'green' : 'red'};
`;


const RuleIcon = ({ isValid }) => isValid ? <FaCheckCircle style={{ marginRight: '5px' }} /> : <FaTimesCircle style={{ marginRight: '5px' }} />;

RuleIcon.propTypes = {
  isValid: PropTypes.bool.isRequired,
};

const ChangePasswordPage = () => {
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    //const navigate = useNavigate();
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
        await axios.post('https://haggle.onrender.com/users/reset-password', {
          token,
          password
        });
        alert('Password has been successfully reset. You can now login with your new password.');
        Navigate('/login');
      } catch (error) {
        alert('Failed to reset password. Please try again or request a new password reset link.');
      }
    };


  
    return (
      <Container>
        <Form onSubmit={handleSubmit}>
          <Header>Change Password</Header>
          <Description>Please enter your new password below.</Description>
          <InputGroup>
            <Input 
              type={passwordVisible ? "text" : "password"}
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              hasContent={passwordHasContent}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
            />
            <InputLabel hasContent={passwordHasContent}>New Password</InputLabel>
            <VisibilityToggle onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </VisibilityToggle>
            <PasswordRules show={passwordFocused}>
              <Rule isValid={password.length >= 8}><RuleIcon isValid={password.length >= 8}  style={{ marginRight: '2px' }}/> 8 characters minimum</Rule>
              <Rule isValid={/[0-9]/.test(password)}><RuleIcon isValid={/[0-9]/.test(password)} /> At least one number</Rule>
              <Rule isValid={/[\W_]/.test(password)}><RuleIcon isValid={/[\W_]/.test(password)} /> At least one special character</Rule>
            </PasswordRules>
          </InputGroup>
          <Button type="submit" disabled={!isPasswordValid}>Reset</Button>
        </Form>
      </Container>
    );
  };
  
  
export default ChangePasswordPage;