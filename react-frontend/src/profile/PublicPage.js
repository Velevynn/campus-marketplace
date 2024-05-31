import React, { useState, useEffect } from 'react';
import './profile.css';
import LoadingSpinner from "../components/LoadingSpinner";
import WhitePfp from '../assets/white-placeholder.png';
import DefaultPfp from '../assets/profile-placeholder.png';
import { useParams } from 'react-router-dom';
import axios from 'axios';


function PublicPage() {
  const [profileImage, setProfileImage] = useState(WhitePfp);  // temporary while real pfp loads
  const [isLoading, setIsLoading] = useState(true);  // tracks loading states for rendering
  const timestamp = Date.now();  // timestamp is appended to profile picture URL to remove browser caching
  const { userID } = useParams();
  const [userProfile, setUserProfile] = useState({  // user data
    username: '',
    fullName: '',
    bio: ''
  });

  const fetchUserProfile = async(userID) => {
    try {
      const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/users/public-profile/${userID}`);
      setUserProfile(response.data);  // update the userProfile data to public profile data retrieved from the backend
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
  }  // if there is no custom pfp set, the profile picture will be set as the default pfp defined in assets
  
  useEffect(() => {
    fetchUserProfile(userID);
    fetchProfilePicture(userID);
    setIsLoading(false);
  }, []);


  return (
    <div className = "vertical-center margin padding-top">
      {isLoading ? (
        <div><LoadingSpinner/> {/*Visible loading spinner that runs until all data for elements are made availble*/}</div> 
       ) : (
          <div className = "small-container drop-shadow">
            <h1>{userProfile.fullName}</h1>
            <img src={profileImage} alt="Profile" className="profile-picture"></img>
            {userProfile.bio.length > 0 ? <p>{userProfile.bio}</p> : <p>No bio provided.</p>}
          </div>
      )
    }
    </div>
  );
}

export default PublicPage;
