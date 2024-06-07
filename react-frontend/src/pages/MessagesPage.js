import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

function MessagesPage() {
	const [conversations, setConversations] = useState([]);
	const [user, setUser] = useState(null); // State to store user profile
	const [otherUsers, setOtherUsers] = useState({});
	const time = Date.now();
	const navigate = useNavigate();

	let seller = null;
	let buyer = null;

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

	useEffect(() => {
		const fetchOtherUsersInfo = async () => {
			const token = localStorage.getItem(
				process.env.REACT_APP_JWT_TOKEN_NAME
			);
			if (!token) {
				return;
			}

			const headers = {Authorization: `Bearer ${token}`};

			// Iterate through conversations and fetch other users' info
			await Promise.all(
				conversations.map(async conversation => {
					if (!otherUsers[conversation.otherID]) {
						try {
							const response = await axios.get(
								`${process.env.REACT_APP_BACKEND_LINK}/users/${conversation.otherID}`,
								{headers}
							);
							setOtherUsers(prevState => ({
								...prevState,
								[conversation.otherID]: response.data
							}));
						} catch (error) {
							console.error(
								"Failed to get other user data:",
								error
							);
						}
					}
				})
			);
		};
		console.log(otherUsers);
		fetchOtherUsersInfo();
	}, [conversations, otherUsers]);

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

			const userResponse = await axios.get(
				`${process.env.REACT_APP_BACKEND_LINK}/users/${conversation.userID}`,
				{headers}
			);

			const otherResponse = await axios.get(
				`${process.env.REACT_APP_BACKEND_LINK}/users/${conversation.otherID}`,
				{headers}
			);

			const dummySeller = {
				fullName: otherResponse.data[0].fullName,
				username: otherResponse.data[0].username,
				userID: conversation.otherID,
				email: otherResponse.data[0].email,
				photoUrl: `https://haggleimgs.s3.amazonaws.com/user/${conversation.otherID}/bruh0.jpg?${time}`
			}; // Dummy seller object
			const dummyBuyer = {
				fullName: userResponse.data[0].fullName,
				username: userResponse.data[0].username,
				userID: conversation.userID,
				email: userResponse.data[0].email,
				photoUrl: `https://haggleimgs.s3.amazonaws.com/user/${conversation.userID}/bruh0.jpg?${time}`
			}; // Dummy buyer object

			if (response.data.userID === conversation.userID) {
				seller = dummySeller;
				buyer = dummyBuyer;
			} else {
				seller = dummyBuyer;
				buyer = dummySeller;
			}

			const listingResponse = await axios.get(
				process.env.REACT_APP_BACKEND_LINK +
					`/listings/${conversation.listingID}`
			);

			navigate("/chat", {
				state: {
					listing: [listingResponse.data[0]],
					seller: [seller],
					buyer: buyer,
					offer: conversation.offer
				}
			});
		} catch (error) {
			console.error("error");
		}
	};

	return (
		<>
			<div className="vertical-center margin" style={{marginTop: "20px"}}>
				<div className="small-container drop-shadow text-center">
					<h2>{user?.fullName}&rsquo;s Conversations:</h2>
					<div className="small-container drop-shadow">
						{conversations.length > 0 ? (
							<ul style={{listStyle: "none", padding: 0}}>
								{conversations.map((conv, index) => (
									<li
										key={index}
										style={{marginBottom: "10px"}}
									>
										<button
											onClick={() =>
												handleConversationClick(conv)
											}
											style={{
												display: "block",
												width: "100%",
												padding: "10px 20px",
												marginBottom: "10px",
												border: "2px solid #333",
												borderRadius: "5px",
												backgroundColor: "#fff",
												color: "#333",
												fontSize: "16px",
												textAlign: "center",
												cursor: "pointer",
												textDecoration: "none",
												transition:
													"background-color 0.3s, color 0.3s, border-color 0.3s"
											}}
											onMouseEnter={e => {
												e.target.style.backgroundColor =
													"#333";
												e.target.style.color = "#fff";
												e.target.style.borderColor =
													"#333";
											}}
											onMouseLeave={e => {
												e.target.style.backgroundColor =
													"#fff";
												e.target.style.color = "#333";
												e.target.style.borderColor =
													"#333";
											}}
										>
											Conversation with{" "}
											{
												otherUsers[conv.otherID]?.[0]
													?.username
											}
										</button>
									</li>
								))}
							</ul>
						) : (
							<p>No conversations found.</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default MessagesPage;
