import React, {useState, useEffect} from "react";
import {
	Container2,
	Form,
	OfferGroup,
	Offer,
	HeaderLabel,
	MakeOfferButton
} from "../authentication/AuthenticationStyling.js";
import PropTypes from "prop-types";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

function MakeOfferPage(props) {
	console.log("setup");
	const [offer, setOffer] = useState("0");
	const [buyer, setBuyer] = useState(null);
	const navigate = useNavigate();
	const {listingID} = useParams();

	useEffect(() => {
		console.log("use effect");
		const fetchUserProfile = async () => {
			const token = localStorage.getItem(
				process.env.REACT_APP_JWT_TOKEN_NAME
			);
			if (!token) {
				navigate("/login");
				return;
			}
			console.log("start call 1");
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_BACKEND_LINK}/users/profile`,
					{
						headers: {Authorization: `Bearer ${token}`}
					}
				);
				setBuyer(response.data);
			} catch (error) {
				console.error("Failed to fetch user data:", error);
				navigate("/login");
			}
			console.log("end call 1");
		};

		fetchUserProfile();
	}, [navigate]);

	const handleMakeOffer = async () => {
		console.log("start handleMakeOffer");
		if (!buyer) {
			console.error("Buyer information is not available.");
			return;
		}
		console.log("get token");
		const token = localStorage.getItem(
			process.env.REACT_APP_JWT_TOKEN_NAME
		);

		try {
			console.log("listingResponse");
			const listingResponse = await axios.get(
				process.env.REACT_APP_BACKEND_LINK + `/listings/${listingID}`,
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			const listing = listingResponse.data;
			console.log(listing);

			console.log("sellerResponse: ", listing[0].userID);
			console.log(
				process.env.REACT_APP_BACKEND_LINK +
					`/users/${listing[0].userID}`
			);
			const sellerResponse = await axios.get(
				process.env.REACT_APP_BACKEND_LINK +
					`/users/${listing[0].userID}`,
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			const seller = sellerResponse.data;
			console.log(seller);

			try {
				await axios.post(
					`${process.env.REACT_APP_BACKEND_LINK}/conversations/create`,
					{
						userID: buyer.userID,
						otherID: listing[0].userID,
						listingID: props.listingID,
						offer: offer
					}
				);

				navigate("/chat", {state: {listing, seller, buyer, offer}});
			} catch (error) {
				console.error("Error adding conversation:", error);
			}

			navigate("/chat", {state: {listing, seller, buyer, offer}});
		} catch (error) {
			console.error("Error making offer:", error);
		}
	};

	const handleInputChange = event => {
		const {value} = event.target;
		const numbers = value.replace(/[^0-9]/g, "");
		setOffer(numbers);
	};

	const formatNumber = number => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(number);
	};

	return (
		<>
			<Container2>
				<HeaderLabel style={{marginTop: "0px"}}>
					Enter Your Offer
				</HeaderLabel>
				<Form onSubmit={event => event.preventDefault()}>
					<OfferGroup>
						<Offer
							type="text"
							name="identifier"
							id="identifier"
							required
							value={formatNumber(offer)}
							onChange={handleInputChange}
							maxLength="10"
						/>
					</OfferGroup>
					<MakeOfferButton onClick={handleMakeOffer}>
						Make Offer
					</MakeOfferButton>
					<MakeOfferButton
						type="button"
						onClick={props.onClose}
						style={{marginTop: "-10px"}}
					>
						Return to Listing
					</MakeOfferButton>
				</Form>
			</Container2>
		</>
	);
}

MakeOfferPage.propTypes = {
	listingID: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired
};

export default MakeOfferPage;
