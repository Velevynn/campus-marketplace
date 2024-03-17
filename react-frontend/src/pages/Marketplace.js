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
  const [page, setPage] = useState(1);
  // console.log("Query parameter:", q);

  if (q === null) {
    q = "";
  }  // if no such query, set to "" for route purposes

  useEffect(() => {
    fetchEntries();
  }, [q, page]);  // use q for 'query' and 'page' for fetching entries from backend

  async function fetchEntries() {
    try {
      const response = await axios.get(`https://haggle.onrender.com/listings?q=${q}`);
      if (response !== "") {
        console.log(response.data);
        setEntries(response.data);
      }
    } catch (error) {
      console.log("Error fetching entries:", error);
    }
  }

  // add function to handle loading more entries upon scrolling past the bottom of the page
  const handleScroll = () => {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.scrollY;

    if (windowBottom >= docHeight) {
      setPage(prevPage => prevPage + 1);
      console.log("new page detected");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div style={{ margin: "25px" }}>
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