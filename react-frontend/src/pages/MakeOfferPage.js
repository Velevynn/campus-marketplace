import React, { useState } from 'react';
import { Container, Form, OfferGroup, Offer, HeaderLabel, MakeOfferButton } from '../authentication/AuthenticationStyling';
import { useNavigate, useParams } from 'react-router-dom';

function MakeOfferPage() {
  const [offer, setOffer] = useState("0.00");  // Initial state for the offer input
  const navigate = useNavigate();
  const { listingID } = useParams();

  const handleInputChange = (event) => {
    const { value } = event.target;
    const numbers = value.replace(/[^0-9]/g, ''); // Strip non-numeric characters
    let newNumber = parseInt(numbers, 10) / 100; // Convert to number and shift decimal place
    setOffer(newNumber.toFixed(2)); // Format to 2 decimal places and update state
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
  };

  const handleGoBack = () => {
    navigate(`/listings/${listingID}`); 
  };

  return (
    <>
      <Container>
        <HeaderLabel style={{ marginTop: '0px'}}>
          Enter Your Offer
        </HeaderLabel>
        <Form>
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
          <MakeOfferButton>
            Make Offer
          </MakeOfferButton>
          <MakeOfferButton onClick={handleGoBack} style = {{marginTop: "-10px"}}>
            Return to Listing
          </MakeOfferButton>
        </Form>
      </Container>
    </>
  );
}

export default MakeOfferPage;