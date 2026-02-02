import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the context
export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const deliveryFee = 10;
  const BackendURL = import.meta.env.VITE_BAVKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setTokenState] = useState("");
  const [userId , setuserId] = useState("")
  const navigate = useNavigate();

 useEffect(() => {
  const savedToken = localStorage.getItem("token");
  const savedUserId = localStorage.getItem("userId");
  if (savedToken) setTokenState(savedToken);
  if (savedUserId) setuserId(savedUserId);
  getProductData();
}, []);
  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setTokenState(newToken);
  };
   

  useEffect(() => {
    if (token) {
      getUserCart(token);
    }
  }, [token]);

  const addToCart = async (itemId, size) => {
  if (!size) {
    toast.error("Size is required to add an item to the cart.");
    return;
  }

  const updatedCart = structuredClone(cartItems);

  if (updatedCart[itemId]) {
    updatedCart[itemId][size] = updatedCart[itemId][size] + 1;
  } else {
    updatedCart[itemId] = { [size]: 1 };
  }

  setCartItems(updatedCart);
   
  if (token) {
    try {
      await axios.post(
        `${BackendURL}/api/card/add`,
        { itemId, size },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }
};

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId]) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            totalCount += cartItems[itemId][size];
          }
        }
      }
    }    
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const updatedCart = { ...cartItems };
    updatedCart[itemId][size] = quantity;
     
    setCartItems(updatedCart);
    if (token) {
      try {
        await axios.post(
          BackendURL + "/api/card/update",
          { itemId, size, quantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartTotalAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((item) => item._id === itemId);
      if (!itemInfo) continue;

      for (const size in cartItems[itemId]) {
        const quantity = cartItems[itemId][size];
        if (quantity > 0) {
          totalAmount += itemInfo.price * quantity;
        }
      }
    }
    return totalAmount;
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(`${BackendURL}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || "Failed to fetch products.");
      }
    } catch (error) {
      toast.error(
        error.message || "Something went wrong while fetching products."
      );
    }
  };

  const getUserCart = async () => {
    try {
      const response = await axios.post(
        BackendURL + "/api/card/get",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("this is response is ", response);
      
      if (response.data.success) {
        setCartItems(response.data.cartData)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
 
  const getProfile = async () =>{
    try {
      
    } catch (error) {
      
    }
  }

 


  const value = {
    products,
    currency,
    deliveryFee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartTotalAmount,
    navigate,
    BackendURL,
    token,
    setToken,setCartItems,
  
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
