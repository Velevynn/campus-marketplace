import React from "react";
import "./bio.css";
import defaultPfp from "../assets/default-pfp.jpg"

function BioEntry(props) {
    const {name, photoPath, bio} = props;
    return (
        <div className = "bio-entry">
            <label className = "name">
                {name}
            </label>
            <div className = "bio-container" style = {{backgroundImage: `url(${defaultPfp})`}}>
                <div className="bio-text">
                    {bio}
                </div>
            </div>
        </div>
    );
}

export default BioEntry;