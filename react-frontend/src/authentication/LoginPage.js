// Importing necessary React hooks and Axios for HTTP requests
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Importing navigation hooks and components for routing and navigation
import { Link } from 'react-router-dom';
// Importing logo, icons, and styled components for UI
import logoImage from '../assets/haggle-horizontal.png';
import { FaEye, FaEyeSlash  } from 'react-icons/fa';
import googlepng from '../assets/google.png';
import "./LoginPage.css"


// LoginPage component for handling user login
function LoginPage() {
  // State for storing user credentials, form validity, error messages, and password visibility
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  // const navigate = useNavigate();

  // Handles changes in input fields and updates the credentials state
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Toggles the visibility of the password input field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handles the form submission event for login
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Constructs the request body and sends a POST request to the login endpoint
      const requestBody = {
        identifier: credentials.identifier,
        password: credentials.password,
      };
      const response = await axios.post('http://localhost:8000/users/login', requestBody);
      localStorage.setItem('token', response.data.token); // Stores the received token in local storage and navigates to the profile page
      window.location.href = '/profile';
    } catch (error) {
      // Sets an error message based on the response from the server or a general failure message
      if (error.response) {
        setErrorMessage('Error: ' + error.response.data.error);
      } else {
        setErrorMessage('Error: Login failed. Please try again.');
      }
    }
  };

  const handleGoogleLogin = () => {
    const clientId = '71122616560-tv80mel7fi0s2etitj1enhk192v06h0e.apps.googleusercontent.com';

    const redirectUrl = 'https://haggle.onrender.com/users/auth/google/callback';
    const scope = encodeURI('email profile');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
    
  };

  // Effect hook to update the form validity based on the credentials state
  useEffect(() => {
    const isValid = credentials.identifier.length > 0 && credentials.password.length > 0;
    setIsFormValid(isValid);
  }, [credentials]);

  // Renders the login form, providing fields for identifier and password, and displays error messages if any exist
  return (
    <div className="vertical-center margin">
      <div>
      <div className="small-container drop-shadow">
        <div className="vertical-center">
          <img className="logo-img" src={logoImage} alt="Logo"/>
        </div>
        
        <h5 className="text-center">
            Log in to buy, sell, and trade
        </h5>

        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <p className="margin" style={{color: "red", fontSize: "12px"}}>
              {errorMessage}
            </p>
          )}
          <div className="margin input">
            <input
              type="text"
              name="identifier"
              id="identifier"
              value={credentials.identifier}
              onChange={handleChange}
              placeholder="Email, Phone, or Username"
              autoComplete="on"
              required/>
          </div>
          <div className="margin input">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="current-password"
              style={{paddingRight: "2.5rem"}}
              required/>
          
            <div className="toggle-icon" onClick={togglePasswordVisibility}>
                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>


            
            
          <div className="margin">
          <button className={`span-button ${isFormValid ? "" : "disabled"}`} type="submit" disabled={!isFormValid}>
  Log in
</button>
          </div>

          <div className="margin">
            <button className="span-button margin" onClick={handleGoogleLogin}>
              <div className="vertical-center" >
                <span className="margin-right">Continue with </span>
                <img className="google-img" src={googlepng} alt="google"></img>
              </div>
            </button>
          </div>

          <p className="text-center margin-bottom" style={{fontSize: '12px'}}>
            By logging in you agree to our {}
              <Link to="/terms-of-service" >
                Terms of Service
              </Link>
            {} and acknowledge our {}
              <Link to="/privacy-policy">
                Privacy Policy
              </Link>
          </p>

          <p className="text-center">
            <Link to="/forgot-password">
              Forgot password?
            </Link>
          </p>
        </form>
      </div>

      <div className="small-container drop-shadow margin-top">
        <p className="text-center">
          Don&apos;t have an account? {}
          <Link to="/signup">
            Sign up
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}

export default LoginPage;