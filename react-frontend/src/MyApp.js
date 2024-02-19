import React, { useState, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Table from "./Table";
import Form from "./Form";
import axios from "axios";

function MyApp() {
  const [listings, setListings] = useState([]);

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

  function updateList(listing) {
    makePostCall(listing).then((result) => {
      //if (result && result.status === 201)
      // Change listing to result of post call once database is set up
      setListings([...listings, listing]);
      console.log(result);
    });
  }

  useEffect(() => {
    fetchAll().then((result) => {
      if (result) setListings(result);
      console.log(listings);
    });
  }, []);

  async function fetchAll() {
    try {
      const response = await axios.get(
        `http://localhost:8000/users`
      );
      return response.data.users_list;
    } catch (error) {
      //We're not handling errors. Just logging into the console.
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

  return (
    // This is what we had before:
    // <div className="container">
    //   <Table characterData={characters} removeCharacter={removeOneCharacter} />
    //   <Form handleSubmit={updateList} />
    // </div>
    //
    // update basename below for deploying to gh-pages
    <div className="container">
      <h1>Choose your Path!</h1>
      <BrowserRouter basename="/">
        <nav>
          <ul>
            <li>
              <Link to="/users-table">List all</Link>
            </li>
            <li>
              <Link to="/form">Create a listing</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<h3>Welcome Home!</h3>} />
          <Route
            path="/users-table"
            element={
              <Table
                characterData={listings}
                removeCharacter={removeOneListing}
              />
            }
          />
          <Route path="/form" element={<Form handleSubmit={updateList} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default MyApp;
