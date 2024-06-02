import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import ArrowButton from "../components/ArrowButton"

function EditListing() {
  const { listingID } = useParams();
  const navigate = useNavigate();
  const [imageDisplay, setImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [listing, setListing] = useState({
    userID: null,
    title: "",
    description: "",
    price: "",
    expirationDate: null,
    quantity: 1,
    newImages: [],
    category: null
  });

  // Function to fetch and set the existing listing data including images
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem(process.env.JWT_TOKEN_NAME);
        const decodedToken = jwtDecode(token);
        const username = decodedToken.username;
        console.log("username: ", username);

        // Fetch listing details including images
        const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/listings/${listingID}`, {
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
            category: fetchedListing.category
            
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };

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

    fetchListing();
    fetchImages();
  }, [listingID]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setListing((prevListing) => ({
      ...prevListing,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setListing((prevListing) => ({
      ...prevListing,
      newImages: [...prevListing.newImages, ...files]
    }));
  };

  const handleDeleteOldImage = async (indexToRemove) => {
    setImagesToRemove((prevImagesToRemove) => {
      // Create a copy of the previous array to avoid mutation
      const newImagesToRemove = [...prevImagesToRemove];
      // Append imageDisplay[indexToRemove] to the new array
      newImagesToRemove.push(imageDisplay[indexToRemove]);
      // Return the updated array
      return newImagesToRemove;
    });
    setImages((prevImageDisplay) => {
      // Create a copy of the previous array to avoid mutation
      const newImageDisplay = [...prevImageDisplay];
      // Remove the corresponding item from imageDisplay
      newImageDisplay.splice(indexToRemove, 1);
      // Return the updated array
      return newImageDisplay;
    });
  
  };
  const handleDeleteNewImage = async (indexToRemove) => {
    setListing(prevListing => ({
      ...prevListing,
      newImages: prevListing.newImages.filter((_, index) => index !== indexToRemove)
    }));
  };


  const submitForm = async () => {
    if (listing.title !== "" && listing.price !== "") {
      try {
        const token = localStorage.getItem(process.env.JWT_TOKEN_NAME);
  
  
        // Send PUT request to update listing details
        await axios.put(process.env.REACT_APP_BACKEND_LINK + `/listings/${listingID}`, listing, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        
        // Update images for the listing
        const newImages = new FormData();
        listing.newImages.forEach((image) => {
          newImages.append("image", image);
        });


        // Send PUT request to update listing images
        await axios.put(process.env.REACT_APP_BACKEND_LINK + `/listings/images/${listingID}`, newImages, {
          params: { imagesToRemove },
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


  //TODO: how to set selected category to existing category
  return (
    <div className="vertical-center margin">
      <div className="small-container drop-shadow">
      <div className="vertical-center" style={{ display: 'flex', alignItems: 'center', marginRight: "1.5em" }}>
        <div onClick={() => {navigate(-1)}} style={{ rotate: '-90deg'}}>
          <ArrowButton></ArrowButton>
        </div>
        <h2 style={{fontSize: '2rem', margin: "0", marginLeft: "5px" }}>Edit Listing</h2>
      </div>
        <form>
          <label htmlFor="title">New Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={listing.title}
            onChange={handleChange}
          />
          <label htmlFor="category">New Category</label>
          <select
          id="category"
          name="category"
          onChange={handleChange}>
            <option value={listing.category}>No Change</option>
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
            {/*For displaying thumbnails, with hover stuff*/}
            {imageDisplay.map((image, index) => (
              <div
                key={index}
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={(e) => e.currentTarget.querySelector('.delete-overlay').style.visibility = 'visible'}
                onMouseLeave={(e) => e.currentTarget.querySelector('.delete-overlay').style.visibility = 'hidden'}
                onClick={() => handleDeleteOldImage(index)}
              >
                <img
                  src={image.imageURL}
                  alt={`Thumbnail ${index}`}
                  style={{ marginRight: '10px', cursor: 'pointer', transition: 'opacity 0.2s ease' }}
                  onMouseEnter={(e) => e.target.style.opacity = 0.5}
                  onMouseLeave={(e) => e.target.style.opacity = 1}
                />
                <div className="delete-overlay"
                     style={{
                       position: 'absolute',
                       top: '5px',
                       right: '7px',
                       visibility: 'hidden',
                       cursor: 'pointer'
                     }}
                >
                  {/* Red "X" icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#e3101a"
                    style={{ filter: 'drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.5))' }}
                  >
                    <path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59 5.59-5.59z" />
                  </svg>
                </div>
              </div>
            ))}
             {/*For displaying new selected images*/}
             {listing.newImages.map((file, index) => (
              <img
                key={`new-${index}`}
                src={URL.createObjectURL(file)}
                alt={`New Thumbnail ${index}`}
                style={{ marginRight: '10px' }}
                onClick={() => handleDeleteNewImage(index)}
              />
          ))}
          </div>

          {/*For displaying how many images have been selected*/}
          {listing.newImages.length > 0 && (
            <p>{listing.newImages.length} new image(s) selected</p>
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