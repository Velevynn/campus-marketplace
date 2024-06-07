import React from "react";
import {Link, useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";
import "./navbar.css";
import SearchBar from "./SearchBar";
import {FaEnvelope, FaUserCircle, FaStore, FaInfoCircle} from "react-icons/fa";

function NavBar() {
	const navigate = useNavigate();

	const handlePostListingClick = () => {
		navigate("/new-listing");
	};

	const handleMarketplaceClick = () => {
		navigate("/marketplace");
		window.location.reload();
	};

	const iconStyle = {fontSize: "26px"};

	return (
		<div className="flex-container nav-container">
			<nav className="vertical-center" style={{flexWrap: "wrap"}}>
				<div
					className="logo-container"
					onClick={handleMarketplaceClick}
				>
					<img src={logo} alt="Logo" />
				</div>

				<div style={{marginRight: "28vw"}}>
					<SearchBar />
				</div>

				<div
					className="flex-row"
					style={{gap: "12px", marginTop: "8px"}}
				>
					<li>
						<Link to="/about" style={iconStyle}>
							<FaInfoCircle />
						</Link>
					</li>
					<li>
						<Link to="/marketplace" style={iconStyle}>
							<FaStore />
						</Link>
					</li>
					<li>
						<Link to="/messages" style={iconStyle}>
							<FaEnvelope />
						</Link>
					</li>
					<li>
						<Link to="/profile" style={iconStyle}>
							<FaUserCircle />
						</Link>
					</li>
				</div>
				<button
					className="post-button"
					onClick={handlePostListingClick}
					style={{
						padding: "0px",
						paddingTop: "5px",
						paddingBottom: "5px",
						marginBottom: "-1px"
					}}
				>
					Post
				</button>
			</nav>
		</div>
	);
}

export default NavBar;
