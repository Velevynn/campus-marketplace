import React, { useEffect, useRef, useState } from "react";
import Talk from "talkjs";
import axios from "axios";

function MessagesPage() {
    const [userProfile, setUserProfile] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem(process.env.REACT_APP_JWT_TOKEN_NAME);
            if (!token) {
                console.error("No authentication token found. Redirect to login.");
                // Add redirection to login here if you're handling routing
                return;
            }

            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_LINK}/users/profile`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setUserProfile(response.data);
                initializeTalkJS(response.data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                // Handle error or redirect
            }
        };

        fetchUserProfile();
    }, []);

    const initializeTalkJS = (user) => {
        if (!user || !Talk.ready) return;

        const currentUser = {
            id: user.userID,
            name: user.full_name || "No name provided",
            email: user.email,
            role: "default",
            photoUrl: "URL to profile picture", // Add the actual URL to the user's profile picture here.
            welcomeMessage: "Welcome to the chat!"
        };
        console.log(process.env.REACT_APP_TALKJS_APP_ID);

        Talk.ready.then(() => {
            const me = new Talk.User(currentUser);
            const session = new Talk.Session({
                appId: process.env.REACT_APP_TALKJS_APP_ID,
                me: me
            });

            const inbox = session.createInbox();
            inbox.mount(containerRef.current);
        });
    };

    useEffect(() => {
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="chat-inbox-container" style={{ height: "500px" }}>
            {userProfile ? "Loading your messages..." : "Loading user profile..."}
        </div>
    );
}

export default MessagesPage;