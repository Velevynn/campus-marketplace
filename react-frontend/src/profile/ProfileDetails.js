// ProfileDetails.js (Joshua Estrada)
// ProfilePage Component to edit userBio and userLocation
import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import Notify from "../components/ErrorNotification";
import PropTypes from "prop-types";
import axios from "axios";

function ProfileDetails(props) {
	const [showNotification, setShowNotification] = useState(false);
	const [isSuccessful, setIsSuccessful] = useState(false);
	const [notificationMsg, setNotificationMsg] = useState("");
	const [bio, setBio] = useState("");
	const [hometown, setHometown] = useState("");
	const [cityByZip, setCityByZip] = useState("");

	// handles changes to bio: prevents exceeding max char limit and excessive newlines
	function handleChange(event) {
		const inputValue = event.target.value;
		const newlineCount = (inputValue.match(/\n/g) || []).length; // Count the number of newlines

		if (
			newlineCount <= 4 &&
			(inputValue.length < 250 ||
				event.nativeEvent.inputType === "deleteContentBackward")
		) {
			setBio(inputValue);
		} else {
			triggerNotification("Max Newlines Exceeded!", false);
		}

		if (inputValue.length > 250) {
			setBio(inputValue.slice(0, 249));
		}
	}

	// function for triggering visual notification with a custom message & color indicator (success, fail)
	function triggerNotification(textField, successBool) {
		if (!showNotification) {
			setNotificationMsg(textField);
			setIsSuccessful(successBool);
			setShowNotification(true);
			setTimeout(() => {
				setShowNotification(false); // Hide notification after 3 seconds
			}, 3300);
		}
	}

	// fetches user profile data to set bio (if user has set their bio)
	const fetchUserProfile = async userID => {
		try {
			const response = await axios.get(
				process.env.REACT_APP_BACKEND_LINK +
					`/users/public-profile/${userID}`
			);
			setBio(response.data.bio);
			if (bio && bio.length > 0) {
				setBio(bio);
			}
		} catch (error) {
			console.error("Error encountered: ", error);
		}
	};

	// saves the bio by sending user inputted bio to the backend: automatically truncates bio
	const saveBio = async () => {
		try {
			if (bio.length == 0) {
				triggerNotification("Text field empty", false);
				return;
			}

			if (bio.length > 249) {
				triggerNotification("Bio is too long", false);
				return;
			}

			await axios.post(
				`${process.env.REACT_APP_BACKEND_LINK}/users/set-bio`,
				{
					userID: props.userID,
					bio: bio.slice(0, 199)
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(process.env.REACT_APP_JWT_TOKEN_NAME)}`
					}
				}
			);
			triggerNotification("Bio Saved Successfully", true);
		} catch (error) {
			console.error("Error:", error);
			triggerNotification("Save Unsuccessful", false);
		}
	};

	// finds user's city or general region using a get call to open-source street map API
	const handleSetLocationByZip = async () => {
		try {
			const response = await axios.get(
				`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(hometown)}, California, United States&format=json&addressdetails=1`
			);
			if (
				hometown.length === 5 &&
				response.data &&
				response.data.length > 0 &&
				response.data[0].address.postcode === hometown
			) {
				const city =
					response.data[0].address.city ||
					response.data[0].address.town ||
					response.data[0].address.village ||
					response.data[0].address.county; // find region
				setCityByZip(city); // Set the city found by zip code
			} else {
				let msg = "ZIP Code not found";
				if (hometown.length !== 5) {
					// Zip Code must be a US valid 5-digit zip code
					msg = "Invalid Zip Code";
				}
				triggerNotification(msg, false);
			}
		} catch (error) {
			console.error("Error:", error);
			triggerNotification("Failed to fetch location", false);
		}
	};

	// saves user's hometown (location) through a post call to the backend
	const handleSetHometown = async () => {
		try {
			if (cityByZip.length == 0) {
				triggerNotification("Enter & Confirm a Zip Code", false);
				return;
			}

			await axios.post(
				`${process.env.REACT_APP_BACKEND_LINK}/users/set-location`,
				{
					userID: props.userID,
					city: cityByZip
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(process.env.REACT_APP_JWT_TOKEN_NAME)}`
					}
				}
			);
			triggerNotification("Location Saved Successfully", true);
		} catch (error) {
			console.error("Error:", error);
			triggerNotification("Location Save Unsuccessful", false);
		}
	};

	useEffect(() => {
		fetchUserProfile(props.userID);
	}, []);

	return (
		<div className="padding-left">
			<div className="small-container drop-shadow profile-height">
				<h5>Profile Details</h5>
				<textarea
					className="vertical-form line-length"
					placeholder="Add your bio here.."
					value={bio}
					onChange={handleChange}
				></textarea>
				<button className="small-button small-width" onClick={saveBio}>
					Save Bio
				</button>
				<h5>Set Location</h5>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginTop: "-15px"
					}}
				>
					<input
						type="text"
						maxLength="5"
						placeholder="Enter Zip Code"
						value={hometown}
						onChange={e =>
							setHometown(e.target.value.replace(/\D/, ""))
						}
						style={{marginRight: "10px"}}
					/>
					<button
						className="lookup-btn"
						onClick={handleSetLocationByZip}
					>
						🔍
					</button>
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginTop: "-15px"
					}}
				>
					<button
						className="small-button margin-top"
						onClick={handleSetHometown}
					>
						Set Hometown
					</button>
					{cityByZip && (
						<div className="overflow-container">{`${cityByZip}`}</div>
					)}
				</div>
				<Link to={"/messages"}>
					<div className="text-link margin-top">View Messages</div>
				</Link>
				<Link
					to={
						process.env.REACT_APP_FRONTEND_LINK +
						"/profile/" +
						props.userID
					}
				>
					<div className="text-link">See Public Profile</div>
				</Link>
			</div>
			{showNotification && (
				<Notify message={notificationMsg} isSuccessful={isSuccessful} />
			)}
		</div>
	);
}

ProfileDetails.propTypes = {
	userID: PropTypes.string.isRequired
};

export default ProfileDetails;
