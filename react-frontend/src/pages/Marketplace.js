import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Entry from "../components/MarketplaceEntry";
import ScrollToTopButton from "../components/ScrollToTopButton";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the loading spinner component

function Marketplace() {
  const [searchParams] = useSearchParams();
  let q = searchParams.get("q");
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  if (q === null) {
    q = "";
  }

  useEffect(() => {
    fetchEntries();
  }, [q, page]);

  async function fetchEntries() {
    try {
      const response = await axios.get(`http://localhost:8000/listings?q=${q}&page=${page}`);
      if (response !== "") {
        console.log(response.data);
        setEntries(prevEntries => [...prevEntries, ...response.data]); // Append fetched entries to existing ones
        setIsLoading(false); // Set loading state to false once entries are fetched
      }
    } catch (error) {
      console.log("Error fetching entries:", error);
    }
  }

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
    <div>
      <div className="full-container">
        {isLoading ? ( // Render loading spinner if isLoading is true
          <LoadingSpinner />
        ) : (
          entries.map((entry) => (
            <Entry 
              key={entry.listingID}
              title={entry.title}
              price={entry.price}
              listingID={Number(entry.listingID)}
            />
          ))
        )}
      </div>
      <ScrollToTopButton onClick={scrollToTop} />
    </div>
  );
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

export default Marketplace;
