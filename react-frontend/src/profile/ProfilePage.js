import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookmarksCollection from './BookmarksCollection';
import { useNavigate } from 'react-router-dom';
// import profileImagePlaceholder from '../assets/profile-placeholder.png';
import LoadingSpinner from "../components/LoadingSpinner";
import { Button, ButtonContainer, ProfileImage, ProfileField, ProfileLabel, ProfileValue, ErrorMessage } from '../authentication/AuthenticationStyling';
import ProfileDetails from './ProfileDetails';
import ListingCollection from './ListingCollection'

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

  const [profileImage, setProfileImage] = useState('https://haggleimgs.s3.amazonaws.com/user/1214/bruh0.jpg'); // Initial profile image URL
  const [isHovered, setIsHovered] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('profileImage', file);

    // Send formData to backend using axios or any other method
    // For now, let's just update the profile image locally
    setProfileImage(URL.createObjectURL(file));
  };

  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationData, setDeleteConfirmationData] = useState({
    username: '',
    password: '',
  });
  const [deleteError, setDeleteError] = useState('');

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleDeleteConfirmation = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.delete(process.env.REACT_APP_BACKEND_LINK + `/users/delete`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data: {
          username: deleteConfirmationData.username,
          password: deleteConfirmationData.password
        }
      });
      
      if (response.status === 200) {
        // After successful deletion, redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed to delete profile:', error.response);
      if (error.response && error.response.data && error.response.data.error) {
        setDeleteError(error.response.data.error);
      } else {
        setDeleteError('An error occurred while deleting the profile.');
      }
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteError('');
  };

  const handleDelete = (e) => {
    e.preventDefault();
    // Perform deletion after confirmation
    handleDeleteConfirmation();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeleteConfirmationData({ ...deleteConfirmationData, [name]: value });
  };

  const formatPhoneNumber = (phoneNumber) => {
    // Regular expression to match digits only
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    // Regular expression to match format (xxx)-xxx-xxxx
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
  };

  return (
    <div>
      {isLoading ? ( // Render loading spinner if isLoading is true
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
        <input type="file" accept="image/*" id="imageUpload" onChange={handleImageChange} style={{ display: 'none' }} />
        <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
          <Button>Change Image</Button>
        </label>
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
          <BookmarksCollection title = "Bookmarks" bookmarks = {bookmarks} userID = {userProfile.userID}/>
          <ListingCollection title = "Listings" bookmarks = {listings} userID = {userProfile.userID}/>
        </div>

        <ProfileDetails>
          
        </ProfileDetails>
      </div>
      </div>
    )}

<div className="vertical-center margin">
          <div className="small-container drop-shadow">
          {!showDeleteConfirmation && (
            <button className="span-button" onClick={confirmDelete}>Delete Profile</button>
          )}
          {showDeleteConfirmation && (
              <form className="" onSubmit={handleDelete}>
                <div className="margin input">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={deleteConfirmationData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="margin input">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={deleteConfirmationData.password}
                  onChange={handleInputChange}
                  required
                />
                </div>
                <div className="vertical-center flex-column">
                    <button className={deleteConfirmationData.username.length > 0 
                      && deleteConfirmationData.password.length > 0 ? "button" : "disabled"}>Confirm Delete</button>
                    <button onClick={handleCancelDelete}>Cancel</button>
                </div>
                {deleteError && <ErrorMessage>{deleteError}</ErrorMessage>}
              </form>
            
          )}
            </div>
        </div>
  </div>

  
  );
}

export default ProfilePage;
