import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageCarousel from "../components/ImageCarousel.js";
import LoadingSpinner from "../components/LoadingSpinner.js";
import { jwtDecode } from "jwt-decode";

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
        
        /* set fetched data to state */
        if (response.data.length > 0) {
          setListing(response.data[0]);
          /* check currently logged-in userID */
          const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage
          if(token){
            const decodedToken = jwtDecode(token); // Decode the token
            const username = decodedToken.username; // Extract the username from the token
            try {
              // Make a request to the backend to fetch the userID based on the username
              const response2 = await axios.get(`https://haggle.onrender.com/users/userID`, { 
                params: {
                  'username': username
                }
              }, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
        
              const loggedInUserID = response2.data.userID;
              setIsOwner(response.data[0].userID === loggedInUserID); // If userIDs are the same, we know this user owns this listing
              console.log("logged in userID: ", loggedInUserID);
            } catch (error) {
              console.log(error);
            }
          } else{
            console.log("user not logged in or token not found");
          }
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

  const handleDeleteListing = async () => {
    console.log("Delete Listing clicked for listing:", listing);
    //window.location.href = "/listings/:listingID/delete";
    try {
      console.log("listingID deleting: ", listingID);
      await axios.delete(`https://haggle.onrender.com/listings/${listingID}`,
      );
      console.log("listing successfully deleted");
      window.location.href = '/'; // go back to home page
    } catch (error){
      console.error("error deleting listing", error);
    }
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