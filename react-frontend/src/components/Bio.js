import React from "react";
import PropTypes from "prop-types";
import defaultPfp from "../assets/default-pfp.jpg";

function BioEntry(props) {
  const { name, bio } = props;
  return (
    <div className="small-container text-center drop-shadow margin">
      <img src={defaultPfp}></img>
      <h4>{name}</h4>
      <p>{bio}</p>
    </div>
  );
}

// Prop type validation
BioEntry.propTypes = {
  name: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired
};

export default BioEntry;
