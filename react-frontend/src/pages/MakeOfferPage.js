<<<<<<< HEAD
import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

function MakeOfferPage({onClose}) {
	const [offer, setOffer] = useState("0"); // Initial state for the offer input
	const navigate = useNavigate();
	const {listingID} = useParams();

	const handleMakeOffer = async () => {
		try {
			// API call to create the chat and send the initial offer message
			const response = await axios.post(`/api/offers/${listingID}`, {
				offer
			});
			const chatID = response.data.chatID; // Ensure this is the correct path to the chat ID in the response
			if (chatID) {
				navigate(`/listings/${listingID}/chat/${chatID}`); // Correct navigation path
			} else {
				console.error("Chat ID not received:", response.data);
			}
		} catch (error) {
			console.error("Error making offer:", error);
		}
	};

	const handleInputChange = event => {
		const {value} = event.target;
		const numbers = value.replace(/[^0-9]/g, ""); // Strip non-numeric characters
		setOffer(numbers); // Set the numbers directly as the offer
	};

	const formatNumber = number => {
		// Convert number to a string and format as USD currency without cents
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0, // No cents in the output
			maximumFractionDigits: 0 // Ensure no cents are displayed
		}).format(number);
	};

	return (
		<>
			<div
				className="vertical-center"
				style={{marginTop: "5%", marginBottom: "5%"}}
			>
				<div className="small-container drop-shadow">
					<h1 className="text-center">Enter Your Offer</h1>
					<form>
						<div
							className="margin input"
							style={{marginTop: "20px", marginBottom: "20px"}}
						>
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
							<button
								className="span-button"
								onClick={handleMakeOffer}
							>
								Make Offer
							</button>
						</div>
						<div className="margin">
							<button className="span-button" onClick={onClose}>
								Return to Listing
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
=======
import React, { useState, useEffect } from 'react';
import { Container, Form, OfferGroup, Offer, HeaderLabel, MakeOfferButton } from '../authentication/AuthenticationStyling';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function MakeOfferPage() {
  console.log("setup");
  const [offer, setOffer] = useState("0");
  const [buyer, setBuyer] = useState(null);
  const navigate = useNavigate();
  const { listingID } = useParams();

  useEffect(() => {
    console.log("use effect");
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      console.log("start call 1");
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setBuyer(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/login');
      }
      console.log("end call 1");
    };

    fetchUserProfile();
  }, [navigate]);

  const handleMakeOffer = async () => {
    console.log("start handleMakeOffer");
    if (!buyer) {
      console.error("Buyer information is not available.");
      return;
    }
    console.log("get token");
    const token = localStorage.getItem("token");

    try {
      console.log("listingResponse");
      const listingResponse = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/listings/${listingID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const listing = listingResponse.data;
      console.log(listing);

      console.log("sellerResponse: ", listing[0].userID);
      console.log(process.env.REACT_APP_BACKEND_LINK + `/users/${listing[0].userID}`);
      const sellerResponse = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/users/${listing[0].userID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const seller = sellerResponse.data;
      console.log(seller);
  
      navigate(`/chat`, { state: { listing, seller, buyer, offer } });
    } catch (error) {
      console.error('Error making offer:', error);
    }
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    const numbers = value.replace(/[^0-9]/g, '');
    setOffer(numbers);
};

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const handleGoBack = () => {
    navigate(`/listings/${listingID}`);
  };

  return (
    <>
      <Container>
        <HeaderLabel style={{ marginTop: '0px' }}>
          Enter Your Offer
        </HeaderLabel>
        <Form onSubmit={(event) => event.preventDefault()}>
          <OfferGroup>
            <Offer
              type="text"
              name="identifier"
              id="identifier"
              required
              value={formatNumber(offer)}
              onChange={handleInputChange}
              maxLength="10"
            />
          </OfferGroup>
          <MakeOfferButton onClick={handleMakeOffer}>
            Make Offer
          </MakeOfferButton>
          <MakeOfferButton type="button" onClick={handleGoBack} style={{marginTop: "-10px"}}>
            Return to Listing
          </MakeOfferButton>
        </Form>
      </Container>
    </>
  );
>>>>>>> zaharia_branch
}

MakeOfferPage.propTypes = {
	onClose: () => {}
};

export default MakeOfferPage;
