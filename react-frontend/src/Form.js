import React, { useState } from "react";

function Form(props) {

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
    props.handleSubmit(listing);
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
