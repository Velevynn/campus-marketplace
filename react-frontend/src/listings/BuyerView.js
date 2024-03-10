import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BuyerView.css";
import ImageCarousel from "../components/ImageCarousel";

const BuyerListingView = () => {
  const { listingID } = useParams();
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);

  /* hook to fetch data when listingID changes */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /* get data of listing by its ID */
        const response = await axios.get(
          `http://localhost:8000/listings/${listingID}`,
        );
        /* set fetched data to state */
        if (response.data.length > 0) {
          setListing(response.data[0]);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };

    fetchData();
  }, [listingID]);

    /* Hook to fetch images when listingID changes */
  useEffect(() => {
    const fetchImages = async () => {
      try {
        /* Fetch images for the listing from the backend */
        const response = await axios.get(
          `http://localhost:8000/listings/images/${listingID}`,
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

  const handleBuyNow = () => {
    /* Add logic for handling "Buy Now" action */
    console.log("Buy Now clicked for listing:", listing);
  };

  const handleMakeOffer = () => {
    /* Add logic for handling "Make Offer" action */
    console.log("Make Offer clicked for listing:", listing);
  };

  const handleStartChat = () => {
    /* Add logic for handling "Start a Chat" action */
    console.log("Start a Chat clicked for listing:", listing);
  };

  /* first check if listing data is available, then render */
  return (
    <div className="container">
      {listing ? (
        <div>
          <h1>{listing.name}</h1>
          <div className="images">
            <ImageCarousel images={images} />
          </div>
          <p className="price-buyerview">${listing.price}</p>
          <p>Description: {listing.description}</p>
          <div className="buttons">
            <button onClick={handleBuyNow}>Buy Now</button>
            <div>
              <button onClick={handleMakeOffer}>Make Offer</button>
              <button onClick={handleStartChat}>Start a Chat</button>
            </div>
          </div>
        </div>
      ) : (
        <p>LISTING IS NULL</p>
      )}
    </div>
  );
};

export default BuyerListingView;
