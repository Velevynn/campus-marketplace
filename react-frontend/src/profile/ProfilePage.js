import React, { useState, useEffect } from "react";
import axios from "axios";
import BookmarksCollection from "./BookmarksCollection";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ProfileDetails from "./ProfileDetails";
import ListingCollection from "./ListingCollection";
import ChangeProfilePicture from "./ChangeProfilePicture"; // Import the ChangeProfilePicture component
import Footer from "../components/Footer";
import "./profile.css";

function ProfilePage() {
	const [bookmarks, setBookmarks] = useState([]);
	const [listings, setMyListings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const timestamp = useState(Date.now());
	const isCustom = true;
	const [userProfile, setUserProfile] = useState({
		username: "",
		full_name: "",
		email: "",
		phoneNumber: "",
		userID: ""
	});
	//const [isHovered, setIsHovered] = useState(false); // Define isHovered state

	const navigate = useNavigate(); // Define navigate for routing

	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [deleteConfirmationData, setDeleteConfirmationData] = useState({
		username: "",
		password: "",
	});
	const [deleteError, setDeleteError] = useState("");

	useEffect(() => {
		fetchUserProfile();
	}, []);

	const fetchUserProfile = async () => {
		const token = localStorage.getItem(process.env.JWT_TOKEN_NAME);
		if (!token) {
			navigate("/login");
			return;
		}

		try {
			const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + "/users/profile", {
				headers: {
					"Authorization": `Bearer ${token}`,
				}
			});
			setUserProfile(response.data);
			fetchCollections(response.data.userID);
			console.log(response.data, "my data");
		} catch (error) {
			console.error("Failed to fetch profile data:", error);
			navigate("/login");
		}
	};

	const fetchCollections = async (userID) => {
		try {
			console.log(userID);
			const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/listings/bookmark/${userID}`);
			setBookmarks(response.data);
		} catch (error) {
			console.error("Failed to fetch bookmarks", error);
		}
		try {
			console.log(userID);
			const response = await axios.get(process.env.REACT_APP_BACKEND_LINK + `/listings/mylistings/${userID}`);
			setMyListings(response.data);
			console.log(response.data, "hello");

		} catch (error) {
			console.error("Failed to fetch myListings", error);
		}
		setIsLoading(false);
	};

	const handleChangePassword = () => {
		navigate("/change-password");
	};

	const handleSignOut = () => {
		localStorage.removeItem(process.env.JWT_TOKEN_NAME);
		navigate("/login");
	};

	const formatPhoneNumber = (phoneNumber) => {
		const cleaned = ("" + phoneNumber).replace(/\D/g, "");
		const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			return "(" + match[1] + ") " + match[2] + "-" + match[3];
		}
		return phoneNumber;
	};


	const handleDeleteConfirmation = async () => {
		const token = localStorage.getItem(process.env.JWT_TOKEN_NAME);
		if (!token) {
			navigate("/login");
			return;
		}

		try {
			const response = await axios.delete(process.env.REACT_APP_BACKEND_LINK + "/users/delete", {
				headers: {
					"Authorization": `Bearer ${token}`
				},
				data: {
					username: deleteConfirmationData.username,
					password: deleteConfirmationData.password
				}
			});

			if (response.status === 200) {
				// After successful deletion, redirect to login
				localStorage.removeItem(process.env.JWT_TOKEN_NAME);
				navigate("/login");
			}
		} catch (error) {
			console.error("Failed to delete profile:", error.response);
			if (error.response && error.response.data && error.response.data.error) {
				setDeleteError(error.response.data.error);
			} else {
				setDeleteError("An error occurred while deleting the profile.");
			}
		}
	};

	const confirmDelete = () => {
		setShowDeleteConfirmation(true);
	};

	const handleCancelDelete = () => {
		setShowDeleteConfirmation(false);
		setDeleteError("");
	};

	const handleDelete = (e) => {
		e.preventDefault();
		// Perform deletion after confirmation
		handleDeleteConfirmation();
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setDeleteConfirmationData({ ...deleteConfirmationData, [name]: value });
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
							<ChangeProfilePicture userID = {userProfile.userID} time = {timestamp}/>
							<form>
								{Object.entries(userProfile).map(([key, value]) => (
									key !== "userID" && 
				<div key={key}>
					<label className='compact'>
						{key === "fullName" ? "Full Name" : key === "phoneNumber" ? "Phone Number" : key.replace(/_/g, " ")
							.split(" ")
							.map(word => word.charAt(0).toUpperCase() + word.slice(1))
							.join(" ")}:
					</label>
					<div>{key === "phoneNumber" ? formatPhoneNumber(value) : value}</div>
				</div>
								))}
							</form>
							<div>
								<button className="margin" onClick={handleChangePassword}>Change Password</button>
								<button onClick={handleSignOut}>Sign Out</button>
							</div>
						</div>

						<div className="collection-layout margin padding-left drop-shadow">
							<BookmarksCollection title="Bookmarks" bookmarks={bookmarks} userID={userProfile.userID} time = {timestamp} />
							<ListingCollection title="Listings" bookmarks={listings} userID={userProfile.userID} time = {timestamp} custom = {isCustom} />
						</div>

						<ProfileDetails userID = {userProfile.userID}>
						</ProfileDetails>
					</div>

					<div className="vertical-center margin">
						<div className="small-container drop-shadow">
							{!showDeleteConfirmation && (
								<button className="span-button" onClick={confirmDelete}>Delete Profile</button>
							)}
							{showDeleteConfirmation && (
								<form className="" onSubmit={handleDelete}>
									<div className="margin input">
										<input
											type="text"
											name="username"
											placeholder="Username"
											value={deleteConfirmationData.username}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div className="margin input">
										<input
											type="password"
											name="password"
											placeholder="Password"
											value={deleteConfirmationData.password}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div className="vertical-center flex-column">
										<button className={deleteConfirmationData.username.length > 0 
                      && deleteConfirmationData.password.length > 0 ? "button" : "disabled"}>Confirm Delete</button>
										<button onClick={handleCancelDelete}>Cancel</button>
									</div>
									{deleteError && {deleteError , className : "error-message"}}
								</form>
							)}
						</div>
					</div>
					<Footer/>
				</div>
			)}
		</div>
	);
}

export default ProfilePage;