// NavBar.js
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./navbar.css"; // Import CSS file for styling
import SearchBar from "./SearchBar";
import {jwtDecode} from "jwt-decode";

function getProfileName() {
  const token = localStorage.getItem("token");
  if (token !== null) {
    const decodedToken = jwtDecode(token);
    const username = decodedToken.username;
    console.log(username);
    return username;
  } else {
    return "My Profile";
  }
}

function NavBar() {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <div className="logo">
          <Link to="/marketplace">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
      </div>

      <div className="search-bar-div">
        <SearchBar />
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/marketplace">Marketplace</Link>
        </li>
        <li>
          <Link to="/profile">{getProfileName()}</Link>
        </li>
        <li>
          <Link to="/new-listing" className="post-listing-button">
            Post a Listing
          </Link>
        </li>
      </ul>
    </nav>
  );
}



export default NavBar;
