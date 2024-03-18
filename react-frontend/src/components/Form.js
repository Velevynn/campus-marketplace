// Form.js (Karan)

import React, { useState } from "react";
import axios from "axios";
import "./form.css";
import { jwtDecode } from "jwt-decode";

function Form() {
  const [listing, setListing] = useState({
    userID: null,
    title: "",
    description: "",
    price: "",
    expirationDate: null,
    quantity: 1,
    images: []
  });

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

  function handleImageChange(event) {
    const files = Array.from(event.target.files);
    setListing(prevListing => ({
      ...prevListing,
      images: files
    }));
  }

  async function submitForm() {
    if (listing.title !== "" && listing.price !== "") {
      const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage
      const decodedToken = jwtDecode(token); // Decode the token
      const username = decodedToken.username; // Extract the username from the token
  
      try {
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
    }
  }
  
  
  

  return (
    <div className="form-container" style={{ fontFamily: "Inter" }}>
      <h2>Post Listing</h2>
      <form>
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

        {/*For displaying how many images have been selected*/}
        {listing.images.length > 0 && (
          <p>{listing.images.length} image(s) selected</p>
        )}


        <input
          type="button"
          value="Post Listing"
          onClick={submitForm}
        />
      </form>
    </div>
  );
}

export default Form;