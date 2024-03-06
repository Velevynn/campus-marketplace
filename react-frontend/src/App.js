import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpPage from "./Authentication/SignUpPage.js";
import LoginPage from './Authentication/LoginPage.js';
import ProfilePage from './Profile/ProfilePage.js';
import Marketplace from "./pages/Marketplace";
import AddListing from "./pages/AddListing";
import NavBar from "./components/NavBar";
import About from "./pages/About";
import TOS from "./pages/TOS";
import BuyerListingView from "./Listings/BuyerView.js";
import SellerListingView from "./Listings/SellerView.js";
import ProtectedRoute from "./utils/ProtectedRoute"; // Importing ProtectedRoute

function App() {
  return (
    <div className="container">
      <BrowserRouter basename="/">
        <NavBar />
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" 
                element={
                <ProtectedRoute>
                  <ProfilePage/>
                </ProtectedRoute>
                } />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Marketplace />} />
          <Route path="/marketplace/" element={<Marketplace />} />
          <Route path="/new-listing" 
                element={
                  <ProtectedRoute> 
                    <AddListing/>
                  </ProtectedRoute>
                  } />
          <Route path="/terms-of-service" element={<TOS />} />
          <Route path="/listings/:listingID" element={<BuyerListingView />} />
          <Route path="/mylisting/:listingID" element={<SellerListingView />} />
          <Route path="/*" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
