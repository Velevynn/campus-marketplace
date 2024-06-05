import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import logo from "../assets/logo.png";
import "./navbar.css";
import SearchBar from "./SearchBar";
import { jwtDecode } from "jwt-decode";

function getProfileName() {
	const token = localStorage.getItem(process.env.JWT_TOKEN_NAME);
	if (token !== null) {
		const decodedToken = jwtDecode(token);
		if (decodedToken.exp && decodedToken.exp > (Date.now() / 1000)) {
			const username = decodedToken.username;
			// capitalize the first letter and convert the rest to lowercase
			const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
			// truncate usernames longer than 10 characters and pad shorter usernames with spaces
			if (formattedUsername.length > 10) {
				return formattedUsername.substring(0, 8) + ".."; // Truncate and add ".."
			} else {
				return formattedUsername; // pad with spaces
			}
		}
	}
	return "Profile"; // 10 spaces to ensure consistent length
}

function NavBar() {
	const navigate = useNavigate();

	const handlePostListingClick = () => {
		navigate("/new-listing"); 
	};

	const handleMarketplaceClick = () => {
		navigate("/marketplace");
		window.location.reload();
	};

	return (
		<div className="flex-container nav-container">
			<nav className="vertical-center" style={{flexWrap: "wrap"}}>

				<div className="logo-container" onClick={handleMarketplaceClick}>
					<img src={logo} alt="Logo" />
				</div>

				<div>
					<SearchBar />
				</div>

				<div className="flex-row margin" style={{marginTop:"5px"}}>
					<li>
						<Link to="/about">About</Link>
					</li>
					<li>
						<Link to="/marketplace">Marketplace</Link>
					</li>
					<li>
						<Link to="/profile" style={{ width: "80px", textAlign: "center", whiteSpace: "pre" }}>{getProfileName()}</Link>
					</li>
				</div>
				<button className="post-button" onClick={handlePostListingClick}>
          Post
				</button>
      
			</nav>
		</div>
	);
}

export default NavBar;
