// ChatPage.js
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useLocation} from "react-router-dom";
import ChatComponent from "../components/Chat.js";
import missing from "../assets/missing.jpg";

function ChatPage() {
	//const isLoading = false;
	const {state} = useLocation(); // Using location state to receive listing, seller, and buyer data
	const [imageSource, setImageSource] = useState(missing);

	useEffect(() => {
		const fetchImages = async () => {
			try {
				if (state === null || !state.listing || !state.listing[0])
					return;
				const response = await axios.get(
					process.env.REACT_APP_BACKEND_LINK +
						`/listings/images/${state.listing[0].listingID}`
				);
				if (response.data.length > 0) {
					setImageSource(
						`https://haggleimgs.s3.amazonaws.com/${state.listing[0].listingID}/image0`
					);
				}
			} catch (error) {
				console.error("Error fetching images:", error);
			}
		};
		fetchImages();
	}, [state]);

	if (state === null) {
		window.location.href = "/not-found";
		return <></>;
	}

	const listing = state.listing || [];
	const seller = state.seller || [];
	const buyer = state.buyer || {};
	const offer = state.offer || {};

	console.log({listing, seller, buyer, offer});
	console.log(listing[0]);

	return (
		<>
			{state !== null && (
				<div
					className="vertical-center margin"
					style={{marginTop: "35px"}}
				>
					<div className="small-container" style={{ backgroundColor: "rgba(0, 0, 0, 0.04)", paddingTop:"60px", marginTop:"-40px"}}>
						<img src={imageSource} alt="Listing" />
						<h1>{listing[0]?.title}</h1>
						<a href={`/profile/${seller[0].userID}`}>
							<h5>{seller[0]?.fullName}</h5>
						</a>
						<p>Offer: ${offer}</p>
					</div>
					<ChatComponent
						appId={process.env.REACT_APP_TALKJS_APP_ID} // Use your actual TalkJS App ID
						user={{
							id: buyer?.userID || "default_buyer",
							name: buyer?.fullName,
							email: buyer?.email,
							photoUrl: buyer?.photoUrl,
							welcomeMessage:
								"Hi there, interested in making an offer?"
						}}
						otherUser={{
							id: seller[0]?.userID || "default_seller",
							name: seller[0]?.fullName,
							email: seller[0]?.email,
							photoUrl: seller[0]?.photoUrl,
							welcomeMessage:
								"Hello! Feel free to ask any questions you might have."
						}}
					/>
				</div>
			)}
		</>
	);
}

export default ChatPage;
