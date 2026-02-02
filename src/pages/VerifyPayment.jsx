import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyPayment = () => {
  const { navigate, token, setCartItems, BackendURL } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);
  
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyStripe = async () => {
    try {
      // Add loading state
      setIsVerifying(true);
      
      // Debug: Log the parameters
      console.log("Verification Parameters:", {
        success,
        orderId,
        token: token ? "Token exists" : "No token",
        BackendURL
      });

      // Check if required parameters exist
      if (!success || !orderId) {
        console.error("Missing required parameters:", { success, orderId });
        toast.error("Missing payment verification parameters");
        navigate("/cart");
        return;
      }

      if (!token) {
        console.error("No authentication token found");
        toast.error("Authentication required");
        navigate("/login");
        return;
      }

      // Make the API call
      const response = await axios.post(
        `${BackendURL}/api/order/verifyStrip`,
        { 
          success , 
          orderId 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        setVerificationStatus("success");
        toast.success("Payment verified successfully!");
        setCartItems({});
                setTimeout(() => {
          navigate("/order");
        }, 1500);
      } else {
        setVerificationStatus("failed");
        console.error("Verification failed:", response.data.message);
        toast.error(response.data.message );
        
        setTimeout(() => {
          navigate("/cart");
        }, 2000);
      }
    } catch (error) {
      setVerificationStatus("error");
      console.error("Verification error:", error);
      
      // More detailed error handling
      if (error.response) {
        console.error("Server response:", error.response.data);
        toast.error(error.response.data.message || "Server error during verification");
      } else if (error.request) {
        console.error("Network error:", error.request);
        toast.error("Network error. Please check your connection.");
      } else {
        console.error("Error:", error.message);
        toast.error(error.message || "Payment verification failed");
      }
      
      setTimeout(() => {
        navigate("/cart");
      }, 2000);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    // Only verify if we have the required parameters
    if (success && orderId && token) {
      verifyStripe();
    } else {
      console.error("Missing required data for verification");
      setIsVerifying(false);
      navigate("/cart");
    }
  }, [token, success, orderId]);

  // Loading UI
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Verified!</h2>
            <p className="text-gray-600">Your order has been confirmed successfully.</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error/Failed state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
          <p className="text-gray-600">There was an issue verifying your payment.</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting back to cart...</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPayment;