import React from "react";
import "./bio.css";
import PropTypes from "prop-types";
import defaultPfp from "../assets/default-pfp.jpg";

function BioEntry(props) {
  const { name, bio } = props;
  return (
    <div className="bio-entry">
      <label className="name">{name}</label>
      <div
        className="bio-container"
        style={{ backgroundImage: `url(${defaultPfp})` }}
      >
        <div className="bio-text">{bio}</div>
      </div>
    </div>
  );
}

// Prop type validation
BioEntry.propTypes = {
  name: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired
};

export default BioEntry;
