// NavBar.js

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './navbar.css'; // Import CSS file for styling

function NavBar() {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <div className="logo">
          <Link to="/"><img src={logo} alt="Logo" /></Link>
        </div>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/marketplace">Marketplace</Link>
        </li>
        <li>
          <Link to="/sign-up">My Profile</Link>
        </li>
        <li>
          <Link to="/new-listing" className="post-listing-button">Post a Listing</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
