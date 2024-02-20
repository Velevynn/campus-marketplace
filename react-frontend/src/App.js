import React, { useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import SignUpPage from './Authentication/SignUpPage';
import Form from "./Form";
import Table from "./Table";
import axios from "axios";

function App() {
  const [listings, setListings] = useState([]);


  function updateList(listing) {
    makePostCall(listing).then((result) => {
      //if (result && result.status === 201)
      // Change listing to result of post call once database is set up
      setListings([...listings, listing]);
      console.log(result);
    });
  }

  function removeOneListing(index) {
    const listing = listings[index].id;

    const updated = listings.filter((listing, i) => {
      return i !== index;
    });
    setListings(updated);

    /*
    makeDeleteCall(listing).then((result) => {
      if (result.status === 204) {
        const updated = listings.filter((listing, i) => {
          return i !== index;
        });
        setListings(updated);
      }
    }); */
  }

  async function makeDeleteCall(id) {
    try {
      const response = await axios.delete(
        `http://localhost:8000/users/${id}`
      );
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function makePostCall(person) {
    try {
      const response = await axios.post(
        `http://localhost:8000/users`,
        person
      );
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return (
    <div className="container">
      <h1>Choose your Path!</h1>
      <BrowserRouter basename="/">
        <nav>
          <ul>
            <li>
              <Link to="/SignUpPage">Sign Up</Link>
            </li>
            <li>
              <Link to="/Form">Create a listing</Link>
            </li>
            <li>
              <Link to="/">Listings</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route 
            path="/" 
            element={<Table
              characterData={listings}
              removeCharacter={removeOneListing}
            />}
          />
          <Route
            path="/SignUpPage"
            element={<SignUpPage />}
          />
          <Route path="/form" element={<Form 
          handleSubmit = {updateList} 
          />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;