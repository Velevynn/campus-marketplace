import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
// Styled components
const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
const Title = styled.h2`
  text-align: center;
  color: #333;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const Label = styled.label`
  display: block;
  margin-bottom: 0px;
  color: #666;
  font-size: 12px;
`;
const InputGroup = styled.div`
  position: relative;
  margin-bottom: 0px;
`;
const Input = styled.input`
  width: 100%;
  padding: 8px;
  padding-right: 30px; /* Make room for the checkmark */
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 12px;
`;
const ValidationIcon = styled.span`
  position: absolute;
  top: 70%;
  right: 10px;
  transform: translateY(-50%);
  color: ${props => props.isValid ? 'green' : 'red'};
`;
const Button = styled.button`
    padding: 8px;
    background-color: #0056B3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s;
    &:hover {
        background-color: #003D82;
    }
`;
const SuccessMessage = styled.div`
  color: green;
  margin-top: 5px;
  font-size: 12px;
`;
const HyperLink = styled.div`
    color: blue;
    text-align: center
`;
function SignUpPage() {
    const [user, setUser] = useState({
      username: '',
      full_name: '',
      password: '',
      confirmPassword: '',
      email: '',
      phoneNum: '',
    });
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    // Validate each input field
    const isInputValid = (name, value) => {
      switch (name) {
        case 'username':
          return value.length >= 3 && value.length <= 25;
        case 'full_name':
          return value.length > 0 && value.length <= 40;
        case 'password':
          return value.length >= 8 && value.length <= 20;
        case 'confirmPassword':
          return value === user.password && value.length >= 8 && value.length <= 20;
        case 'email':
          return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value); // Updated to use a regex for email validation
        case 'phoneNum':
          return /\(\d{3}\) \d{3}-\d{4}/.test(value);
        default:
          return false;
      }
    };
    // Check the overall form validity whenever the user state changes
    useEffect(() => {
      const isValid = Object.keys(user).every((key) =>
        isInputValid(key, user[key])
      );
      setIsFormValid(isValid);
    }, [user]);
    const handleChange = (event) => {
      const { name, value } = event.target;
      let formattedValue = value;
      if (name === 'phoneNum') {
        const numbers = value.replace(/\D/g, '');
        formattedValue = numbers.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      }
      setUser({
        ...user,
        [name]: formattedValue,
      });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Check if the form is valid based on the isFormValid state
        if (isFormValid) {
          try {
            // Make the API call to register the user
            const response = await axios.post('http://localhost:8000/users/register', user, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            // Check if the user was successfully registered
            if (response.status === 201) {
              alert('User successfully registered!');
              // Reset the form state (user) here if needed
              setUser({
                username: '',
                full_name: '',
                password: '',
                confirmPassword: '',
                email: '',
                phoneNum: '',
              });
              // Optionally, update the state to show a success message
              setRegistrationSuccess(true);
            } else {
              // Handle responses that are not successful registrations
              alert('Failed to register user.');
            }
          } catch (error) {
            // Handle any errors that occur during the API call
            console.error('There was an error during the registration process:', error);
            alert('There was an error during the registration process.');
          }
        } else {
          // Optionally, inform the user that the form data is invalid
          alert("Please ensure all fields are filled out correctly before submitting.");
        }
    };
  return (
    <Container style = {{fontFamily : "Inter"}}>
        <Title>Signup Page</Title>
        <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="phoneNum">Phone Number</Label>
              <Input
                  type="tel"
                  name="phoneNum"
                  id="phoneNum"
                  value={user.phoneNum}
                  onChange={handleChange}
                  required />
              <ValidationIcon isValid={isInputValid('phoneNum', user.phoneNum)}>
                  {user.phoneNum.length > 0 ? (isInputValid('phoneNum', user.phoneNum) ? <FaCheckCircle /> : <FaTimesCircle />) : null}
              </ValidationIcon>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                  type="email"
                  name="email"
                  id="email"
                  value={user.email}
                  onChange={handleChange}
                  required />
              <ValidationIcon isValid={isInputValid('email', user.email)}>
                {user.email.length > 0 ? (isInputValid('email', user.email) ? <FaCheckCircle /> : <FaTimesCircle />) : null}
              </ValidationIcon>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                  type="text"
                  name="username"
                  id="username"
                  value={user.username}
                  onChange={handleChange}
                  required />
              <ValidationIcon isValid={isInputValid('username', user.username)}>
                {user.username.length > 0 ? (isInputValid('username', user.username) ? <FaCheckCircle /> : <FaTimesCircle />) : null}
              </ValidationIcon>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                  type="text"
                  name="full_name"
                  id="full_name"
                  value={user.full_name}
                  onChange={handleChange}
                  required />
              <ValidationIcon isValid={isInputValid('full_name', user.full_name)}>
                {user.full_name.length > 0 ? (isInputValid('full_name', user.full_name) ? <FaCheckCircle /> : <FaTimesCircle />) : null}
              </ValidationIcon>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                  type="password"
                  name="password"
                  id="password"
                  value={user.password}
                  onChange={handleChange}
                  required />
              <ValidationIcon isValid={isInputValid('password', user.password)}>
                {user.password.length > 0 ? (isInputValid('password', user.password) ? <FaCheckCircle /> : <FaTimesCircle />) : null}
              </ValidationIcon>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  required />
              <ValidationIcon isValid={isInputValid('confirmPassword', user.confirmPassword)}>
                {user.confirmPassword.length > 0 && user.password === user.confirmPassword ? (isInputValid('confirmPassword', user.confirmPassword) ? <FaCheckCircle /> : <FaTimesCircle />) : null}
              </ValidationIcon>
            </InputGroup>
            <Label>
              <HyperLink>
                Already have an account? Click Here.
              </HyperLink>
            </Label>
            {registrationSuccess && <SuccessMessage>User registered successfully!</SuccessMessage>}
            <Button style = {{backgroundColor :"green"}}type="submit" disabled={!isFormValid}>Register</Button>
        </Form>
        </Container>
  );
}
export default SignUpPage;