import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { setShowSearch, getCartCount, token, setToken, addToCart } = useContext(ShopContext);

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    addToCart({});
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between py-4 font-medium relative">
      <img src={assets.logo} alt="Logo" className="w-46" />

      {/* Desktop Nav */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {["/", "/collection", "/about", "/contact"].map((path, i) => (
          <NavLink key={i} to={path} className="flex flex-col items-center gap-1">
            {path === "/" ? "HOME" : path.replace("/", "").toUpperCase()}
          </NavLink>
        ))}
      </ul>

      {/* Right Icons */}
      <div className="flex items-center gap-5">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          alt="search"
          className="w-5 cursor-pointer"
        />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <img
            onClick={() => (token ? setDropdownOpen(!dropdownOpen) : navigate("/login"))}
            src={assets.profile_icon}
            alt="profile"
            className="w-5 cursor-pointer"
          />
          {token && dropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-md z-10">
              <p onClick={() => { navigate("/profile"); setDropdownOpen(false); }} className="cursor-pointer hover:text-black">My Profile</p>
              <p onClick={() => { navigate("/order"); setDropdownOpen(false); }} className="cursor-pointer hover:text-black">Order</p>
              <p onClick={() => { logOut(); setDropdownOpen(false); }} className="cursor-pointer hover:text-black">Logout</p>
            </div>
          )}
        </div>

        {/* Cart */}
        <NavLink to="/cart" className="relative">
          <img src={assets.cart_icon} alt="cart" className="w-5 min-w-5" />
          <p className="absolute right-[-5px] top-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </NavLink>

        {/* Mobile Menu Icon */}
        <img
          src={assets.menu_icon}
          onClick={() => setVisible(true)}
          alt="menu"
          className="w-5 sm:hidden cursor-pointer"
        />
      </div>

      {/* Mobile Sidebar */}
      <div className={`absolute top-0 right-0 bottom-0 bg-white transition-all duration-300 z-20 ${visible ? "w-full" : "w-0 overflow-hidden"}`}>
        <div className="flex flex-col text-gray-600">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="back" />
            <p>Back</p>
          </div>
          {["/", "/collection", "/about", "/contact"].map((path, i) => (
            <NavLink key={i} onClick={() => setVisible(false)} className="py-2 pl-6 border" to={path}>
              {path === "/" ? "Home" : path.replace("/", "").toUpperCase()}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;