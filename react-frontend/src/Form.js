import React, { useState } from "react";
//import React from "react";

// let unused;
// unused = fred;

function Form(props) {
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

  function submitForm() {
    props.handleSubmit(listing);
    setListing({ title: "", description: "", price: "" });
  }

  return (
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

      <input type="button" value="Post" onClick={submitForm} />
    </form>
  );
}

export default Form;
