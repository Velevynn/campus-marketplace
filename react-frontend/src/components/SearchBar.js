// NavBar.js
import React, { useState } from 'react';
import search from '../assets/search.png'
import './searchbar.css'; // Import CSS file for styling

function Search() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    }

    const handleSearch = () => {
        console.log("Searching for", searchQuery)
        if (searchQuery !== "") {
            window.location.href = `/marketplace?q=${searchQuery}`
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && searchQuery !== "") {
            window.location.href = `/marketplace?q=${searchQuery}`
        }
    }

    return ( 
        <div className = "search-container">
            <input 
                type = "text" 
                placeholder="Search for products..." 
                value = {searchQuery} 
                onChange = {handleInputChange}
                onKeyDown = {handleKeyPress}
                className = "search-input"
            />
            <button type = "submit" onClick = {handleSearch} className = "search-button"><img src = {search} alt = "search-icon" className = "search-img"/></button>
        </div>
    );    
}

export default Search;