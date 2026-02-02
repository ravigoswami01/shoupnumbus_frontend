import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [currentUser, setCurrentUser] = useState("Login");
  const { token,setToken, BackendURL,navigate } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser === "Sign Up") {
        const response = await axios.post(BackendURL + "/api/users/register", {
          name,
          email,
          password
        });
        
        if (response.data.success && response.data.token) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Account created successfully!");
        } else {
          toast.error(response.data.message || "Registration failed");
        }
      } else {
        const response = await axios.post(BackendURL + "/api/users/login", {
          email,
          password
        });
        
        if (response.data.success && response.data.token) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful!");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      }
    } catch (error) {
       const errorMessage = error.response?.data?.message || "Invalid credentials";
      toast.error(errorMessage);
    }
  };
  useEffect(()=>{
    if (token) {
      navigate('/')
     }
  },[token])
  useEffect(()=>{
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
    }
  },[])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow border border-gray-200 p-8 flex flex-col gap-5"
      >
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{currentUser}</h2>
          <hr className="border-gray-200 my-2" />
        </div>
        {currentUser === "Login" ? null : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-between text-sm mt-[-8px]">
          <button
            type="button"
            className="text-indigo-600 hover:underline bg-transparent p-0"
            tabIndex={-1}
          >
            Forgot Password
          </button>
          {currentUser === "Login" ? (
            <button
              type="button"
              className="text-gray-500 hover:text-indigo-600 hover:underline bg-transparent p-0"
              onClick={() => setCurrentUser("Sign Up")}
              tabIndex={-1}
            >
              Create Account
            </button>
          ) : (
            <button
              type="button"
              className="text-gray-500 hover:text-indigo-600 hover:underline bg-transparent p-0"
              onClick={() => setCurrentUser("Login")}
              tabIndex={-1}
            >
              Login Here
            </button>
          )}
        </div>
        <button
          className="w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg mt-2 hover:bg-indigo-700 transition-all duration-200"
          type="submit"
        >
          {currentUser === "Login" ? "Login" : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Login;