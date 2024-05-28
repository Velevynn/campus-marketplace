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
    <div className="vertical-center margin-top">
      <div>
        <div className="small-container drop-shadow" >
        <div className="vertical-center">
            <img className="logo-img" src={logoImage} alt="Logo"/>
          </div>

          <h5 className="text-center" style={{fontSize:"18px", marginTop:"20px"}}>
              Forgot Password?
          </h5>

          <h5 className="text-center" style={{fontSize:"16px", marginTop:"20px", fontWeight:"normal"}}>
            Enter your email and we will send you a link to reset your password.</h5>
  
            <form onSubmit={handleSubmit}>
            {message && (
              <p className="margin" style={{color: "red", fontSize: "12px"}}>
                {message}
              </p>
            )}
  
             <div className="margin input">
              <p className={email.length > 0 ? "input-label-full" : "input-label-empty unselectable"}>
                Email
              </p>

              <input
                type="text"
                name="identifier"
                id="identifier"
                value={email}
                onChange={handleChange}
                autoComplete="on"
                required
                style={{fontSize:"14px", paddingTop:"14px", paddingBottom:"8px"}}
              />  

              <div className="input-icon">
                {email.length > 0 ? (
                  isValidEmail(email) ? (
                    <FaCheckCircle  style={{ color: 'green' }}/>
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
  
        <div className="small-container drop-shadow" style={{marginTop:'10px'}}>
          <p className="text-center" style ={{fontSize:'14px'}}>
            Return to {}
            <Link to="/signup">
              Login
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
              }  

export default ForgotPasswordPage;