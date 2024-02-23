import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BuyerView.css';

const BuyerListingView = ({ listingId }) => {
    const [listing, setListing] = useState(null);
  
    /* hook to fetch data when listingID changes */
    useEffect(() => {
      const fetchData = async () => {
        try {
            /* get data of listing by its ID */
          const response = await axios.get(`http://localhost:8000/listings/{listingID}`);
          /* set fetched data to state */
          setListing(response.data);
        } catch (error) {
          console.error('Error fetching listing:', error);
        }
      };
  
      fetchData();
    }, [listingId]);

    const handleBuyNow = () => {
        /* Add logic for handling "Buy Now" action */
        console.log('Buy Now clicked for listing:', listing);
      };
    
      const handleMakeOffer = () => {
        /* Add logic for handling "Make Offer" action */
        console.log('Make Offer clicked for listing:', listing);
      };

      const handleStartChat = () => {
        /* Add logic for handling "Start a Chat" action */
        console.log('Start a Chat clicked for listing:', listing);
      };
  
    /* first check if listing data is available, then render */
    return (
      <div>
        {listing ? (
          <div>
            <h2>{listing.title}</h2>
            <p>{listing.description}</p>
            <p>Price: ${listing.price}</p>
            <p>Categories: {listing.categories.join(', ')}</p>
            <p>{listing.contact}</p>
            <p>{listing.photo}</p>

            <button onClick={handleBuyNow}>Buy Now</button>
            <button onClick={handleMakeOffer}>Make Offer</button>
            <button onClick={handleStartChat}>Start a Chat</button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };
  
  export default BuyerListingView;