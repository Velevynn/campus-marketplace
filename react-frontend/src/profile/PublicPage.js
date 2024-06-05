// PublicPage.js (Joshua Estrada)
// Displays the public profile data of a given user
import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import WhitePfp from "../assets/white-placeholder.png";
import DefaultPfp from "../assets/profile-placeholder.png";
import ListingCollection from "./ListingCollection";
import LoadingSpinner from "../components/LoadingSpinner";
import ShareButton from "../components/ShareButton";
import ArrowButton from "../components/ArrowButton";
import Footer from "../components/Footer";
import axios from "axios";
import "./profile.css";

function PublicPage() {
	const [userProfile, setUserProfile] = useState({
		username: "",
		fullName: "",
		bio: "",
		city: ""
	});

	const navigate = useNavigate();
	const [profileImage, setProfileImage] = useState(WhitePfp);
	const [isLoading, setIsLoading] = useState(true); // Loading State
	const [listings, setMyListings] = useState([]); // myListings State
	const timestamp = Date.now(); // for removing image caching
	const {userID} = useParams(); // get userID from the URL params

	// fetches user profile data from the backend server
	const fetchUserProfile = async userID => {
		try {
			const response = await axios.get(
				process.env.REACT_APP_BACKEND_LINK +
					`/users/public-profile/${userID}`
			);
			setUserProfile(response.data);
		} catch (error) {
			console.error("Error encountered: ", error);
		}
	};

	// fetches the user's profile picture link from the backend
	const fetchProfilePicture = async userID => {
		try {
			const response = await axios.get(
				process.env.REACT_APP_BACKEND_LINK +
					`/users/is-profile-picture/${userID}`
			);
			setProfileImage(
				response.data.isProfilePicture
					? `https://haggleimgs.s3.amazonaws.com/user/${userID}/bruh0.jpg?${timestamp}`
					: DefaultPfp
			);
		} catch (error) {
			console.error("Error encountered: ", error);
		}
	};

	// fetches the listings owned by the user from the backend
	const fetchCollections = async userID => {
		try {
			const response = await axios.get(
				process.env.REACT_APP_BACKEND_LINK +
					`/listings/mylistings/${userID}`
			);
			setMyListings(response.data);
		} catch (error) {
			console.error("Failed to fetch myListings", error);
		} finally {
			setIsLoading(false); // set loading state to false once all data is retrieved
		}
	};

	useEffect(() => {
		fetchCollections(userID);
		fetchUserProfile(userID);
		fetchProfilePicture(userID);
	}, []); // fetch all relevant public user data

	return (
		<div>
			{isLoading ? (
				<div>
					<LoadingSpinner />
				</div>
			) : (
				<div>
					<div className="vertical-center">
						<div className="profile-page-layout margin padding-top">
							<div className="small-container drop-shadow">
								<div className="full-container">
									<div
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											position: "relative",
											marginBottom: "15px"
										}}
									>
										<div
											onClick={() => {
												navigate(-1);
											}}
											style={{
												rotate: "-90deg",
												position: "absolute",
												left: -30
											}}
										>
											<ArrowButton />
										</div>
										<h3 style={{margin: "0 auto"}}>
											{userProfile.fullName}
										</h3>
									</div>
									<img
										src={profileImage}
										alt="Profile"
										className="profile-picture"
									></img>
									<a
										href={`https://www.google.com/maps/place/${userProfile.city},+CA+93422`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<h5 className="text-link">
											{" "}
											{/*Allows viewer to click on location and see it on Google Maps*/}
											{userProfile.city && (
												<div>
													{userProfile.city}, CA
												</div>
											)}
										</h5>
									</a>
									{userProfile.bio.length > 0 ? (
										<p className="user-bio">
											{userProfile.bio}
										</p>
									) : (
										<p>No bio provided.</p>
									)}
								</div>{" "}
								{/*If the user did not set a bio, it will default to "No bio provided." */}
								<ListingCollection
									title="Listings"
									bookmarks={listings}
									userID={userProfile.userID}
									time={timestamp}
									custom={false}
								/>
								<div className="full-container">
									<ShareButton
										link={`${process.env.REACT_APP_FRONTEND_LINK} + "/profile/" + ${userID}`}
										type="Profile"
									/>
								</div>
							</div>
						</div>
					</div>
					<Footer />
				</div>
			)}
		</div>
	);
}

export default PublicPage;
