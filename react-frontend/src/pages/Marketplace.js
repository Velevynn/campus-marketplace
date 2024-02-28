// Marketplace.js

import React, { useState, useEffect } from "react";
import './pages.css';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import Entry from "../components/MarketplaceEntry";
import SearchBar from "../components/SearchBar";

function Marketplace() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q');
    const [entries, setEntries] = useState([]);
    console.log("Query parameter:", q); 
    useEffect(() => {
      fetchEntries();
    }, [q]);
  
    async function fetchEntries() {
      try {
        const response = await axios.get(`http://localhost:8000/listings?q=${q}`);
        if (response !== "") {
          console.log(response.data);
          setEntries(response.data);
        }
      } catch (error) {
        console.log("Error fetching entries:", error);
      }
    }

    // Function to handle search
    function handleSearch(query) {
      window.location.href = `/marketplace?q=${query}`; // Redirect to the marketplace page with the search query
    }
    
  return (
    <div style={{margin: '25px'}}>
      <h1 style={{ fontFamily: 'Newsreader, serif', fontSize: '3rem'}}>Marketplace</h1>
      <SearchBar onSearch={handleSearch}/> {/* Pass handleSearch function as a prop */}
      <div className="divider" />
    {entries.map(entry => (
      <Entry
          key={entry.listingID}
          title={entry.name}
          price={entry.price}
          listingID={entry.listingID}
        />
      ))}
    </div>
    
  );
}

export default Marketplace;
