import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageCarousel from "../components/ImageCarousel.js";
import LoadingSpinner from "../components/LoadingSpinner.js";
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
          `http://localhost:8000/listings/${listingID}`,
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
          `http://localhost:8000/listings/images/${listingID}`,
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

  const TimeAgo = (timestamp) => {
    
    const string = timestamp.toString().slice(5,7) + '/' + timestamp.toString().slice(8,10) + '/' + timestamp.toString().slice(0,4);
    //timestamp = string;
    console.log(string);
    let currentDate = new Date();
    let postDate = new Date(string);
    const difference = currentDate.getTime() - postDate.getTime();
    const differenceInDays = Math.round(difference / (1000 * 3600 * 24));
    console.log(difference);
    let message = "";
    if (differenceInDays > 1) {
      message = differenceInDays.toString() + " days ago";
    } else {
      message = differenceInDays.toString() + " day ago";
    }

    return message;
  }

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

  if (!listing) {
    return (
      <LoadingSpinner/>
    );
  }

  /* first check if listing data is available, then render */
  return (
    <div className="medium-container">
      <div className="flex-row">
        <div>
          <ImageCarousel images={images} />
          <div className="margin-top">
            <button className="margin-right" onClick={handleBuyNow}>Buy Now</button>
            <button className="margin-right" onClick={handleMakeOffer}>Make Offer</button>
            <button className="margin-right" onClick={handleStartChat}>Start a Chat</button>
        </div>
        </div>
        

        <div className="margin-left">
          <h1>{listing.title}</h1>
          <h5>${listing.price}</h5>
          <p>Posted {TimeAgo(listing.postDate)}</p>
          <p>{listing.description}</p>
        </div>
          
          
        
        {isOwner && (
          <>
            <button onClick={handleEditListing}>Edit Listing</button>
            <button onClick={handleDeleteListing}>Delete Listing</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ListingView;