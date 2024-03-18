import React, { useState } from 'react';
import axios from 'axios';
import logoImage from '../assets/haggle-horizontal.png';
import { Link} from 'react-router-dom';
import { Container, Form, InputGroup, Input, InputLabel, Button, BottomContainer, BottomLabel } from './AuthenticationStyling';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  //const navigate = useNavigate();

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

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

  return (
    <>
      <Container>
        <img src={logoImage} alt="Logo" style={{ display: 'block', margin: '0 auto 20px', maxWidth: '200px', height: 'auto' }} />
        <Form onSubmit={handleSubmit}>
        {message && (
            <div style={{ color: 'green', marginTop: '20px', fontSize: '12px' }}>
              {message}
            </div>
          )}

          <InputGroup>
            <Input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleChange}
              required />
            <InputLabel htmlFor="email" hasContent={email.length > 0}>Email Address</InputLabel>
          </InputGroup>
          <Button type="submit">
            Send Reset Link
          </Button>
        </Form>
      </Container>

      <BottomContainer>
        <BottomLabel>
          Return to {}
          <Link to="/login" style={{ display: 'inline', color: '#0056b3', fontWeight: 'bold' }}>
            Log in
          </Link>
        </BottomLabel>
      </BottomContainer>
    </>
  );
};

export default ForgotPasswordPage;