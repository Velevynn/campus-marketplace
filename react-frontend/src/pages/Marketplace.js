// Marketplace.js

import React, { useState, useEffect } from "react";
import "./pages.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Entry from "../components/MarketplaceEntry";

function Marketplace() {
  const [searchParams] = useSearchParams();
  let q = searchParams.get("q");
  const [entries, setEntries] = useState([]);
  console.log("Query parameter:", q);
  if (q === null) {
    q = "";
  }

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

  
  return (
    <div style={{ margin: "25px" }}>
      <div className="divider" />
      <div className="entries-container">
      {entries.map((entry) => (
        <Entry 
          key={entry.listingID}
          title={entry.title}
          price={entry.price}
          listingID={entry.listingID}
        />
      ))}
      </div>
    </div>
  );
}

export default Marketplace;