import React, { useState, useEffect } from 'react';
import './profile.css';
import LoadingSpinner from "../components/LoadingSpinner";
import WhitePfp from '../assets/white-placeholder.png';
import DefaultPfp from '../assets/profile-placeholder.png';
import { useParams } from 'react-router-dom';
import ListingCollection from './ListingCollection';
import ShareButton from '../components/ShareButton';
import ArrowButton from "../components/ArrowButton";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function PublicPage() {
  const [profileImage, setProfileImage] = useState(WhitePfp); 
  const [isLoading, setIsLoading] = useState(true);  
  const timestamp = Date.now();  
  const { userID } = useParams();
  const [listings, setMyListings] = useState([]);
  const isCustom = false;
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({  
    username: '',
    fullName: '',
    bio: '',
    city: ''
  });

  const fetchUserProfile = async(userID) => {
    try {
      const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/users/public-profile/${userID}`);
      setUserProfile(response.data);  
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
  }  

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
    <div>
      
        {isLoading ? (
          <div><LoadingSpinner/></div> 
        ) : (
          <div>
            <div className = "vertical-center">
              <div className="vertical-center profile-page-layout margin padding-top">
                <div className = "small-container drop-shadow">
                  <div className ="full-container">
                  <div className="vertical-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom:'15px' }}>
                    <div onClick={() => { navigate(-1) }} style={{ rotate: '-90deg', position: 'absolute', left: -30 }}>
                      <ArrowButton></ArrowButton>
                    </div>
                    <h3 style={{ margin: '0 auto' }}>{userProfile.fullName}</h3>
                  </div>
                    <img src={profileImage} alt="Profile" className="profile-picture"></img>
                      <a href={`https://www.google.com/maps/place/${userProfile.city},+CA+93422`} target="_blank" rel="noopener noreferrer">
                    <h5 className="text-link">
                      {userProfile.city && (
                        <div>{userProfile.city}, CA</div>
                        )}
                    </h5>
                    </a>
                    {userProfile.bio.length > 0 ? <p className = "user-bio">{userProfile.bio}</p> : <p>No bio provided.</p>}
                  </div>
                  <ListingCollection title="Listings" bookmarks={listings} userID={userProfile.userID} time = {timestamp} custom = {isCustom} />
                  <div className = "full-container" >
                    <ShareButton link = {`${process.env.REACT_APP_FRONTEND_LINK} + "/profile/" + ${userID}`} type = 'Profile'/>
                  </div>
                </div>
              </div>
            </div>
            <Footer/>
          </div>
        )}
    </div>
  );
}

export default PublicPage;
