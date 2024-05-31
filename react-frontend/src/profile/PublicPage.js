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
    username: '',
    fullName: '',
    bio: ''
  });

  const fetchUserProfile = async(userID) => {
    try {
      console.log(process.env.REACT_APP_BACKEND_LINK + `/users/public-profile/${userID}`);
      const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/users/public-profile/${userID}`);
      setUserProfile(response.data);
      console.log(response.data);
      console.log(userProfile);
      //console.log("reached");
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
  
  useEffect(() => {
    fetchUserProfile(userID);
    fetchProfilePicture(userID);
  }, []);


  return (
    <div className = "vertical-center margin padding-top">
      <div className = "small-container drop-shadow">
        <h1>{userProfile.fullName}</h1>
        <img src={profileImage} alt="Profile" className="profile-picture"></img>
        {userProfile.bio.length > 0 ? <p>{userProfile.bio}</p> : <p>No bio provided.</p>}
      </div>
    </div>
  );
}

export default PublicPage;
