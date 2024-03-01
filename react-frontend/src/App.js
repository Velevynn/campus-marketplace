import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import Marketplace from "./pages/Marketplace";
import AddListing from "./pages/AddListing";
import NavBar from "./components/NavBar";
import About from "./pages/About";
import TOS from "./pages/TOS";
import BuyerListingView from "./Listings/BuyerView";
import SellerListingView from "./Listings/SellerView";

function App() {
  return (
    <div className="container">
      <BrowserRouter basename="/">
        <NavBar />
        <Routes>
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Marketplace />} />
          <Route path="/marketplace/" element={<Marketplace />} />
          <Route path="/new-listing" element={<AddListing />} />
          <Route path="/terms-of-service" element={<TOS />} />
          <Route path="/listings/:listingID" element={<BuyerListingView />} />
          <Route path="/mylisting/:listingID" element={<SellerListingView />} />
        </Routes>
        {/*<Footer >*/}
      </BrowserRouter>
    </div>
  );
}

export default App;
