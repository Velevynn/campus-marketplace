import React, { useCallback, useEffect, useRef, useState } from "react";
import { Inbox, Session } from "@talkjs/react";
import axios from "axios";
import Talk from "talkjs";

function MessagesPage() {
    const [session, setSession] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const inboxRef = useRef(null);
    
    useEffect(() => {
        console.log("Fetching user profile...");
        const fetchUserProfile = async () => {
            const token = localStorage.getItem(process.env.REACT_APP_JWT_TOKEN_NAME);
            if (!token) {
                console.error("No authentication token found. Redirect to login.");
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
                console.log("User Profile Data fetched:", response.data); 
                setUserProfile(response.data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        console.log("Checking if TalkJS is ready and userProfile is available...");
        if (userProfile && Talk.ready) {
            Talk.ready.then(() => {
                console.log("TalkJS is ready and userProfile is available:", userProfile);
                if (!userProfile.userID) {
                    console.error("Invalid or missing userID in userProfile.");
                    return;
                }


                const me = new Talk.User({
                    id: userProfile.userID,
                    name: userProfile.fullName || "Anonymous",
                    email: userProfile.email,
                    photoUrl: userProfile.photoUrl || "https://talkjs.com/docs/img/alice.jpg",
                    role: "default",
                    welcomeMessage: "Hey there! How can I help?"
                });

                const talkSession = new Talk.Session({
                    appId: process.env.REACT_APP_TALKJS_APP_ID,
                    me: me
                });

                setSession(talkSession);
                console.log("TalkJS session initialized:", talkSession);
            });
        }
    }, [userProfile]); 

    const syncConversation = useCallback(session => {
        if (!session || !userProfile) {
            console.error("Session or userProfile is not ready or incomplete.");
            return;
        }
    
        const conversation = session.getOrCreateConversation(Talk.oneOnOneId(session.me, userProfile.userID));
        conversation.setParticipant(session.me);
        conversation.setParticipant(new Talk.User({
            id: userProfile.userID,
            name: userProfile.fullName,
            email: userProfile.email,
            role: "default"
        }));
        return conversation;
    }, [userProfile]);

    return (
        <div>
            {session ? (
                <Session session={session}>
                    <Inbox
                        syncConversation={syncConversation}
                        asGuest={false}
                        className="chat-container"
                        inboxRef={inboxRef}
                        highlightedWords={["urgent", "important"]}
                        loadingComponent={<div>Loading...</div>}
                        style={{ width: "400px", height: "600px" }}
                        onSendMessage={event => console.log("Message sent:", event.message.text)}
                        onCustomMessageAction={event => console.log("Custom action:", event.action)}
                        feedFilter={{ custom: { state: ["!=", "hidden"] } }}
                        showMobileBackButton={false}
                        messageField={{ placeholder: "Write a message..." }}
                    />
                </Session>
            ) : (
                <div>Loading TalkJS...</div>
            )}
        </div>
    );
}

export default MessagesPage;