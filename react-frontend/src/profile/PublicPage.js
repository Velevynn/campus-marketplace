import React, { useState, useEffect } from 'react';
import './profile.css';
import LoadingSpinner from "../components/LoadingSpinner";
import WhitePfp from '../assets/white-placeholder.png';
import DefaultPfp from '../assets/profile-placeholder.png';
import { useParams } from 'react-router-dom';
import ListingCollection from './ListingCollection';
import ShareButton from '../components/ShareButton';
import axios from 'axios';

function PublicPage() {
  const [profileImage, setProfileImage] = useState(WhitePfp);  // temporary while real pfp loads
  const [isLoading, setIsLoading] = useState(true);  // tracks loading states for rendering
  const timestamp = Date.now();  // timestamp is appended to profile picture URL to remove browser caching
  const { userID } = useParams();
  const [listings, setMyListings] = useState([]);
  const isCustom = false;
  const [userProfile, setUserProfile] = useState({  // user data
    username: '',
    fullName: '',
    bio: '',
    city: ''
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
      setProfileImage(response.data.isProfilePicture ? `https://haggleimgs.s3.amazonaws.com/user/${userID}/bruh0.jpg?${timestamp}` : DefaultPfp);
    } catch (error) {
      console.log("Error encountered: ", error);
    }
  }  // if there is no custom pfp set, the profile picture will be set as the default pfp defined in assets
  
  const fetchCollections = async (userID) => {
    try {
      console.log(userID);
      const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/listings/mylistings/${userID}`);
      setMyListings(response.data);
      console.log(response.data, "hello");

    } catch (error) {
      console.error('Failed to fetch myListings', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCollections(userID);
    fetchUserProfile(userID);
    fetchProfilePicture(userID);
  }, []);


  return (
    <div className = "vertical-center margin padding-top">
      {isLoading ? (
        <div><LoadingSpinner/> {/*Visible loading spinner that runs until all data for elements are made available*/}</div> 
       ) : (
        <div className="vertical-center profile-page-layout margin padding-top">
          <div className = "small-container drop-shadow">
            <div className ="full-container">
              <h1>{userProfile.fullName}</h1>
              <img src={profileImage} alt="Profile" className="profile-picture"></img>
                <a href={`https://www.google.com/maps/place/${userProfile.city},+CA+93422`} target="_blank" rel="noopener noreferrer">
              <h5 className="text-link">{userProfile.city}, CA</h5>
              </a>
              {userProfile.bio.length > 0 ? <p>{userProfile.bio}</p> : <p>No bio provided.</p>}
            </div>
            <ListingCollection title="Listings" bookmarks={listings} userID={userProfile.userID} time = {timestamp} custom = {isCustom} />
            <div className = "full-container" >
              <ShareButton link = {`${process.env.REACT_APP_FRONTEND_LINK} + "/profile/" + ${userID}`}/>
            </div>
          </div>
        </div>
      )
    }
    
    </div>
  );
}

export default PublicPage;
