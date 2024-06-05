import React, {useState} from "react";
import PropTypes from "prop-types";

function ShareButton(props) {
	const [dropdownVisible, setDropdownVisible] = useState(false); // State to control dropdown visibility
	const facebookLink =
		"https://facebook.com/sharer/sharer.php?u=" + props.link;

	const handleCopyURL = () => {
		const listingURL = window.location.href; // Get the current URL
		navigator.clipboard
			.writeText(listingURL)
			.then(() => {
				console.log("Listing URL copied to clipboard:", listingURL);
				setDropdownVisible(false); // Close the dropdown after copying URL
			})
			.catch(error => {
				console.error(
					"Failed to copy listing URL to clipboard:",
					error
				);
			});
	};

	return (
		<div
			className="dropdown"
			onClick={() => setDropdownVisible(!dropdownVisible)}
		>
			<button className="dropbtn">Share</button>
			{dropdownVisible && (
				<div className="dropdown-content" id="myDropdown">
					<div className="option" onClick={handleCopyURL}>
						Copy {props.type} URL
					</div>
					<a
						href={facebookLink}
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className="option">Share to Facebook</div>
					</a>
				</div>
			)}
		</div>
	);
}

ShareButton.propTypes = {
	link: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired
};

export default ShareButton;
