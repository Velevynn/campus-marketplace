// Importing necessary React hooks and Axios for HTTP requests
import React, { useState } from 'react';
import axios from 'axios';
// Importing logo and styling components
import logoImage from '../assets/haggle-horizontal.png';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle  } from 'react-icons/fa';

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
      const response = await axios.post(process.env.REACT_APP_BACKEND_LINK + '/users/forgot-password', { email });
      // Assuming the API responds with a success message
      setMessage(response.data.message || 'If an account with that email exists, we have sent a reset password link.');
    } catch (error) {
      setMessage('Error: Failed to reset password. Please try again.');
    }
  };

  // Rendering the Forgot Password page
  return (
    <>
      <div className="vertical-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="small-container drop-shadow margin text-center">
          <img
            src={logoImage}
            alt="Logo"
            style={{
              display: 'block',
              margin: '0 auto 20px',
              maxWidth: '200px',
              height: 'auto'
            }}
          />
          <h5 className="text-center" style={{fontSize:"18px"}}>Forgot Password?</h5>
          <p className="text-center" style={{fontSize:"14px"}}>Enter your email and we will send you a link to reset your password.</p>
  
          <form onSubmit={handleSubmit}>
            {message && (
              <h6>
                {message}
              </h6>
            )}
  
            <div style = {{ marginTop: '20px'}}>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              <div className="input-icon">
                {email.length > 0 ? (
                  isValidEmail(email) ? (
                    <FaCheckCircle style={{ color: 'green' }} />
                  ) : (
                    <FaTimesCircle style={{ color: 'red' }} />
                  )
                ) : null}
              </div>
            </div>
  
            <button
              className="span-button"
              type="submit"
              disabled={!isValidEmail(email)}
              style={{ marginTop: '20px' }}
            >
              Send Reset Link
            </button>
          </form>
        </div>
  
        <div className="small-container drop-shadow">
          <div className="text-center">
          <p className="text-center" style ={{fontSize:'14px'}}>
              Return to{' '}
              <Link
                to="/login"
                style={{
                  color: 'green',
                }}
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
              }  

export default ForgotPasswordPage;