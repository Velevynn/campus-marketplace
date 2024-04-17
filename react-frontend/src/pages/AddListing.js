import React, { useState } from "react";
import Notify from "../components/ErrorNotification";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { jwtDecode } from "jwt-decode";

function AddListing() {
  const [listing, setListing] = useState({
    userID: null,
    title: "",
    description: "",
    price: "",
    expirationDate: null,
    quantity: 1,
    images: []
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
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

  function displayNotification(message) {
    setNotificationMsg(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false); // Hide notification after 3 seconds
    }, 3300);
  }

  function handleImageChange(event) {
    const files = Array.from(event.target.files);
    if (files.length > 8) {
      displayNotification("Max number of images is 8");
      setListing(prevListing => ({
        ...prevListing,
        images: []
      }));
      return;
    }
  
    // Check resolution of each image
    const promises = files.map(file => {
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
        const nonValidImages = results.filter(({ width, height }) => {
          return width < 500 || height < 500;
        });
        if (nonValidImages.length > 0) {
          setListing(prevListing => ({
            ...prevListing,
            images: []
          }));
          displayNotification("Minimum Image Resolution is 500x500px");
          // Don't update the state if there are non-valid images
        } else {
          // Update the state with valid images if all images meet the resolution criteria
          setListing(prevListing => ({
            ...prevListing,
            images: files
          }));
        }
      })
      .catch(error => {
        console.error("Error checking image resolution:", error);
        return []; // Return an empty array in case of error
      });
  }
  

  async function submitForm() {
      const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage
      const decodedToken = jwtDecode(token); // Decode the token
      const username = decodedToken.username; // Extract the username from the token


      if (listing.title == "") {
        displayNotification("Must fill out Title field");
        return;
      } else if (listing.price == "") {
        displayNotification("Must fill out Price field");
        return;
      } else if (listing.images.length == 0) {
        displayNotification("Must upload at least one image");
        return;
      }
  
      try {
        setLoading(true);
        // Make a request to the backend to fetch the userID based on the username
        const response = await axios.get(`http://localhost:8000/users/userID`, { 
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
        listing.images.forEach((image) => {
          formData.append(`image`, image);
        });
        
        try {
          await axios.post('http://localhost:8000/listings', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          window.location.href = '/marketplace';
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
      displayNotification("Must fill out Title and Price fields");
    }
  
  
  

  return (
    <div className="small-container" style={{ fontFamily: "Inter" , boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
      {loading? (
        <>
          <h3 className="vertical-center">Posting your listing</h3>
          <LoadingSpinner/>
        </>
      ) : (
      <>
        <h3 className="vertical-center">Post Listing</h3>
        <form className="">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={listing.title}
            onChange={handleChange}
          />
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={listing.description}
            onChange={handleChange}
          />
          <label htmlFor="price">Price</label>
          <input
            type="text"
            name="price"
            id="price"
            value={listing.price}
            onChange={handleChange}
          />   
        </form>

        <div className="vertical-center">
          <div className="margin-top">
            <label htmlFor="images" className="button">
              <span>Select Images</span>
              <input
                type="file"
                name="images"
                id="images"
                accept="image/*"
                multiple
                className="custom-file-input"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
        <p className="vertical-center margin"> {listing.images.length}/8 images selected</p>
        <div className="vertical-center" >
          <button onClick={submitForm}>Post Listing</button>
        </div>
        {showNotification && <Notify message={notificationMsg} />}
      </>
      )}
    </div>
  );
}

export default AddListing;