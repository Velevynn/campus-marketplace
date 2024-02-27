import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './SellerView.css';

const SellerListingView = () => {
    const { listingID } = useParams();
    const [listing, setListing] = useState(null);

    /* hook to fetch data when listingID changes */
    useEffect(() => {
      const fetchData = async () => {
        try {
            /* get data of listing by its ID */
          const response = await axios.get(`http://localhost:8000/mylisting/${listingID}`);
          /* set fetched data to state */
          if(response.data.length > 0){
            setListing(response.data[0]);
          }
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
            <h1>Title: {listing?.name || 'N/A'}</h1>
            <p>Description: {listing?.description || 'No description available'}</p>
            <p>Price: ${parseFloat(listing.price).toFixed(2) || 'N/A'}</p>
            <p>Contact: {listing?.userID || 'N/A'}</p>

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