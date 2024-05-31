import React, { useState, useEffect } from 'react';
import './profile.css';
//import LoadingSpinner from "../components/LoadingSpinner";
import WhitePfp from '../assets/white-placeholder.png';
import { useParams } from 'react-router-dom';
import axios from 'axios';


function PublicPage() {
  const [profileImage] = useState(WhitePfp);
  const { userID } = useParams();
  const [userProfile, setUserProfile] = useState({
    username: '',
    full_name: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    fetchUserProfile(userID);
  }, []);

  const fetchUserProfile = async (userID) => {
    try {
      const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/users/public-profile${userID}`);
      setUserProfile(response);
      console.log(userProfile);
    } catch (error) {
      console.log("Error encountered: ", error);
    }
  }

  return (
    <div className = "vertical-center margin padding-top">
      <div className = "small-container drop-shadow">
        <h1>Name</h1>
        <img src={profileImage} alt="Profile" className="profile-picture"></img>
        <p>bio</p>
      </div>
    </div>
  );
}

export default PublicPage;
