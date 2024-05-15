import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function MakeOfferPage() {
  const [offer, setOffer] = useState("0");  // Initial state for the offer input
  const navigate = useNavigate();
  const { listingID } = useParams();

  const handleMakeOffer = async () => {
    try {
      // API call to create the chat and send the initial offer message
      const response = await axios.post(`/api/offers/${listingID}`, { offer });
      const chatID = response.data.chatID;  // Ensure this is the correct path to the chat ID in the response
      if (chatID) {
        navigate(`/listings/${listingID}/chat/${chatID}`);  // Correct navigation path
      } else {
        console.error('Chat ID not received:', response.data);
      }
    } catch (error) {
      console.error('Error making offer:', error);
    }
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    const numbers = value.replace(/[^0-9]/g, '');  // Strip non-numeric characters
    setOffer(numbers);  // Set the numbers directly as the offer
  };

  const formatNumber = (number) => {
    // Convert number to a string and format as USD currency without cents
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,  // No cents in the output
      maximumFractionDigits: 0   // Ensure no cents are displayed
    }).format(number);
  };

  const handleGoBack = () => {
    navigate(`/listings/${listingID}`);
  };

  return (
    <>
      <div className="vertical-center" style={{marginTop: "10%", marginBottom: "auto"}}>
      <div className="small-container drop-shadow">
        <h1 className="text-center" style={{ marginTop: '10px'}}>
          Enter Your Offer
        </h1>
        <form>
          <div className="margin input" style={{ marginTop: '20px', marginBottom: "20px"}}>
            <input
              type="text"
              name="identifier"
              id="identifier"
              required
              value={formatNumber(offer)}
              onChange={handleInputChange}
              maxLength="10"
            />
          </div>
          <div className="margin">
          <button className="span-button" onClick={handleMakeOffer}>
            Make Offer
          </button>
          </div>
          <div className="margin">
          <button className="span-button" onClick={handleGoBack}>
            Return to Listing
          </button>
          </div>
        </form>
      </div>
      </div>
    </>
  );
}

export default MakeOfferPage;