import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import logo from "../assets/logo.png";
import "./navbar.css";
import SearchBar from "./SearchBar";
import { jwtDecode } from "jwt-decode";

function getProfileName() {
  const token = localStorage.getItem("token");
  if (token !== null) {
    const decodedToken = jwtDecode(token);
    const username = decodedToken.username;
    return username;
  } else {
    return "Profile";
  }
}

function NavBar() {
  const navigate = useNavigate();

  const handlePostListingClick = () => {
    navigate("/new-listing"); 
  };

  return (
    <div className="flex-container nav-container">
      <nav className="vertical-center" style={{flexWrap: "wrap"}}>

        <Link className="logo-container" to="/marketplace">
          <img src={logo} alt="Logo" />
        </Link>

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
          Post a Listing
        </button>
      
      </nav>
    </div>
  );
}

export default NavBar;
