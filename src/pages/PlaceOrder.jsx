import React, { useState, useContext } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    navigate,
    deliveryFee,
    BackendURL,
    cartItems,
    products,
    getCartTotalAmount,
    setCartItems,
    token,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (getCartTotalAmount() === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "street",
      "city",
      "state",
      "zipCode",
      "country",
      "phoneNumber",
    ];
    if (requiredFields.some((field) => !formData[field].trim())) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      let orderItems = [];
      for (const productId in cartItems) {
        const sizes = cartItems[productId];
        for (const size in sizes) {
          if (sizes[size] > 0) {
            const product = products.find((p) => p._id === productId);
            if (product) {
              orderItems.push({
                ...product,
                size,
                quantity: sizes[size],
              });
            }
          }
        }
      }

      const payload = {
        address: formData,
        items: orderItems,
        amount: getCartTotalAmount() + deliveryFee,
      };

      switch (method) {
        case "cod":
          const codResponse = await axios.post(
            `${BackendURL}/api/order/place`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (codResponse.data.success) {
            for (const item of orderItems) {
              const inventoryPayload = {
                productId: item._id,
                size: item.size,
                quantity: item.quantity,
              };
              await axios.post(
                `${BackendURL}/api/product/update-inventory`,
                inventoryPayload,
                { headers: { Authorization: `Bearer ${token}` } }
              );
            }
            setCartItems({});
            navigate("/order");
          } else {
            toast.error(codResponse.data.message);
          }
          break;

        case "stripe":
          const stripeResponse = await axios.post(
            `${BackendURL}/api/order/stripe`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (stripeResponse.data.success) {
            window.location.replace(stripeResponse.data.session_url);
          } else {
            toast.error(stripeResponse.data.message);
          }
          break;

        case "razorpay":
          toast.error("Razorpay payment is currently unavailable");
          break;

        default:
          break;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold shadow-lg">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900 hidden sm:inline">
                Cart
              </span>
            </div>
            <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-green-500 to-orange-500"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-orange-200">
                2
              </div>
              <span className="text-sm font-semibold text-orange-600 hidden sm:inline">
                Checkout
              </span>
            </div>
            <div className="w-12 sm:w-20 h-0.5 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                3
              </div>
              <span className="text-sm font-semibold text-gray-400 hidden sm:inline">
                Complete
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-slide-in-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Delivery Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Please provide your shipping details
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      type="text"
                      placeholder="John"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      type="text"
                      placeholder="Doe"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    type="email"
                    placeholder="john.doe@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Street */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    type="text"
                    placeholder="123 Main Street, Apt 4B"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      type="text"
                      placeholder="New York"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State / Province *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      type="text"
                      placeholder="NY"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Zip and Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Zip Code *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      type="text"
                      placeholder="10001"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      type="text"
                      placeholder="United States"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-slide-in-left animation-delay-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Payment Method
                  </h2>
                  <p className="text-sm text-gray-500">
                    Select your preferred payment option
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Stripe */}
                <div
                  onClick={() => setMethod("stripe")}
                  className={`relative overflow-hidden cursor-pointer rounded-xl border-2 transition-all duration-300 ${
                    method === "stripe"
                      ? "border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          method === "stripe"
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300"
                        }`}
                      >
                        {method === "stripe" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={assets.stripe_logo}
                          alt="Stripe"
                          className="h-6"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          Credit / Debit Card
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center">
                          VISA
                        </div>
                        <div className="w-8 h-5 bg-orange-600 rounded text-white text-[8px] font-bold flex items-center justify-center">
                          MC
                        </div>
                      </div>
                    </div>
                  </div>
                  {method === "stripe" && (
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400 to-transparent opacity-20 blur-2xl"></div>
                  )}
                </div>

                {/* Razorpay */}
                <div
                  onClick={() => setMethod("razorpay")}
                  className={`relative overflow-hidden cursor-pointer rounded-xl border-2 transition-all duration-300 ${
                    method === "razorpay"
                      ? "border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          method === "razorpay"
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300"
                        }`}
                      >
                        {method === "razorpay" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={assets.razorpay_logo}
                          alt="Razorpay"
                          className="h-6"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          UPI / Wallets
                        </span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-semibold">
                        Unavailable
                      </span>
                    </div>
                  </div>
                  {method === "razorpay" && (
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400 to-transparent opacity-20 blur-2xl"></div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setMethod("cod")}
                  className={`relative overflow-hidden cursor-pointer rounded-xl border-2 transition-all duration-300 ${
                    method === "cod"
                      ? "border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          method === "cod"
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300"
                        }`}
                      >
                        {method === "cod" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          Cash on Delivery
                        </span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full font-semibold">
                        Recommended
                      </span>
                    </div>
                  </div>
                  {method === "cod" && (
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400 to-transparent opacity-20 blur-2xl"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6 animate-slide-in-right">
              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">
                  Order Summary
                </h3>
                <CartTotal />
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h4 className="font-bold text-gray-900">Secure Checkout</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your payment information is encrypted and secure. We never store
                  your card details.
                </p>
              </div>

              {/* Need Help */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Need help?{" "}
                  <a
                    href="/contact"
                    className="text-orange-600 font-semibold hover:text-orange-700 underline"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
};

export default PlaceOrder;