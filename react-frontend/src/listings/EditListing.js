import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

function EditListing() {
  const { listingID } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [listing, setListing] = useState({
    userID: null,
    title: "",
    description: "",
    price: "",
    expirationDate: null,
    quantity: 1,
    images: []
  });

  // Function to fetch and set the existing listing data including images
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const username = decodedToken.username;
        console.log("username: ", username);

        // Fetch listing details including images
        const response = await axios.get(`https://haggle.onrender.com/listings/${listingID}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const fetchedListing = response.data[0];

        if (fetchedListing && typeof fetchedListing.price !== "undefined" && typeof fetchedListing.title !== "undefined") {
          setListing((prevListing) => ({
            ...prevListing,
            userID: fetchedListing.userID,
            title: fetchedListing.title,
            description: fetchedListing.description || "",
            price: fetchedListing.price.toString(),
            expirationDate: fetchedListing.expirationDate || null,
            quantity: fetchedListing.quantity || 1,
            images: fetchedListing.images || []
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchListing();
  }, [listingID]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setListing((prevListing) => ({
      ...prevListing,
      [name]: value
    }));
  };

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

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setListing((prevListing) => ({
      ...prevListing,
      images: [...prevListing.images, ...files]
    }));
  };

  const submitForm = async () => {
    if (listing.title !== "" && listing.price !== "") {
      try {
        const token = localStorage.getItem("token");
  
        // Update listing details
        const listingData = {
          title: listing.title,
          description: listing.description,
          price: listing.price,
          expirationDate: listing.expirationDate,
          quantity: listing.quantity,
          images: listing.images
        };
  
        // Send PUT request to update listing details
        await axios.put(`https://haggle.onrender.com/listings/${listingID}`, listingData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        
        // Update images for the listing
        const formData = new FormData();
        listing.images.forEach((image) => {
          formData.append("image", image);
        });

        const formDataEntries = Array.from(formData.entries());
        console.log("FormData entries:", formDataEntries);

        // Send PUT request to update listing images
        await axios.put(`https://haggle.onrender.com/listings/images/${listingID}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
        
        // Redirect to the marketplace page after successful update
        navigate(`/listings/${listingID}`);
      } catch (error) {
        console.log("Error updating listing:", error);
      }
    }
  };

  return (
    <div className="vertical-center margin">
      <div className="small-container drop-shadow">
        <h2>Edit Listing</h2>
        <form>
          <label htmlFor="title">New Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={listing.title}
            onChange={handleChange}
          />
          <label htmlFor="description">New Description</label>
          <textarea
            name="description"
            id="description"
            value={listing.description}
            onChange={handleChange}
          />
          <label htmlFor="price">New Price</label>
          <input
            type="text"
            name="price"
            id="price"
            value={listing.price}
            onChange={handleChange}
          />
          <div className="thumbnails">
            {images.map((image, index) => (
              <img
                key={index}
                src={image.imageURL}
                alt={`Thumbnail ${index}`}
                style={{ marginRight: '10px' }} // Add inline style to create space between images
              />
            ))}
            {listing.images.map((file, index) => (
              <img
                key={`new-${index}`}
                src={URL.createObjectURL(file)}
                alt={`New Thumbnail ${index}`}
                style={{ marginRight: '10px' }} // Add inline style to create space between images
              />
          ))}
          </div>

          {/*For displaying how many images have been selected*/}
          {listing.images.length > 0 && (
            <p>{listing.images.length} new image(s) selected</p>
          )}

        </form>
        <div className="vertical-center">
          <div className="margin-top">
            <label htmlFor="images" className="button">
              <span>Add Images</span>
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
        <div className="vertical-center" >
          <button className="margin-top" onClick={submitForm}>Update</button>
        </div>
      </div>
    </div>
  );
}

export default EditListing;