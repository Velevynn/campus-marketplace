import React, {useEffect, useRef} from "react";
import Talk from "talkjs";
import PropTypes from "prop-types";
import "./Chat.css";

function ChatComponent({appId, user, otherUser}) {
	const chatContainerRef = useRef();
	useEffect(() => {
		if (!Talk.ready) return;

		Talk.ready.then(() => {
			const me = new Talk.User(user);
			const other = new Talk.User(otherUser);

			const session = new Talk.Session({
				appId: appId,
				me: me
			});

			const conversationId = Talk.oneOnOneId(me, other);
			const conversation =
				session.getOrCreateConversation(conversationId);

			conversation.setParticipant(me);
			conversation.setParticipant(other);

			const chatbox = session.createChatbox();
			chatbox.select(conversation);
			chatbox.mount(chatContainerRef.current);
		});

		return () => {
			if (chatContainerRef.current) {
				chatContainerRef.current.innerHTML = "";
			}
		};
	}, [appId, user, otherUser]);

	return (
		<div className="chat-container">
			<div ref={chatContainerRef} className="body"></div>
		</div>
	);
}

ChatComponent.propTypes = {
	appId: PropTypes.string.isRequired,
	user: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		email: PropTypes.string,
		photoUrl: PropTypes.string,
		welcomeMessage: PropTypes.string
	}).isRequired,
	otherUser: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		email: PropTypes.string,
		photoUrl: PropTypes.string,
		welcomeMessage: PropTypes.string
	}).isRequired
};

export default ChatComponent;
