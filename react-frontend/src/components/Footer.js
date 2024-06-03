// Footer.js (Josh)
import React from "react";
import "./footer.css";
import teamLogo from "../assets/team-logo.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div style={{marginTop: '100px'}}>
      <footer className="footer">
        <div className="logo">
          <img className="team-logo" src={teamLogo}></img>
        </div>
        <div className="information">
          <Link className = "footer-link" to="/terms-of-service">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
