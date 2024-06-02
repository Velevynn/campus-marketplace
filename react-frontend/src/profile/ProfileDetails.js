import React, { useState } from "react";
import axios from 'axios';
import PropTypes from "prop-types";
import Notify from '../components/ErrorNotification';
import { Link } from 'react-router-dom';

function ProfileDetails(props) {
    const [bio, setBio] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMsg, setNotificationMsg] = useState("");
    const [isSuccessful, setIsSuccessful] = useState(false);
    const publicURL = process.env.REACT_APP_FRONTEND_LINK + "/profile/" + props.userID;

    function handleChange(event) {
        setBio(event.target.value);
    }

    const saveBio = async() => {
        try {
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

    return (
        <div className = "padding-left">
        <div className = "small-container drop-shadow profile-height">
            <h5>Profile Details</h5>
            <textarea className="vertical-form" placeholder = "Add your bio here.." value ={bio} onChange={handleChange}></textarea>
            <button className = "small-button" onClick={saveBio}>Save Bio</button>
            <Link to ={publicURL}><div className="text-link">See Public Profile</div></Link>
        </div>
        {showNotification && <Notify message={notificationMsg} isSuccessful={isSuccessful}/>}
        </div>

    );

    
}

ProfileDetails.propTypes = {
    userID: PropTypes.string.isRequired,
  };

export default ProfileDetails;