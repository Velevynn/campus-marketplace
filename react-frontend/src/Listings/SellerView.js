import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SellerView.css';

const SellerListingView = ({ listingID }) => {
    const [listing, setListing] = useState(null);
  
    /* hook to fetch data when listingID changes */
    useEffect(() => {
      const fetchData = async () => {
        try {
            /* get data of listing by its ID */
          const response = await axios.get(`http://localhost:8000/mylisting/${listingID}`);
          /* set fetched data to state */
          setListing(response.data);
        } catch (error) {
          console.error('Error fetching listing:', error);
        }
      };
  
      fetchData();
    }, [listingID]);

    const handleEditListing = () => {
        /* Add logic for handling "Edit Listing" action */
        console.log('Edit Listing clicked for listing:', listing);
      };
    
      const handleDeleteListing = () => {
        /* Add logic for handling "Delete Listing" action */
        console.log('Delete Listing clicked for listing:', listing);
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

            <button onClick={handleEditListing}>Edit Listing</button>
            <button onClick={handleDeleteListing}>Delete Listing</button>

          </div>
        ) : (
          <p>LISTING IS NULL</p>
        )}
      </div>
    );
  };
  
  export default SellerListingView;