// ProfilePage.js (Alex Zaharia, Joshua Estrada)
// Displays user credentials and dashboard
// Features: SignOut, ChangePassword, MyBookmarks, MyListings, UserBio, SetLocation
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import BookmarksCollection from "./BookmarksCollection";
import ProfileDetails from "./ProfileDetails";
import Footer from "../components/Footer";
import ListingCollection from "./ListingCollection";
import ChangeProfilePicture from "./ChangeProfilePicture";
import axios from "axios";
import "./profile.css";

function ProfilePage() {
	const [userProfile, setUserProfile] = useState({
		username: "",
		full_name: "",
		email: "",
		phoneNumber: "",
		userID: ""
	});
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [deleteConfirmationData, setDeleteConfirmationData] = useState({
		username: "",
		password: ""
	});

	const navigate = useNavigate(); // Define navigate for routing
	const [bookmarks, setBookmarks] = useState([]); // myBookmarks State
	const [listings, setMyListings] = useState([]); // myListings State
	const [isLoading, setIsLoading] = useState(true); // Loading state
	const [deleteError, setDeleteError] = useState("");
	const timestamp = Date.now();

	useEffect(() => {
		fetchUserProfile();
	}, []);

	// fetch personal user profile data & credentials
	const fetchUserProfile = async () => {
		const token = localStorage.getItem(
			process.env.REACT_APP_JWT_TOKEN_NAME
		);
		if (!token) {
			navigate("/login");
			return;
		}

		try {
			const response = await axios.get(
				process.env.REACT_APP_BACKEND_LINK + "/users/profile",
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			setUserProfile(response.data);
			fetchCollections(response.data.userID);
		} catch (error) {
			console.error("Failed to fetch profile data:", error);
			navigate("/login");
		}
	};

	// fetch listings and bookmarks owned by the user
	const fetchCollections = async userID => {
		try {
			const response = await axios.get(
				process.env.REACT_APP_BACKEND_LINK +
					`/listings/bookmark/${userID}`
			);
			setBookmarks(response.data);
		} catch (error) {
			console.error("Failed to fetch bookmarks", error);
		}
		try {
			const response = await axios.get(
				process.env.REACT_APP_BACKEND_LINK +
					`/listings/mylistings/${userID}`
			);
			setMyListings(response.data);
		} catch (error) {
			console.error("Failed to fetch myListings", error);
		}
		setIsLoading(false);
	};

	const handleChangePassword = () => {
		navigate("/change-password");
	}; // navigation lambda

	const handleSignOut = () => {
		localStorage.removeItem(process.env.REACT_APP_JWT_TOKEN_NAME);
		navigate("/login");
	}; // sign out is triggered by removing user JWT JSON Web Token

	const formatPhoneNumber = phoneNumber => {
		const cleaned = ("" + phoneNumber).replace(/\D/g, "");
		const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			return "(" + match[1] + ") " + match[2] + "-" + match[3];
		}
		return phoneNumber;
	}; // phone number formatting lambda

	// deletion is facilitated by JSON WebToken and the user confirming their username and password
	const handleDeleteConfirmation = async () => {
		const token = localStorage.getItem(
			process.env.REACT_APP_JWT_TOKEN_NAME
		);
		if (!token) {
			navigate("/login");
			return;
		} // if there is no such token return to login page

		try {
			const response = await axios.delete(
				process.env.REACT_APP_BACKEND_LINK + "/users/delete",
				{
					headers: {
						Authorization: `Bearer ${token}`
					}, // user's JWT Token for validation (other users cannot delete other people's accounts)
					data: {
						username: deleteConfirmationData.username,
						password: deleteConfirmationData.password
					} // user given username & password for validation  (confirmation)
				}
			);

			if (response.status === 200) {
				// after successful deletion, redirect to login
				localStorage.removeItem(process.env.REACT_APP_JWT_TOKEN_NAME);
				navigate("/login");
			}
		} catch (error) {
			console.error("Failed to delete profile:", error.response);
			if (
				error.response &&
				error.response.data &&
				error.response.data.error
			) {
				setDeleteError(error.response.data.error);
			} else {
				setDeleteError("An error occurred while deleting the profile.");
			} // either the result of an invalid password/username or JWT Token
		}
	};

	const confirmDelete = () => {
		setShowDeleteConfirmation(true);
	}; // enable useState for showDeleteConfirmation to reveal delete form

	const handleCancelDelete = () => {
		setShowDeleteConfirmation(false);
		setDeleteError("");
	}; // disable useState for showDeleteConfirmation to hide delete form

	const handleDelete = e => {
		e.preventDefault();
		handleDeleteConfirmation(); // trigger deletion after confirmation
	};

	const handleInputChange = e => {
		const {name, value} = e.target;
		setDeleteConfirmationData({...deleteConfirmationData, [name]: value});
	};

	return (
		<div>
			{isLoading ? (
				<div className="margin">
					<LoadingSpinner />
				</div>
			) : (
				<div>
					<div className="vertical-center profile-page-layout margin padding-top">
						<div className="small-container drop-shadow">
							<ChangeProfilePicture
								userID={userProfile.userID}
								time={timestamp}
							/>
							<form>
								{Object.entries(userProfile).map(
									([key, value]) =>
										key !== "userID" && (
											<div key={key}>
												<label className="compact">
													{key === "fullName"
														? "Full Name"
														: key === "phoneNumber"
															? "Phone Number"
															: key
																	.replace(
																		/_/g,
																		" "
																	)
																	.split(" ")
																	.map(
																		word =>
																			word
																				.charAt(
																					0
																				)
																				.toUpperCase() +
																			word.slice(
																				1
																			)
																	)
																	.join(" ")}
													:
												</label>
												<div>
													{key === "phoneNumber"
														? formatPhoneNumber(
																value
															)
														: value}
												</div>
											</div>
										)
								)}
							</form>
							<div>
								<button
									className="margin"
									onClick={handleChangePassword}
								>
									Change Password
								</button>
								<button onClick={handleSignOut}>
									Sign Out
								</button>
							</div>
						</div>

						<div className="collection-layout margin padding-left drop-shadow">
							<BookmarksCollection
								title="Bookmarks"
								bookmarks={bookmarks}
								userID={userProfile.userID}
								time={timestamp}
							/>
							<ListingCollection
								title="Listings"
								bookmarks={listings}
								userID={userProfile.userID}
								time={timestamp}
								custom={true}
							/>
						</div>

						<ProfileDetails
							userID={userProfile.userID}
						></ProfileDetails>
					</div>

					<div className="vertical-center margin">
						<div className="small-container drop-shadow">
							{!showDeleteConfirmation && (
								<button
									className="span-button"
									onClick={confirmDelete}
								>
									Delete Profile
								</button>
							)}
							{showDeleteConfirmation && (
								<form className="" onSubmit={handleDelete}>
									<div className="margin input">
										<input
											type="text"
											name="username"
											placeholder="Username"
											value={
												deleteConfirmationData.username
											}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div className="margin input">
										<input
											type="password"
											name="password"
											placeholder="Password"
											value={
												deleteConfirmationData.password
											}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div className="vertical-center flex-column">
										<button
											className={
												deleteConfirmationData.username
													.length > 0 &&
												deleteConfirmationData.password
													.length > 0
													? "button"
													: "disabled"
											}
										>
											Confirm Delete
										</button>
										<button onClick={handleCancelDelete}>
											Cancel
										</button>
									</div>
									{deleteError && {
										deleteError,
										className: "error-message"
									}}
								</form>
							)}
						</div>
					</div>
					<Footer />
				</div>
			)}
		</div>
	);
}

export default ProfilePage;
