import React, {useState} from "react";
import axios from 'axios';
import PropTypes from "prop-types";

function ProfileDetails(props) {
    const [bio, setBio] = useState("");

    function handleChange(event) {
        setBio(event.target.value);
    }

    const saveBio = async() => {
        try {
            //console.log(formData.get('userID'), formData.get('bio'));
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/users/set-bio`, {
                userID: props.userID,
                bio: bio
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
            });
            console.log(response);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    /*      const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/users/change-profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }); */

    return (
        <div className = "padding-left">
        <div className = "small-container drop-shadow profile-height">
            <h5>Profile Details</h5>
            <textarea className="vertical-form" placeholder = "Add your bio here.." value ={bio} onChange={handleChange}></textarea>
            <button className = "small-button" onClick={saveBio}>Save Bio</button>
        </div>
        </div>

    );

    
}

ProfileDetails.propTypes = {
    userID: PropTypes.string.isRequired,
  };

export default ProfileDetails;