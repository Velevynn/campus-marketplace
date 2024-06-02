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
      return username;
    }
  }
  return "Profile"
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

        <div className="flex-row margin">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/marketplace">Marketplace</Link>
          </li>
          <li>
            <Link to="/profile">{getProfileName()}</Link>
          </li>
        </div>
        <button className="" onClick={handlePostListingClick}>
          Post
        </button>
      
      </nav>
    </div>
  );
}

export default NavBar;
