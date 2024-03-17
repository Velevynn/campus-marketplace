import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ListingView.css";
import ImageCarousel from "../components/ImageCarousel.js";
////import { jwtDecode } from "jwt-decode";

const ListingView = () => {
  const { listingID } = useParams();
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  console.log(setIsOwner);
  /* hook to fetch data when listingID changes */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /* get data of listing by its ID */
        const response = await axios.get(
          `https://haggle.onrender.com/listings/${listingID}`,
        );
        /* check currently logged-in userID */
        //const loggedInUserID = fetchUserProfile();
        /* set fetched data to state */
        if (response.data.length > 0) {
          setListing(response.data[0]);
          //setIsOwner(response.data[0].userID === loggedInUserID.data[0].userID);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };

    fetchData();
  }, [listingID]);

    /* Hook to fetch images when listingID changes */
  useEffect(() => {
    const fetchImages = async () => {
      try {
        /* Fetch images for the listing from the backend */
        const response = await axios.get(
          `https://haggle.onrender.com/listings/images/${listingID}`,
        );
        if (response.data.length > 0) {
          setImages(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [listingID]);

  const handleBuyNow = () => {
    /* Add logic for handling "Buy Now" action */
    console.log("Buy Now clicked for listing:", listing);
    window.location.href = "/listings/:listingID/buy";
  };

  const handleMakeOffer = () => {
    /* Add logic for handling "Make Offer" action */
    console.log("Make Offer clicked for listing:", listing);
    window.location.href = "/listings/:listingID/offer";
  };

  const handleStartChat = () => {
    /* Add logic for handling "Start a Chat" action */
    console.log("Start a Chat clicked for listing:", listing);
    window.location.href = "/listings/:listingID/chat";
  };

  const handleEditListing = () => {
    /* Add logic for handling "Edit Listing" action */
    console.log("Edit Listing clicked for listing:", listing);
    window.location.href = "/listings/:listingID/edit";
  };

  const handleDeleteListing = () => {
    /* Add logic for handling "Delete Listing" action */
    console.log("Delete Listing clicked for listing:", listing);
    window.location.href = "/listings/:listingID/delete";
  };

  /* first check if listing data is available, then render */
  return (
    <div className="listing-container">
      {listing ? (
        <div className="listing-content">
          <div>
            <h1>{listing.name}</h1>
            {/* Check if there is only one image */}
            {images.length === 1 ? (
              <div className="single-image-container">
                <img src={images[0].imageURL} alt="Listing" className="single-image" />
              </div>
            ) : (
              <div className="images">
                <ImageCarousel images={images} />
              </div>
            )}
            <p className="price-buyerview">${listing.price}</p>
            <button className="btn" onClick={handleBuyNow}>Buy Now</button>
            <button className="btn" onClick={handleMakeOffer}>Make Offer</button>
            <button className="btn" onClick={handleStartChat}>Start a Chat</button>
            {isOwner && (
              <>
                <button onClick={handleEditListing}>Edit Listing</button>
                <button onClick={handleDeleteListing}>Delete Listing</button>
              </>
            )}
          </div>
          <div className="description">
            <h3>Description</h3>
            <p>{listing.description}</p>
          </div>
        </div>
      ) : (
        <p>LISTING IS NULL</p>
      )}
    </div>
  );
};

export default ListingView;