// ChatPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Chat from '../components/Chat.js';

function ChatPage() {
    const { state } = useLocation(); // Using location state to receive listing, seller, and buyer data
    const listing = state.listing || [];
    const seller = state.seller || [];
    const buyer = state.buyer || {};

    return (
        <>
            <div>
                <h1>Chat for {listing[0].title}</h1>
                <p>Selling by: {seller[0].fullName}</p>
                <p>Contacting: {buyer.fullName}</p>
            </div>
            <Chat/>
        </>
    );
}

export default ChatPage;