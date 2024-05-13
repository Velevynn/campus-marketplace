// NavBar.js
import React, { useState } from "react";
import search from "../assets/search.png";
import "./searchbar.css"; // Import CSS file for styling
import Notify from "./ErrorNotification";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    console.log("Searching for", searchQuery);
    if (searchQuery !== "") {
      const url = process.env.REACT_APP_FRONTEND_LINK + `/marketplace?q=${searchQuery}`
      window.history.replaceState({}, "", url);
      window.location.reload();
    } else if (showNotification === false){  // check to prevent spamming the notification
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false); // Hide notification after 3 seconds
      }, 3300);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && searchQuery !== "") {
      const url = process.env.REACT_APP_FRONTEND_LINK + `/marketplace?q=${searchQuery}`
      window.history.replaceState({}, "", url);
      window.location.reload();
    } else if (showNotification === false && event.key === "Enter") {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false); // Hide notification after 3 seconds
      }, 3300);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        className="search-input"
      />
      <button type="searchButton" onClick={handleSearch}>
        <img src={search} alt="search-icon" className="search-img" />
      </button>
      {showNotification && <Notify message="Search field empty" />}
    </div>
  );
}

export default Search;
