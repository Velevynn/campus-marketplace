import React, { useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import SignUpPage from './pages/SignUpPage';
import Marketplace from './pages/Marketplace';
import AddListing from './pages/AddListing'
import NavBar from './components/NavBar';
import About from './pages/About';
import Footer from './components/Footer';
import TOS from './pages/TOS';

function App() {
  return (
    <div className="container"> 
      <BrowserRouter basename="/">
        <NavBar />
        <Routes>
          <Route
            path="/sign-up"
            element={<SignUpPage />}
          />
          <Route 
            path = "/about"
            element={<About />}
          />
          <Route 
            path = "/"
            element = {<Marketplace />}
          />
          <Route 
            path = "/marketplace"
            element = {<Marketplace />}
          />
          <Route 
            path = "/new-listing"
            element = {<AddListing />}
          />
          <Route 
            path = "/terms-of-service"
            element = {<TOS />}
          />
        </Routes>
        {/*<Footer >*/}
      </BrowserRouter>
    </div>
  );
}

export default App;