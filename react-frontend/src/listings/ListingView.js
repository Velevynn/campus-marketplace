import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageCarousel from "../components/ImageCarousel.js";
import LoadingSpinner from "../components/LoadingSpinner.js";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

//TODO: Bookmark -> useEffect to grab current status, toggle on button 

const ListingView = () => {
  const { listingID } = useParams();
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isBookmarked, setBookmark] = useState(false);
  const [loggedID, setLoggedID] = useState(null);

  const navigate = useNavigate();
  console.log(setIsOwner);
  /* hook to fetch data when listingID changes */



  useEffect(() => {
    const fetchData = async () => {
      try {
        /* get data of listing by its ID */
        const listingData = await axios.get(
          `https://haggle.onrender.com/listings/${listingID}`,
        );
        /* set fetched data to state */
        if (listingData.data.length > 0) {
          setListing(listingData.data[0]);

          /* check currently logged-in userID */
          const userID = fetchUserID();

          // Check if user is logged in.
          if (userID) {
            console.log("User is logged in.")
            setLoggedID(userID)
            setIsOwner(listingData.data[0].userID === userID);
            console.log("State: logged in userID", loggedID);
            console.log("Params passed into initial bookmark status check: ", userID, listingID);

            // Check initial bookmark status.
            fetchBookmark()
          }
          
          // User is not logged in or token is not found.
          else{
            console.log("User is not logged in or token not found");
          }
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
    navigate(`/listings/${listingID}/edit`);
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

  // Toggle the local bookmark status.
  const toggleBookmark = async () => {
    console.log("Toggle Bookmark clicked for listing: ", listing);
    console.log("Current bookmark status: ", isBookmarked);
    // If the listing is not currently bookmarked, bookmark it.
    if (!isBookmarked) {
      console.log("Posting bookmark with userID", loggedID, "and listingID", listingID);
      createBookmark();
      setBookmark(true);
    }
    // If the listing is currently bookmarked, remove it.
    else if (isBookmarked) {
      console.log("Deleting bookmark with userID:", loggedID, "and listingID:", listingID);
      deleteBookmark();
      setBookmark(false);
    }
    console.log("New bookmark status: ", isBookmarked);
  }

  const createBookmark = async () => {
    console.log("Entered createBookmark");
    try {
      await axios.post(
        `https://haggle.onrender.com/listings/${listingID}/bookmark`, {
          'userID': loggedID,
          'listingID': listingID
        }
      )
      console.log("Posted bookmark.")
    }
    // Set an error while posting the bookmark data.
    catch (error) {
      console.error("Error posting bookmark: ", error)
    }
  }

  const deleteBookmark = async () => {
    console.log("Entered deleteBookmark");
    try {
      await axios.delete(
        'https://haggle.onrender.com/listings/${listingID}/bookmark', {
          'userID': loggedID,
          'listingID': listingID
        }
      )
    }
    // Set an error while deleting the bookmark data.
    catch (error) {
      console.error("Error deleting bookmark: ", error);
    }
  }

  const fetchUserID = async () => {
    console.log("Fetching userID from JWT token.");
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const username = decodedToken.username;
      console.log("Decoded username:", username);
      try {
        // Make a request to the backend to fetch the userID based on the username
        const userData = await axios.get(`https://haggle.onrender.com/users/userID`, { 
          params: {
            'username': username
          }
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        return userData.data.userID;
      }
      catch (error) {
        console.log("Error while fetching userID from JWT token:", error);
      }
    }
    // return null if there is no token
    return null;
  }

  const fetchBookmark = async () => {
    console.log("Fetching initial bookmark status with userID:", loggedID)
    try {
      // Check if a bookmark exists.
      const bookmarked = await axios.get('https://haggle.onrender.com/listings/${listingID}/bookmark', {
        params: {
          'userID': loggedID,
          'listingID': listingID
        }
      })

      if (bookmarked.status == 200) {
        setBookmark(true);
      }
    }
    catch (error) {
      console.log("Error while retrieving initial bookmark status: ", error);
    }
  }
  

  if (!listing) {
    return (
      <LoadingSpinner/>
    );
  }

  // TODO: Find images for the bookmark toggle
  /* first check if listing data is available, then render */
  return (
    <div className="medium-container">
      <div className="flex-row">
        <div>
          <ImageCarousel images={images} />
        </div>
        <div className="margin-left">
          <h1>{listing.title}</h1>
          <p>Posted {TimeAgo(listing.postDate)}</p>
          <h5 style={{color: "green"}}>${listing.price}</h5>
          <p>{listing.description}</p>
        </div>
      </div>
      <div className="text-right margin-top">
        {isOwner && (
          <>
            <button className="muted-button margin-right" onClick={handleEditListing}>Edit Listing</button>
            <button className="muted-button margin-right" onClick={handleDeleteListing}>Delete Listing</button>
          </>
        )}
            <button className="margin-right" onClick={handleBuyNow}>Buy Now</button>
            <button className="margin-right" onClick={handleMakeOffer}>Make Offer</button>
            <button className="margin-right" onClick={handleStartChat}>Start a Chat</button>
            <button className="margin-right" onClick={toggleBookmark}>{isBookmarked ? 'Unbookmark' : 'Bookmark'}</button>
        </div>
    </div>
  );
};

export default ListingView;