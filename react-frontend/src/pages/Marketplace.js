// Marketplace.js (Josh)

import React, { useState, useEffect } from "react";
import './pages.css';
import axios from 'axios';
import Entry from "../components/MarketplaceEntry";

function Marketplace() {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
      fetchEntries();
    }, []);
  
    async function fetchEntries() {
      try {
        const response = await axios.get('http://localhost:8000/listings');
        setEntries(response.data.entry_list);
      } catch (error) {
        console.log("Error fetching entries:", error);
      }
    }
    
  return (
    <div style={{margin: '25px'}}>
      <h style={{ fontFamily: 'Newsreader, serif', fontSize: '3rem'}}>Marketplace</h>
      <div className="divider" />
    {entries.map(entry => (
      <Entry
          title={entry.title}
          price={entry.price}
        />
      ))}
    </div>
    
  );
}

export default Marketplace;