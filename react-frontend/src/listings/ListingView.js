import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageCarousel from "../components/ImageCarousel.js";
import LoadingSpinner from "../components/LoadingSpinner.js";
import ShareButton from "../components/ShareButton.js"
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';
import emptyBookmark from "../assets/empty-bookmark.png";
import filledBookmark from "../assets/filled-bookmark.png";
import { FaUser } from 'react-icons/fa';
import './ListingView.css';

function ListingView() {
  const { listingID } = useParams();
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isBookmarked, setBookmark] = useState(false);
  const [loggedID, setLoggedID] = useState(null);
  const [username, setUsername] = useState("");
  const [ownerID, setOwnerID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // hook to retrieve logged in userID from jwt token
  useEffect(() => {
    const fetchUserID = async () => {
      if (!loggedID) {
        console.log("Fetching userID from JWT token.");
        const token = localStorage.getItem(process.env.JWT_TOKEN_NAME);
        if (token) {
          const decodedToken = jwtDecode(token);
          const username = decodedToken.username;
          console.log("Decoded username:", username);
          try {
            // Make a request to the backend to fetch the userID based on the username
            const userData = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/users/userID`, { 
              params: {
                'username': username
              }
            }, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            console.log("loggedID:", userData.data.userID);
            setLoggedID(userData.data.userID);
          }
          catch (error) {
            console.log("Error while fetching userID from JWT token:", error);
          }
            
          return;
        }
        // return null if there is no token
        return null;
      }
    }
    fetchUserID();
  }, []);

  /* hook to fetch data when listingID changes */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /* get data of listing by its ID */
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_LINK + `/listings/${listingID}`,
        );
        (console.log(response.data[0].category))
        
        /* set fetched data to state */
        if (response.data.length > 0) {
          setListing(response.data[0]);
          setOwnerID(response.data[0].userID);
          /* check currently logged-in userID */
          if(loggedID){
            setIsOwner(response.data[0].userID === loggedID); // If userIDs are the same, we know this user owns this listing
            console.log("logged in userID: ", loggedID);
          }
        } else {
          console.log("user not logged in or token not found");
        }

        // Fetch username separately using the userID
        if (response.data[0].userID) {
          const usernameResponse = await axios.get(
            process.env.REACT_APP_BACKEND_LINK + `/users/public-profile/${response.data[0].userID}`,
          );
          
          if (usernameResponse.data) {
            setUsername(usernameResponse.data.username);
          }
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [listingID, loggedID]);

  // Hook to fetch initial bookmark status if the user is logged in.
  useEffect(() => {
    if (loggedID) {
      console.log("After fetch:", loggedID)

      const fetchBookmark = async () => {
        console.log("Fetching initial bookmark status with userID:", loggedID)
        try {
          // Check if a bookmark exists.
          console.log(process.env.REACT_APP_BACKEND_LINK)
          const bookmarked = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/listings/${listingID}/bookmark`, {
            params: {
              'userID': loggedID,
              'listingID': listingID
            }
          })
    
          if (bookmarked.status === 200) {
            setBookmark(true);
          }
        }
        catch (error) {
          console.log("Error while retrieving initial bookmark status: ", error);
        }
      };
      fetchBookmark();
    }
  }, [loggedID]);

  /* Hook to fetch images when listingID changes */
  useEffect(() => {
    const fetchImages = async () => {
      try {
        /* Fetch images for the listing from the backend */
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_LINK + `/listings/images/${listingID}`,
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
    let currentDate = new Date();
    let postDate = new Date(string);
    const difference = currentDate.getTime() - postDate.getTime();
    const differenceInDays = Math.round(difference / (1000 * 3600 * 24));
    let message = "";
    if (differenceInDays > 1) {
      message = differenceInDays.toString() + " days ago";
    } else {
      message = differenceInDays.toString() + " day ago";
    }

    return message;
  }

  const handleMakeOffer = () => {
    console.log("Make Offer clicked for listing:", listing);
    navigate(`/listings/${listingID}/offer`);
  };

  const handleStartChat = () => {
    console.log("Start a Chat clicked for listing:", listing);
    const url = process.env.REACT_APP_FRONTEND_LINK + `/listings/${listingID}/chat`;
    window.history.replaceState({}, "", url);
    window.location.reload();
  };

  const handleEditListing = () => {
    console.log("Edit Listing clicked for listing:", listing);
    navigate(`/listings/${listingID}/edit`);
  };

  const handleDeleteListing = async () => {
    console.log("Delete Listing clicked for listing:", listing);
  
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    
    if (confirmed) {
      try {
        console.log("listingID deleting: ", listingID);
        await axios.delete(process.env.REACT_APP_BACKEND_LINK + `/listings/${listingID}`);
        console.log("listing successfully deleted");
        const url = process.env.REACT_APP_FRONTEND_LINK + `/`
        window.history.replaceState({}, "", url);
        window.location.reload();
      } catch (error) {
        console.error("error deleting listing", error);
      }
    } else {
      console.log("Deletion cancelled by user.");
    }
  };

  const toggleBookmark = async () => {
    console.log("Toggle Bookmark clicked for listing: ", listing);
    console.log("Current bookmark status: ", isBookmarked);
    if (!isBookmarked) {
      console.log("Posting bookmark with userID", loggedID, "and listingID", listingID);
      try {
        createBookmark();
        setBookmark(true);
      }
      catch (error) {
        console.log("Error in toggleBookmark.");
      }
    } else if (isBookmarked) {
      console.log("Deleting bookmark with userID:", loggedID, "and listingID:", listingID);
      try {
        deleteBookmark();
        setBookmark(false);
      }
      catch (error) {
        console.log("Error in toggleBookmark.");
      }
    }
    console.log("New bookmark status: ", isBookmarked);
  }

  const createBookmark = async () => {
    console.log("Entered createBookmark");
    if (!loggedID) {
      const url = process.env.REACT_APP_FRONTEND_LINK + `/login`;
      window.history.replaceState({}, "", url);
      window.location.reload();
    }
    else {
      try {
        await axios.post(
          process.env.REACT_APP_BACKEND_LINK + `/listings/${listingID}/bookmark`, {
            'userID': loggedID,
            'listingID': listingID,
            'title' : listing.title
          }
        )
        setBookmark(true);
        console.log("Posted bookmark.")
        console.log(isBookmarked);
      } catch (error) {
        console.error("Error posting bookmark: ", error)
      }
      console.log("Finished creating bookmark")
    }
    
  }

  const deleteBookmark = async () => {
    console.log("Entered deleteBookmark");
    try {
      await axios.delete(
        process.env.REACT_APP_BACKEND_LINK + `/listings/${listingID}/bookmark`, {
          params: {
            'userID': loggedID,
            'listingID': listingID
          }
        }
      )
      setBookmark(false);
      console.log("Deleted bookmark.")
      console.log(isBookmarked);
    } catch (error) {
      console.error("Error deleting bookmark: ", error);
    }
  }

  if (!listing) {
    return (
        <div className="margin">
          <LoadingSpinner/>
        </div>
    );
  }

  const getBookmarkCount = () => {
    const bookmarkCount = (isBookmarked) ? Number(listing.bookmarkCount) + 1 : listing.bookmarkCount;

    if (bookmarkCount == 1) {
      // If it's only 1 bookmark count, change to "person is watching"
      return bookmarkCount + " person is watching";
    } else {
      return bookmarkCount + " people are watching";
    }

  }

  return (
    <div>
    {isLoading ? (
            <div><LoadingSpinner/> {/*Visible loading spinner that runs until all data for elements are made available*/}</div> 
          ) : ( 
            <div className="vertical-center margin">
                  <div className="medium-container drop-shadow">
                    <div className="listing-layout">
                      <div className="margin vertical-center flex-column">
                        <ImageCarousel images={images} />
                        <div className="">
                        {isOwner && (
                          <>
                            <button className="muted-button margin-right" onClick={handleEditListing}>Edit</button>
                            <button style={{backgroundColor: "red"}}onClick={handleDeleteListing}>Delete</button>
                          </>
                        )}
                        </div>
                      </div>
                      <div className="margin" type="text">
                        <h1 className="no-margin-top no-margin-bottom">{listing.title}</h1>
                        <h5 style={{margin: "0"}}><Link to = {`/marketplace?q=${listing.category}`}>{listing.category}</Link></h5>
                        <p>Posted {TimeAgo(listing.postDate)}</p>
                        <p>
                            {getBookmarkCount()}
                        </p>
                        <h5 style={{color: "green"}}>{listing.price === "0" || listing.price === 0 ? "FREE" : "$" + listing.price}</h5>
                        <p>{listing.description}</p>
                          <div style={{display: 'flex', alignItems: 'center', marginTop: "100px"}}>
                            <Link to = {`/profile/${ownerID}`}  style={{ display: 'flex', alignItems: 'center' }}>
                            <FaUser style = {{marginRight: "10px"}}/>
                              <h5 style={{paddingBottom:"1px"}}>
                                {username}    
                              </h5>
                            </Link>
                          </div>
                      </div>
                    </div>
                    <div className="vertical-center margin-top">
                        <button className="margin-right" onClick={handleMakeOffer}>Make Offer</button>
                        <button className="margin-right" onClick={handleStartChat}>Start Chat</button>

                        <div className="vertical-center margin-right" onClick={toggleBookmark}>
                          {isBookmarked ? 
                          (<img className="bookmark" src={filledBookmark}/>) : 
                          (<img className="bookmark" src={emptyBookmark}/>)
                          }</div>

                          <ShareButton link = {`${process.env.REACT_APP_FRONTEND_LINK} + "/listings/" + ${listingID}`} type = 'Listing'/>
                        
                    </div>
                  </div>
              </div>
          )}
    </div>
    
  );
}

export default ListingView;
