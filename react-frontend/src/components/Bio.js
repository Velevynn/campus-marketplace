import React from "react";
import PropTypes from "prop-types";

function BioEntry(props) {
  const { name, bio, pfp } = props;
  return (
    <div className="small-container text-center drop-shadow margin">
      <img className="square-image" src={pfp}></img>
      <h4>{name}</h4>
      <p>{bio}</p>
    </div>
  );
}

// Prop type validation
BioEntry.propTypes = {
  name: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  pfp: PropTypes.string.isRequired
};

export default BioEntry;
