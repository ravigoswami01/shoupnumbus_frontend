import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contect from "./pages/Contect";
import Card from "./pages/Card";
import Login from "./pages/login";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/order";
import NaverBar from "./components/NaverBar";
import Product from "./pages/product";
import Footer from "./components/Footer";
import Searchbar from "./components/Searchbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyPayment from "./pages/VerifyPayment";
import UserProfile from "./pages/userProfile";

const App = () => {
  
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] ">
      <ToastContainer />
      <NaverBar />
      <Searchbar />
      <Routes>
        <Route path="/collection" element={<Collection />} />
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contect />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Card />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/order" element={<Order />} />
        <Route path="/verify" element={<VerifyPayment />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
