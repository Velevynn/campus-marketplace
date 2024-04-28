import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MakeOfferPage() {
    const { listingID } = useParams();
    const navigate = useNavigate();
    const [offer, setOffer] = useState('');
    const [comment, setComment] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleOfferChange = (e) => {
        setOffer(e.target.value);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`https://haggle.onrender.com/listings/${listingID}/offer`, {
                offer,
                comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/listings/${listingID}`);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Failed to submit the offer. Please try again.');
            }
        }
    };

    return (
        <div className="offer-container">
            <h2>Make an Offer</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="offer">Your Offer ($):</label>
                    <input type="number" id="offer" value={offer} onChange={handleOfferChange} required />
                </div>
                <div>
                    <label htmlFor="comment">Comment (optional):</label>
                    <textarea id="comment" value={comment} onChange={handleCommentChange}></textarea>
                </div>
                <button type="submit">Submit Offer</button>
            </form>
        </div>
    );
}

export default MakeOfferPage;