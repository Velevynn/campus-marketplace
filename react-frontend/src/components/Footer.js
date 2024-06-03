import React from "react";
import "./footer.css";
import teamLogo from "../assets/team-logo.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div style={{marginTop: '100px'}}>
      <footer className="footer">
        <div className="logo">
          <img className="team-logo" src={teamLogo} alt="Team Logo" />
        </div>
        <div className="information">
          <Link className="footer-link" to="/terms-of-service">Terms of Service</Link>
          <span className="link-separator"></span>
          <Link className="footer-link" to="/privacy-policy">Privacy Policy</Link>
          <span className="link-separator"></span>
          © 2024 Five Guys
          <span className="link-separator"></span>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
