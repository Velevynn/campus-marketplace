import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookmarksCollection from './BookmarksCollection';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from "../components/LoadingSpinner";
import { Button, ButtonContainer, ProfileImage, ProfileField, ProfileLabel, ProfileValue, ErrorMessage } from '../authentication/AuthenticationStyling';
import ProfileDetails from './ProfileDetails';
import ListingCollection from './ListingCollection';
import ChangeProfilePicture from './ChangeProfilePicture'; // Import the ChangeProfilePicture component

function ProfilePage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [listings, setMyListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    username: '',
    full_name: '',
    email: '',
    phoneNumber: '',
    userID: ''
  });
  const [isHovered, setIsHovered] = useState(false); // Define isHovered state
  const [profileImage, setProfileImage] = useState(''); // Define profileImage state

  const navigate = useNavigate(); // Define navigate for routing

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setUserProfile(response.data);
      fetchCollections(response.data.userID);
      console.log(response.data, "my data");
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      navigate('/login');
    }
  };

  const fetchCollections = async (userID) => {
    try {
      console.log(userID);
      const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/listings/bookmark/${userID}`);
      setBookmarks(response.data);
    } catch (error) {
      console.error('Failed to fetch bookmarks', error);
    }
    try {
      console.log(userID);
      const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/listings/mylistings/${userID}`);
      setMyListings(response.data);
      console.log(response.data, "hello");
      
    } catch (error) {
      console.error('Failed to fetch myListings', error);
    }
    setIsLoading(false);
  }

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
  };

  return (
    <div>
      {isLoading ? (
        <div className="margin">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <div className="vertical-center profile-page-layout margin padding-top">
            <div className="small-container drop-shadow">
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ position: 'relative' }}
              >
                <ProfileImage src={profileImage} alt="Profile" />
                {isHovered && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ChangeProfilePicture /> {/* Integrate the ChangeProfilePicture component */}
                  </div>
                )}
              </div>
              <form>
                {Object.entries(userProfile).map(([key, value]) => (
                  key !== 'userID' && 
                  <ProfileField key={key}>
                    <ProfileLabel>
                      {key === 'fullName' ? 'Full Name' : key === 'phoneNumber' ? 'Phone Number' : key.replace(/_/g, ' ')
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}:
                    </ProfileLabel>
                    <ProfileValue>{key === 'phoneNumber' ? formatPhoneNumber(value) : value}</ProfileValue>
                  </ProfileField>
                ))}
              </form>
              <ButtonContainer>
                <Button onClick={handleChangePassword}>Change Password</Button>
                <Button onClick={handleSignOut}>Sign Out</Button>
              </ButtonContainer>
            </div>

            <div className="collection-layout margin padding-left drop-shadow">
              <BookmarksCollection title="Bookmarks" bookmarks={bookmarks} userID={userProfile.userID} />
              <ListingCollection title="Listings" bookmarks={listings} userID={userProfile.userID} />
            </div>

            <ProfileDetails>
            </ProfileDetails>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
