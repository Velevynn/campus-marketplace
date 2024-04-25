import React from "react";
import PropTypes from "prop-types";
//import axios from "axios";
//import { Link, useNavigate } from "react-router-dom"; 

function ProfileCollection(props) {
    console.log(props.bookmarks);
    return (
        <div>
            <div className="vertical-center margin">
                <h5>{props.title}</h5>
            </div>
            <div className="vertical-center margin">
                <div className="small-container drop-shadow">
                
                </div>
            </div>
        </div>
    );
  }
  
  ProfileCollection.propTypes = {
    title: PropTypes.string.isRequired,
    bookmarks: PropTypes.array.isRequired,
  };

  export default ProfileCollection;