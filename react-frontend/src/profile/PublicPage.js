import React, { useState, useEffect } from 'react';
import './profile.css';
//import LoadingSpinner from "../components/LoadingSpinner";
import WhitePfp from '../assets/white-placeholder.png';
import DefaultPfp from '../assets/profile-placeholder.png';
import { useParams } from 'react-router-dom';
import axios from 'axios';


function PublicPage() {
  const [profileImage, setProfileImage] = useState(WhitePfp);
  const timestamp = Date.now();
  const { userID } = useParams();
  const [userProfile, setUserProfile] = useState({
    username: 'Name',
    full_name: 'Full Name',
    bio: 'bio'
  });

  useEffect(() => {
    fetchUserProfile(userID);
    fetchProfilePicture(userID);
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

  const fetchProfilePicture = async(userID) => {
    try {
      const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/users/is-profile-picture/${userID}`);
      setProfileImage(response ? `https://haggleimgs.s3.amazonaws.com/user/${userID}/bruh0.jpg?${timestamp}` : DefaultPfp);
    } catch (error) {
      console.log("Error encountered: ", error);
    }
  }

  return (
    <div className = "vertical-center margin padding-top">
      <div className = "small-container drop-shadow">
        <h1>{userProfile.full_name}</h1>
        <img src={profileImage} alt="Profile" className="profile-picture"></img>
        <p>bio</p>
      </div>
    </div>
  );
}

export default PublicPage;
