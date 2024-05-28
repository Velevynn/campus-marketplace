import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/haggle-horizontal.png';
import "./AuthenticationStyling.css"

function AdditionalDetailsPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    phoneNumber: '',
    email: new URLSearchParams(window.location.search).get('email'),  // Get 'email' from URL
    name: new URLSearchParams(window.location.search).get('name')  // Get 'name' from URL
  });

  console.log("Email from query:", userData.email);
  console.log("Name from query:", userData.name);



  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // dynamic styles for inputs
  const inputStyle = (fieldValue) => ({
    fontSize: "14px",
    paddingTop: fieldValue.length > 0 ? "13px" : "10px",
    paddingBottom: fieldValue.length > 0 ? "7px" : "10px",
  });
  
  // handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  // validate form
  useEffect(() => {
    const isValid = userData.username.trim().length > 0 && userData.phoneNumber.trim().length > 0;
    setIsFormValid(isValid);
  }, [userData]);

  // submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) {
      setErrorMessage('Please fill all fields correctly.');
      return;
    }
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND_LINK + '/users/register-google-user', userData);
      localStorage.setItem('token', response.data.token);
      navigate('/profile'); // Redirect to profile page after registration
    } catch (error) {
      const errorText = error.response ? error.response.data.error : error.message;
      setErrorMessage(`Error: ${errorText}`);
      console.error('Error:', error);
    }
  };

  return (
    <div className="vertical-center margin-top">
      <div className="small-container drop-shadow">
        <div className="vertical-center">
          <img className="logo-img" src={logoImage} alt="Logo"/>
        </div>
        
        <h5 className="text-center" style={{fontSize:"18px"}}>
            Complete your registration
        </h5>

        <form onSubmit={handleSubmit} >
          {errorMessage && <div style={{color: "red", fontSize: "12px", marginLeft: "10px"}}>{errorMessage}</div>}
          <div className="margin input">
            <p className={userData.username.length > 0 ? "input-label-full" : "input-label-empty unselectable"}> Username </p>
            <input
              type="text"
              name="username"
              id="username"
              value={userData.username}
              onChange={handleChange}
              autoComplete="on"
              required
              style={inputStyle(userData.username)}
            />
          </div>

          <div className="margin input">
            <p className={userData.phoneNumber.length > 0 ? "input-label-full" : "input-label-empty unselectable"}>Phone Number</p>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleChange}
              required
              style={inputStyle(userData.phoneNumber)}
            />
          </div>

          <button className={`span-button ${isFormValid ? "" : "disabled"}`} type="submit" style={{marginTop: '20px'}}>
            Complete Registration
          </button>

          <p className="text-center margin-bottom" style={{fontSize: '12px', marginTop: '20px'}}>
            By registering you agree to our {}
              <Link to="/terms-of-service">
                Terms of Service
              </Link>
            {} and acknowledge our {}
              <Link to="/privacy-policy">
                Privacy Policy
              </Link>
          </p>

        </form>
        </div>
      </div>
  );
}

export default AdditionalDetailsPage;