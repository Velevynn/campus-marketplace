import React from "react";
import "./marketplace-entry.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Entry({ title, price, listingID }) {
  const getTitleFontSize = () => {
    if (title != undefined) {
      if (title.length > 21) {
        return "15px";
      } else if (title.length > 14) {
        return "20px";
      } else {
        return "25px";
      }
    } else {
      return "10px";
    }
  };

  const randomNum = (Math.random(2000)).toString();  // generate random num
  let source = `https://haggleimgs.s3.amazonaws.com/${listingID}/image0?clearCache=${randomNum}`;  
  // request img from AWS, add random query to circumvent browser caching

  return (
    <Link to={`/listings/${listingID}`} className="entry-link">
      <div className="entry-container">
        <div className="image-container">
          <img src = {source} alt="Entry Image" className="entry-image" />
        </div>

        <div className="text-container">
          <h2 className="title" style={{ fontSize: getTitleFontSize() }}>
            {title}
          </h2>
          <p className="price">{price === "0.00" ? "FREE" : `$${price}`}</p>
        </div>
      </div>
    </Link>
  );
}

Entry.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  listingID: PropTypes.number.isRequired,
};

export default Entry;