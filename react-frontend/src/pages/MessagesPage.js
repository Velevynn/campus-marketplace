import React, { useEffect, useRef } from "react";
import Talk from "talkjs";
import PropTypes from "prop-types";


function MessagesPage({ appId, currentUser }) {
    const inboxContainerRef = useRef();

    useEffect(() => {
        if (!Talk.ready) return;

        Talk.ready.then(() => {
            const me = new Talk.User(currentUser);

            const session = new Talk.Session({
                appId: process.env.REACT_APP_TALKJS_APP_ID,
                me: me
            });

            const inbox = session.createInbox();
            inbox.mount(inboxContainerRef.current);
        });

        return () => {
            if (inboxContainerRef.current) {
                inboxContainerRef.current.innerHTML = "";
            }
        };
    }, [appId, currentUser]);

    return (
        <div className="inbox-container">
            <div className="header">Messages</div>
            <div ref={inboxContainerRef} className="body"></div>
        </div>
    );
}

MessagesPage.propTypes = {
    appId: PropTypes.string.isRequired,
    currentUser: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string,
        photoUrl: PropTypes.string,
        welcomeMessage: PropTypes.string
    }).isRequired
};

export default MessagesPage;