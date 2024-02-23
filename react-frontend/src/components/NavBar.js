// NavBar.js (Josh)

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function NavBar() {
  return (
    <nav style={{ backgroundColor: 'white', padding: '10px', display: 'flex', alignItems: 'center' }}>
      <div style={{ flexGrow: 1 }}>
        <img src={logo} alt="Logo" style={{ height: '60px', marginTop: '10px', marginRight: '20px' }} />
      </div>

      <ul style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', fontFamily: 'inter, sans-serif'}}>
        <li style={{ margin: '0 10px' }}>
          <Link to="/about">About</Link>
        </li>
        <li style={{ margin: '0 10px' }}>
          <Link to="/marketplace">Marketplace</Link>
        </li>
        <li style={{ margin: '0 10px' }}>
          <Link to="/sign-up">My Profile</Link>
        </li>
        <li style={{ margin: '0 10px' }}>
          <Link to="/new-listing" style = {{padding: '10px 10px', backgroundColor: 'green', color: 'white', borderRadius: '7px'}}>Post a Listing</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;