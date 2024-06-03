import React, { useState, useEffect } from "react";
import search from "../assets/search.png";
import "./searchbar.css";
import Notify from "./ErrorNotification";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  const updateRecentSearches = (query) => {
    let searches = [...recentSearches];
    const searchIndex = searches.indexOf(query);

    if (searchIndex !== -1) {
      searches.splice(searchIndex, 1);
    }

    searches.unshift(query);

    if (searches.length > 7) {
      searches.pop();
    }

    setRecentSearches(searches);
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    if (searchQuery !== "") {
      updateRecentSearches(searchQuery);
      const url = process.env.REACT_APP_FRONTEND_LINK + `/marketplace?q=${searchQuery}`;
      window.history.replaceState({}, "", url);
      window.location.reload();
    } else if (!showNotification) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3300);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && searchQuery !== "") {
      updateRecentSearches(searchQuery);
      const url = process.env.REACT_APP_FRONTEND_LINK + `/marketplace?q=${searchQuery}`;
      window.history.replaceState({}, "", url);
      window.location.reload();
    } else if (!showNotification && event.key === "Enter") {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3300);
    }
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    const url = process.env.REACT_APP_FRONTEND_LINK + `/marketplace?q=${query}`;
    window.history.replaceState({}, "", url);
    window.location.reload();
  };

  const handleDeleteSearch = (query) => {
    const updatedSearches = recentSearches.filter((search) => search !== query);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleInputFocus = () => {
    setInputFocused(true);
    console.log(inputFocused);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setInputFocused(false);
    }, 200); // Delay to allow clicks on dropdown items
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyPress}
        className="search-input"
      />
      <button type="searchButton" onClick={handleSearch}>
        <img src={search} alt="search-icon" className="search-img" />
      </button>
      {showNotification && <Notify message="Search field empty" />}
      {recentSearches.length > 0 && searchQuery.length === 0 && (
      <ul className="recent-searches">
        {recentSearches.map((search, index) => (
          <li key={index} className="recent-search-item" onClick={() => handleRecentSearchClick(search)}>
            <span>{search}</span>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteSearch(search); }} className="delete-search-button">X</button>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}

export default Search;
