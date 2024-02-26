// MarketplaceEntry.js (Josh)

import React from "react";
import './marketplace-entry.css';
import missing from '../assets/missing.jpg';


function Entry({title, price, listingID}) {
  const renderPrice = () => {
    if (price === "0") {
      return <p style={{ color: 'green', fontWeight: 'bold', margin: 0 }}>FREE</p>;
    } else {
      return <p style={{ color: 'green', fontWeight: 'bold', margin: 0 }}>${price}</p>;
    }
  };

  return (
    <div className="entry-container">
      <div className="image-container">
        <img src={missing} alt="Entry Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div className="text-container">
        <h2 style={{ fontSize: '25px', fontWeight: 600, margin: '10px 0' }}>{title}</h2>
        {renderPrice()}
      </div>
    </div>
  );
}

export default Entry;