import React from "react";
import "./footer.css";
import teamLogo from "../assets/team-logo.png";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

function Footer() {
	return (
		<div style={{marginTop: "100px"}}>
			<footer className="footer">
				<div className="logo">
					<img className="team-logo" src={teamLogo} alt="Team Logo" />
					<FaFacebook className="media-icon" size = "24"/>
					<FaInstagram className="media-icon" size = "24" />
					<FaTwitter className="media-icon" size = "24" />
				</div>
				<div className="information">
					<Link className="footer-link" to="/terms-of-service">Terms of Service</Link>
					<span className="link-separator"></span>
					<Link className="footer-link" to="/privacy-policy">Privacy Policy</Link>
					<span className="link-separator"></span>
					<div className="copyright">©2024 Five Guys</div>
				</div>
			</footer>
		</div>
	);
}

export default Footer;
