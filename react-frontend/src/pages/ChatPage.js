import React from 'react';
import { useLocation } from 'react-router-dom';

function ChatPage() {
    const { state } = useLocation();  // Using location state to receive listing, seller, and buyer data
    const { listing, seller, buyer } = state;

    return (
        <div>
            <h1>Chat for {listing.title}</h1>
            <p>Selling by: {seller.name}</p>
            <p>Contacting: {buyer.name}</p>
            <div id="talkjs-container" style={{ height: "400px", width: "600px" }}></div>  // Container for the chat
        </div>
    );
}

export default ChatPage;