import React, { useState, useEffect } from 'react';
import { Container, Form, OfferGroup, Offer, HeaderLabel, MakeOfferButton } from '../authentication/AuthenticationStyling';
import { useNavigate, useParams } from 'react-router-dom';
import Talk from 'talkjs';
import axios from 'axios';

const TALKJS_APP_ID = 'tEOH06eA';

function MakeOfferPage() {
  const [offer, setOffer] = useState("0");
  const [buyer, setBuyer] = useState(null);
  const navigate = useNavigate();
  const { listingID } = useParams();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setBuyer(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleMakeOffer = async () => {
    if (!buyer) {
      console.error("Buyer information is not available.");
      return;
    }

    try {
      const { data: listing } = await axios.get(`/api/listings/${listingID}`);
      const { data: seller } = await axios.get(`/api/users/${listing.userId}`);
  
      Talk.ready.then(() => {
        const me = new Talk.User({
          id: buyer.userId.toString(),
          name: buyer.name,
          email: buyer.email,
          photoUrl: buyer.photoUrl,
          welcomeMessage: "Hi, I would like to make an offer!"
        });
  
        const other = new Talk.User({
          id: seller.userId.toString(),
          name: seller.name,
          email: seller.email,
          photoUrl: seller.photoUrl,
          welcomeMessage: "Hello, are you interested in my listing?"
        });
  
        const session = new Talk.Session({
          appId: TALKJS_APP_ID,
          me: me
        });
  
        const conversationId = Talk.oneOnOneId(me, other);
        const conversation = session.getOrCreateConversation(conversationId);
        conversation.setParticipant(me);
        conversation.setParticipant(other);
        conversation.setAttributes({
          subject: `Offer for ${listing.title}`
        });
  
        const chatbox = session.createChatbox(conversation);
        chatbox.mount(document.getElementById("talkjs-container"));
  
        navigate(`/chat/${conversationId}`);
      });
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
}

export default MakeOfferPage;