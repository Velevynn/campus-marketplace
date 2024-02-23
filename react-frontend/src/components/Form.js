// Form.js (Karan)

import React, { useState } from "react";
import axios from 'axios';
import "./form.css";

function Form() {

  const [listing, setListing] = useState({
    title: "",
    description: "",
    price: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "price") {
      if (!isNaN(value)) {
        // Update the state only if the value is a valid number
        setListing(prevListing => ({
          ...prevListing,
          [name]: value // Update "price" with the parsed number value
        }));
      }
    } else {
      setListing(prevListing => ({
        ...prevListing,
        [name]: value
      }));
    }
  }

  function submitForm() {
    if (listing.price !== "" && listing.description !== "" && listing.price !== "") {
        handleSubmit(listing);
        window.location.href = '/marketplace';
    }
  }

  return (
    <div className="form-container" style = {{fontFamily: "Inter"}}>
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
        <input
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

        <input type="button" value="Post Listing" onClick={submitForm} style = {{backgroundColor: "#426B1F"}} />
      </form>
    </div>
  );
}

async function handleSubmit(person) {
    try {
      const response = await axios.post(
        `http://localhost:8000/listings`,
        person
      );
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

export default Form;