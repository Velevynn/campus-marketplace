import React from "react";
import PropTypes from "prop-types";
import defaultPfp from "../assets/default-pfp.jpg";

function BioEntry(props) {
  const { name, bio, quip } = props;
  return (
    <div className="small-container text-center drop-shadow margin">
      <img src={defaultPfp}></img>
      <h4>{name}</h4>
      <p style={{marginBottom: "20px" }}>{bio}</p>
      <em style={{ fontSize: "14px"}}>&quot;{quip}&quot;</em>
    </div>
  );
}

// Prop type validation
BioEntry.propTypes = {
  name: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  quip: PropTypes.string.isRequired
};

export default BioEntry;
