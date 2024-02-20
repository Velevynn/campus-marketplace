import React, { useState } from "react";
import axios from "axios";

function Form() {
  const [listings, setListings] = useState([]);
  const [listing, setListing] = useState({
    title: "",
    description: "",
    price: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setListing(prevListing => ({
      ...prevListing,
      [name]: value
    }));
  }

  function updateList(listing) {
    makePostCall(listing).then((result) => {
      //if (result && result.status === 201)
      // Change listing to result of post call once database is set up
      setListings([...listings, listing]);
      console.log(result);
    });
  }

  async function makePostCall(person) {
    try {
      const response = await axios.post(
        `http://localhost:8000/users`,
        person
      );
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  function submitForm() {
    updateList(listing);
    setListing({ title: "", description: "", price: "" });
  }

  return (
    <div>
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

        <input type="button" value="Post Listing" onClick={submitForm} />
      </form>
    </div>
  );
}

export default Form;
