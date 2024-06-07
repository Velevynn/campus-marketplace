import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MessagesPage() {
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();

    let user = null;

    useEffect(() => {
        const fetchUserProfileAndConversations = async () => {
            const token = localStorage.getItem(process.env.REACT_APP_JWT_TOKEN_NAME);
            if (!token) {
                navigate("/login");
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            try {
                const userProfileResponse = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/users/profile`, { headers });
                user = userProfileResponse.data;
                console.log(userProfileResponse.data);
            } catch (error) {
                console.error("Failed to get user data:", error);
                navigate("/login");
            }

                            
            try {
                const conversationsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/conversations/${user.userID}`, { headers });
                setConversations(conversationsResponse.data);
                console.log(conversationsResponse.data);
            } catch (error) {
                console.error("Failed to get conversations:", error);
            }
        };

        fetchUserProfileAndConversations();
    }, [navigate]);

    return (
        <>
            <div>
                <h1>User: {user?.fullName}</h1>
                <div>
                    <h2>Conversations:</h2>
                    {conversations.length > 0 ? (
                        <ul>
                            {conversations.map((conv, index) => (
                                <li key={index}>
                                    Conversation with IDs {conv.userID} and {conv.otherID}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No conversations found.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default MessagesPage;