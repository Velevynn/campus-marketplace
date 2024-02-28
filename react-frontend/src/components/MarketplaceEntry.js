import React from "react";
import './marketplace-entry.css';
import missing from '../assets/missing.jpg';
import { Link } from 'react-router-dom';

function Entry({title, price, listingID }) {
  const getTitleFontSize = () => {
    if (title.length > 21) {
      return '15px';
    } else if (title.length > 14) {
      return '20px';
    } else {
      return '25px';
    }
  }

  return (
    <Link to={`/listings/${listingID}`} className="entry-link">
      <div className="entry-container">
        <div className="image-container">
          <img src={missing} alt="Entry Image" className="entry-image" />
        </div>

        <div className="text-container">
          <h2 className="title" style = {{fontSize: getTitleFontSize()}}>{title}</h2>
          <p className="price">{price === "0.00" ? "FREE" : `$${price}`}</p>
        </div>
      </div>
    </Link>
  );
}

export default Entry;
