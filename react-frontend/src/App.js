import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignUpPage from "./authentication/SignUpPage.js";
import LoginPage from './authentication/LoginPage.js';
import HandleTokenRedirect from './authentication/HandleTokenRedirect.js';
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
import MakeOfferPage from "./pages/MakeOfferPage.js";
import EditListing from "./listings/EditListing.js";
import ForgotPasswordPage from './authentication/ForgotPasswordPage';
import ResetPasswordPage from './authentication/ResetPasswordPage';
import ChangePasswordPage from './authentication/ChangePasswordPage';
import AdditionalDetailsPage from './authentication/AdditionalDetailsPage';
import ChatPage from './pages/ChatPage.js';
import PublicPage from "./profile/PublicPage.js";

function App() {
  return (
    <div className="container">
      <BrowserRouter basename="/">
        <NavBar />
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/google" element={<HandleTokenRedirect />} />c
          <Route path="/profile" 
                element={
                <ProtectedRoute>
                  <ProfilePage/>
                </ProtectedRoute>
                } />
          <Route path="/profile/:userID" element={<PublicPage/>}/>
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
          <Route path="/listings/:listingID/buy" element={<ProtectedRoute> <BuyNow /></ProtectedRoute> } />
          <Route path="/listings/:listingID/offer" element={<ProtectedRoute> <MakeOfferPage /></ProtectedRoute> } />
          <Route path="/listings/:listingID/chat/:chatID" element={<ProtectedRoute> <ChatPage /></ProtectedRoute> } />
          <Route path="/listings/:listingID/edit" element={<ProtectedRoute> <EditListing /></ProtectedRoute> } />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/additional-details" element={<AdditionalDetailsPage />} />
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
