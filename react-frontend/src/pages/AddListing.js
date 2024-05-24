import React, { useState, useEffect } from "react";
import Notify from "../components/ErrorNotification";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { jwtDecode } from "jwt-decode";
import "./AddListing.css";

function AddListing() {
  const MINIMUM_IMAGE_WIDTH = 500;
  const MINIMUM_IMAGE_HEIGHT = 500;
  const [listing, setListing] = useState({
    userID: null,
    title: "",
    description: "",
    price: "",
    expirationDate: null,
    quantity: 1,
    images: [],
    category: null
  });
  const [showNotification, setShowNotification] = useState(false); // Shows notification
  const [notificationMsg, setNotificationMsg] = useState(""); // Sets notification msg
  const [loading, setLoading] = useState(false); // Shows loading spinner when posting image
  const [key, setKey] = useState(0); // Allows notification to appear multiple times for same image

  useEffect(() => {
    // Scrolls down when images are added to show container on smaller screens
    const scrollToPosition = () => {
      window.scrollTo({
        top: 1000,
        behavior: "smooth"
      });
    };
    scrollToPosition();
  }, [listing.images]);
  
  function handleChange(event) {
    // Updates value in input box
    const { name, value } = event.target;
    if (name === "price") {
      if (!isNaN(value)) {
        // Update the state only if the value is a valid number
        setListing((prevListing) => ({
          ...prevListing,
          [name]: value, // Update "price" with the parsed number value
        }));
      }
    } else {
      setListing((prevListing) => ({
        ...prevListing,
        [name]: value,
      }));
    }
  }

  const removeImage = (indexToRemove) => {
    //Removes an image from the state
    setListing(prevListing => ({
      ...prevListing,
      images: prevListing.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  function displayNotification(message) {
    // Displays a notification with the given message
    setNotificationMsg(message);
    setShowNotification(true);
    setTimeout(() => {
       // Hides notification after 3 seconds
      setShowNotification(false);
    }, 3300);
  }

  function handleImageChange(event) {
    const files = Array.from(event.target.files);
    if (files.length > 8) {
      // Checks if number of images selected is greater than 8
      displayNotification("Max number of images is 8");
      setListing(prevListing => ({
        ...prevListing,
        images: []
      }));
      setKey(key === 0 ? 1 : 0);
      return;
    }
  
    const promises = files.map(file => {
      // Turns files uploaded into image object
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            resolve({ file, width: img.width, height: img.height });
          };
          img.onerror = () => {
            reject(new Error("Failed to load image"));
          };
        };
        reader.readAsDataURL(file);
      });
    });
  
    Promise.all(promises)
      .then(results => {
        // Check if any images are under 500x500 minimum resolution
        const nonValidImages = results.filter(({ width, height }) => {
          return width < MINIMUM_IMAGE_WIDTH || height < MINIMUM_IMAGE_HEIGHT;
        });
        if (nonValidImages.length > 0) {
          setListing(prevListing => ({
            ...prevListing,
            images: []
          }));
          displayNotification(`Minimum image resolution: ${MINIMUM_IMAGE_WIDTH}x${MINIMUM_IMAGE_HEIGHT}px`);
          setKey(key === 0 ? 1 : 0);
          // Don't update the state if there are non-valid images
        } else {
          // Update the state with valid images if all images meet the resolution criteria
          setListing(prevListing => ({
            ...prevListing,
            images: files
          }));
          setKey(key === 0 ? 1 : 0);
        }
      })
      .catch(error => {
        console.error("Error validating image:", error);
        displayNotification("Error validating image file");
        return []; 
        
      });
  }
  

  async function submitForm() {
      const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage
      const decodedToken = jwtDecode(token); // Decode the token
      const username = decodedToken.username; // Extract the username from the token
  
      try {
        setLoading(true);
        // Make a request to the backend to fetch the userID based on the username
        const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/users/userID`, { 
          params: {
            'username': username
          }
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        const userID = response.data.userID;
  
        const formData = new FormData();
        formData.append('userID', userID); // Include the userID in the form data
        formData.append('title', listing.title);
        formData.append('description', listing.description);
        formData.append('price', listing.price);
        formData.append('expirationDate', listing.expirationDate);
        formData.append('quantity', listing.quantity);
        formData.append('category', listing.category);
        listing.images.forEach((image) => {
          formData.append(`image`, image);
        });
        
        try {
          // Send formdata to backend to store in database
          await axios.post(process.env.REACT_APP_BACKEND_LINK + '/listings', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          // Send to marketplace
          const url = process.env.REACT_APP_FRONTEND_LINK + `/marketplace`
          window.history.replaceState({}, "", url);
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  
  
  

  return (
    <div className="vertical-center add-listing-layout margin">
    <div className="small-container drop-shadow" style={{fontFamily: "inter"}}>
      {loading? (
        <>
          <h3 className="vertical-center">Posting your listing</h3>
          <LoadingSpinner/>
        </>
      ) : (
      <>
        <h2 className="vertical-center no-margin-bottom">Post Listing</h2>
        <form>
          <label htmlFor="title">Title (Required)</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Title your listing here."
            value={listing.title}
            onChange={handleChange}
          />
          <label htmlFor="category">Category</label>
          <select
          id="dropdown"
          name="options"
          value={listing.category}
          onChange={handleChange}>
            <option value="Other">Other</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Property Rentals">Property Rentals</option>
            <option value="Apparel">Apparel</option>
            <option value="Classifieds">Classifieds</option>
            <option value="Electronics">Electronics</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Family">Family</option>
            <option value="Free Stuff">Free Stuff</option>
            <option value="Garden & Outdoor">Garden & Outdoor</option>
            <option value="Hobbies">Hobbies</option>
            <option value="Home Goods">Home Goods</option>
            <option value="Home Improvement">Home Improvement</option>
            <option value="Supplies">Supplies</option>
            <option value="Home Improvement Supplies">Home Improvement Supplies</option>
            <option value="Home Sales">Home Sales</option>
            <option value="Musical Instruments">Musical Instruments</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Pet Supplies">Pet Supplies</option>
            <option value="Sporting Goods">Sporting Goods</option>
            <option value="Toys & Games">Toys & Games</option>
            <option value="Buy and Sell Groups">Buy and Sell Groups</option>
          </select>
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={listing.description}
            placeholder="Write about your item here."
            onChange={handleChange}
          />
          <label htmlFor="price">Price (Required)</label>
          <input
            type="text"
            name="price"
            id="price"
            placeholder="Price your listing here."
            value={listing.price}
            onChange={handleChange}
          />   
        </form>
        <p className="vertical-center margin"> {listing.images.length}/8 images selected</p>
        <div className="vertical-center margin">
            <label htmlFor="images" className="span-button">
              <span>Select Images (Required)</span>
              <input
                type="file"
                key={key}
                name="images"
                id="images"
                accept="image/*"
                multiple
                className="custom-file-input"
                onChange={handleImageChange}
              />
            </label>
        </div>
        <div className="vertical-center margin">
          <button className={`span-button ${listing.title.length > 0 && 
            listing.price.length > 0 && listing.images.length > 0 ? "" : "disabled"}`} 
            onClick={submitForm}>Post Listing</button>
        </div>
        {showNotification && <Notify message={notificationMsg} />}
      </>
      )}
    </div>
      {(listing.images.length > 0 && !loading) && <div className="flex-container drop-shadow margin">
        <h5 className="text-center no-margin-top">Click to remove image</h5>
        <div className="thumbnails vertical-center" >
          {listing.images.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt={`Thumbnail ${index}`}
              onClick={() => removeImage(index)}
            />
          ))}
        </div>
      </div>}
    </div>
  );
}

export default AddListing;