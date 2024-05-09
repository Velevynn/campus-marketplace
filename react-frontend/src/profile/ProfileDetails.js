import React from "react";

function ProfileDetails() {


    return (
        <div className = "padding-left">
        <div className = "small-container drop-shadow profile-height">
            <h5>Profile Details</h5>
            <textarea className="vertical-form" placeholder = "Add your bio here.."></textarea>
            <button className = "small-button">Save Bio</button>
        </div>
        </div>

    );

    
}

export default ProfileDetails;