import React, { useState, useEffect } from "react";
import axios from 'axios';
import PropTypes from "prop-types";
import Notify from '../components/ErrorNotification';
import { Link } from 'react-router-dom';

function ProfileDetails(props) {
    const [bio, setBio] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMsg, setNotificationMsg] = useState("");
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [hometown, setHometown] = useState("");
    const [cityByZip, setCityByZip] = useState("");
    const publicURL = process.env.REACT_APP_FRONTEND_LINK + "/profile/" + props.userID;

    function handleChange(event) {
        setBio(event.target.value);
    }

    const fetchUserProfile = async(userID) => {
        try {
          const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/users/public-profile/${userID}`);
          setBio(response.data.bio);
          if (bio && bio.length > 0 ) {
            setBio(bio)
          }
        } catch (error) {
          console.log("Error encountered: ", error);
        }
      }

    const saveBio = async() => {
        try {
            if (bio.length == 0) {
                setNotificationMsg("Text field empty");
                setIsSuccessful(false);
                setShowNotification(true);
                return;
            }

            await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/users/set-bio`, {
                userID: props.userID,
                bio: bio
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(process.env.JWT_TOKEN_NAME)}`
                  }
            });
            setNotificationMsg("Bio Saved Successfully");
            setIsSuccessful(true);
            setShowNotification(true);
        } catch (error) {
            console.error("Error:", error);
            setIsSuccessful(false);
            setNotificationMsg("Save Unsuccessful");
            setShowNotification(true);
        }
    }

    const handleSetLocationByZip = async () => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(hometown)}, California, United States&format=json&addressdetails=1`);
            console.log("Response:", response.data); // Log the entire response object
            console.log(response.data[0].address.postcode);
            if (hometown.length === 5 && response.data && response.data.length > 0 && response.data[0].address.postcode === hometown) {
                const city = response.data[0].address.city || response.data[0].address.town || response.data[0].address.village || response.data[0].address.county;
                setCityByZip(city); // Set the city found by zip code
                console.log(city);
            } else {
                console.log("Location not found");
                setIsSuccessful(false);
                if (hometown.length!== 5) {
                    setNotificationMsg("Invalid ZIP Code");
                } else {
                    setNotificationMsg("ZIP Code not found");
                }
                
                setShowNotification(true);
            }
        } catch (error) {
            console.error("Error:", error);
            setIsSuccessful(false);
            setNotificationMsg("Failed to fetch location");
            setShowNotification(true);
        }
    };
    
    const handleSetHometown = () => {
        // Implement backend call to set the hometown
        // This function will be called when the button to set hometown is clicked
    };
    
    
    useEffect(() => {
        fetchUserProfile(props.userID);
      }, []);

    return (
        <div className = "padding-left">
        <div className = "small-container drop-shadow profile-height">
            <h5>Profile Details</h5>
            <textarea className="vertical-form" placeholder = "Add your bio here.." value ={bio} onChange={handleChange}></textarea>
            <button className = "small-button small-width" onClick={saveBio}>Save Bio</button>
            <h5>Set Location</h5>
            <div style={{ display: "flex", alignItems: "center", marginTop: "-15px" }}>
                    <input type="text" maxLength="5" placeholder="Enter Zip Code" value={hometown} onChange={(e) => setHometown(e.target.value.replace(/\D/, ''))} style={{ marginRight: "10px" }} />
                    <button className="lookup-btn" onClick={handleSetLocationByZip}>🔍</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "-15px" }}>
                <button className="small-button margin-top" onClick={handleSetHometown}>Set Hometown</button>
                {cityByZip && <div className="overflow-container">{`${cityByZip}`}</div>}
            </div>
            <Link to ={publicURL}><div className="text-link margin-top">See Public Profile</div></Link>
        </div>
        {showNotification && <Notify message={notificationMsg} isSuccessful={isSuccessful}/>}
        </div>

    );

    
}

ProfileDetails.propTypes = {
    userID: PropTypes.string.isRequired,
  };

export default ProfileDetails;