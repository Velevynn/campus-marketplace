import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function MessagesPage() {
	const [conversations, setConversations] = useState([]);
	const [user, setUser] = useState(null); // State to store user profile
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserProfileAndConversations = async () => {
			const token = localStorage.getItem(
				process.env.REACT_APP_JWT_TOKEN_NAME
			);
			if (!token) {
				navigate("/login");
				return;
			}

			const headers = {Authorization: `Bearer ${token}`};
			let userProfileResponse = null;
			try {
				userProfileResponse = await axios.get(
					`${process.env.REACT_APP_BACKEND_LINK}/users/profile`,
					{headers}
				);
				setUser(userProfileResponse.data);
				console.log(userProfileResponse.data);
			} catch (error) {
				console.error("Failed to get user data:", error);
				navigate("/login");
			}

			try {
				const conversationsResponse = await axios.get(
					`${process.env.REACT_APP_BACKEND_LINK}/conversations/${userProfileResponse.data.userID}`,
					{headers}
				);
				setConversations(conversationsResponse.data);
				console.log(conversationsResponse.data);
			} catch (error) {
				console.error("Failed to get conversations:", error);
			}
		};

		fetchUserProfileAndConversations();
	}, [navigate]);

	const handleConversationClick = conversation => {
		// ADD GET CALLS

		// CALL FOR SELLER (OTHER ID)
		// RETRIEVE FULLNAME, EMAIL, PHOTOURL
		//

		// CALL FOR BUYER (USER ID)
		// RETRIEVE FULLNAME, EMAIL, PHOTOURL
		//

		const dummyListing = {title: "Dummy Listing"}; // Dummy listing object
		const dummySeller = {
			fullName: "Dummy Seller",
			userID: conversation.otherID,
			email: "seller@example.com",
			photoUrl: "seller-photo-url"
		}; // Dummy seller object
		const dummyBuyer = {
			fullName: "Dummy Buyer",
			userID: conversation.userID,
			email: "buyer@example.com",
			photoUrl: "buyer-photo-url"
		}; // Dummy buyer object
		const dummyOffer = "Dummy Offer"; // Dummy offer

		navigate("/chat", {
			state: {
				listing: [dummyListing],
				seller: [dummySeller],
				buyer: dummyBuyer,
				offer: dummyOffer
			}
		});
	};

	return (
		<>
			<div>
				<h1>User: {user?.fullName}</h1>
				<div>
					<h2>Conversations:</h2>
					{conversations.length > 0 ? (
						<ul>
							{conversations.map((conv, index) => (
								<li
									key={index}
									onClick={() =>
										handleConversationClick(conv)
									}
								>
									Conversation with IDs {conv.userID} and{" "}
									{conv.otherID}
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
