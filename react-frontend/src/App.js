import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpPage from "./authentication/SignUpPage.js";
import LoginPage from './authentication/LoginPage.js';
import ProfilePage from './profile/ProfilePage.js';
import Marketplace from "./pages/Marketplace";
import AddListing from "./pages/AddListing";
import PageNotFound from "./pages/PageNotFound";
import NavBar from "./components/NavBar";
import About from "./pages/About";
import TOS from "./pages/TOS";
import ListingView from "./listings/ListingView.js";
import ProtectedRoute from "./utils/ProtectedRoute"; // Importing ProtectedRoute
import BuyNow from "./pages/BuyNow.js";
import MakeOffer from "./pages/MakeOffer.js";
import StartChat from "./pages/Chat.js";
import DeleteListing from "./pages/DeleteListing.js";
import EditListing from "./pages/EditListing.js";

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
          <Route path="/listings/:listingID" element={<ListingView />} />
          <Route path="/listings/:listingID/buy" element={<BuyNow />} />
          <Route path="/listings/:listingID/offer" element={<MakeOffer />} />
          <Route path="/listings/:listingID/chat" element={<StartChat />} />
          <Route path="/listings/:listingID/delete" element={<DeleteListing />} />
          <Route path="/listings/:listingID/edit" element={<EditListing />} />
          <Route
              path = "*"
              element = {<PageNotFound/>}
              />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
