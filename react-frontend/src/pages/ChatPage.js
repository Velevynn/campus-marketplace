// ChatPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';

function ChatPage() {
    const { state } = useLocation(); // Using location state to receive listing, seller, and buyer data
    const listing = state.listing || [];
    const seller = state.seller || [];
    const buyer = state.buyer || {};
    const offer = state.offer || {};

    console.log({ listing, seller, buyer, offer });

    return (
        <>
            <div>
                <h1>Chat for {listing[0].title}</h1>
                <p>Selling by: {seller[0].fullName}</p>
                <p>Offer: {offer}</p>
                <p>Contacting: {buyer.fullName}</p>
            </div>
        </>
    );
}

export default ChatPage;