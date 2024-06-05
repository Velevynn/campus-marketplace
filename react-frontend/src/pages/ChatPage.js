// ChatPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import ChatComponent from '../components/Chat.js';

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
                <h1>Chat for {listing[0]?.title}</h1>
                <p>Selling by: {seller[0]?.fullName}</p>
                <p>Contacting: {buyer?.fullName}</p>
            </div>
            <ChatComponent 
                appId="tEOH06eA"  // Use your actual TalkJS App ID
                user={{
                    id: buyer?.id || 'default_buyer',
                    name: buyer?.fullName,
                    email: buyer?.email,
                    photoUrl: buyer?.photoUrl,
                    welcomeMessage: "Hi there, interested in making an offer?"
                }}
                otherUser={{
                    id: seller[0]?.id || 'default_seller',
                    name: seller[0]?.fullName,
                    email: seller[0]?.email,
                    photoUrl: seller[0]?.photoUrl,
                    welcomeMessage: "Hello! Feel free to ask any questions you might have."
                }}
            />
        </>
    );
}

export default ChatPage;