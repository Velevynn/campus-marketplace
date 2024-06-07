import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

function MessagesPage() {
	const [conversations, setConversations] = useState([]);
	const [user, setUser] = useState(null); // State to store user profile
	const time = Date.now();
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

	const handleConversationClick = async conversation => {
		try {
			const token = localStorage.getItem(
				process.env.REACT_APP_JWT_TOKEN_NAME
			);
			if (!token) {
				navigate("/login");
				return;
			}

			const headers = {Authorization: `Bearer ${token}`};
			const decodedToken = jwtDecode(token);

			const response = await axios.get(
				process.env.REACT_APP_BACKEND_LINK + "/users/userID",
				{
					params: {
						username: decodedToken.username
					}
				},
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			let myID = null;
			let otherID = null;
			if (response.data.userID === conversation.userID) {
				myID = conversation.userID;
				otherID = conversation.otherID;
			} else {
				myID = conversation.otherID;
				otherID = conversation.userID;
			}

			const userResponse = await axios.get(
				`${process.env.REACT_APP_BACKEND_LINK}/users/${myID}`,
				{headers}
			);

			const otherResponse = await axios.get(
				`${process.env.REACT_APP_BACKEND_LINK}/users/${otherID}`,
				{headers}
			);

			const dummyListing = {title: "Dummy Listing"}; // Dummy listing object
			const dummySeller = {
				fullName: otherResponse.data[0].fullName,
				userID: conversation.otherID,
				email: otherResponse.data[0].email,
				photoUrl: `https://haggleimgs.s3.amazonaws.com/user/${conversation.otherID}/bruh0.jpg?${time}`
			}; // Dummy seller object
			const dummyBuyer = {
				fullName: userResponse.data[0].fullName,
				userID: conversation.userID,
				email: userResponse.data[0].email,
				photoUrl: `https://haggleimgs.s3.amazonaws.com/user/${conversation.userID}/bruh0.jpg?${time}`
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
		} catch (error) {
			console.error("error");
		}
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
								<button
									key={index}
									onClick={() =>
										handleConversationClick(conv)
									}
								>
									Conversation with IDs {conv.userID} and{" "}
									{conv.otherID}
								</button>
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
