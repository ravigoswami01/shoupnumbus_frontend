import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Package, Shield, Truck, RefreshCw } from "lucide-react";

const Cart = () => {
  const { cartItems, products, currency, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [isUpdating, setIsUpdating] = useState({});

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const handleQuantityChange = (itemId, size, newQuantity, index) => {
    setIsUpdating({ ...isUpdating, [index]: true });
    
    // Simulate API delay for better UX
    setTimeout(() => {
      if (newQuantity <= 0) {
        updateQuantity(itemId, size, 0);
      } else {
        updateQuantity(itemId, size, newQuantity);
      }
      setIsUpdating({ ...isUpdating, [index]: false });
    }, 300);
  };

  const getProductById = (id) => {
    return products.find((product) => product._id === id);
  };

  const calculateItemTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  const features = [
    { icon: <Shield className="w-5 h-5" />, text: "Secure Payment", color: "text-green-500" },
    { icon: <Truck className="w-5 h-5" />, text: "Free Delivery", color: "text-blue-500" },
    { icon: <Package className="w-5 h-5" />, text: "Easy Returns", color: "text-purple-500" },
    { icon: <RefreshCw className="w-5 h-5" />, text: "30-Day Exchange", color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Your Shopping Cart
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <ShoppingBag className="w-5 h-5" />
                <span>{cartData.length} items in cart</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartData.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Cart Items ({cartData.length})
                  </h2>
                  <button
                    onClick={() => {
                      // Clear all items
                      cartData.forEach(item => {
                        updateQuantity(item._id, item.size, 0);
                      });
                    }}
                    className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>

                <div className="space-y-4">
                  {cartData.map((item, index) => {
                    const product = getProductById(item._id);
                    if (!product) return null;

                    return (
                      <div
                        key={`${item._id}-${item.size}-${index}`}
                        className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                      >
                        {/* Loading Overlay */}
                        {isUpdating[index] && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        )}

                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="relative">
                            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={product?.image?.[0] || assets.placeholder}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            {/* Quantity Badge */}
                            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                              {item.quantity}
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                  {product.description}
                                </p>
                              </div>
                              <button
                                onClick={() => handleQuantityChange(item._id, item.size, 0, index)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              {/* Size and Price */}
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Size:</span>
                                  <span className="px-3 py-1 bg-gray-100 text-gray-900 font-medium rounded-full text-sm">
                                    {item.size === "1" ? "One Size" : item.size}
                                  </span>
                                </div>
                                <div className="text-lg font-bold text-gray-900">
                                  {currency}
                                  {calculateItemTotal(product.price, item.quantity)}
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.size, Math.max(0, item.quantity - 1), index)}
                                  disabled={item.quantity <= 1 || isUpdating[index]}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                
                                <div className="w-12 text-center">
                                  <span className="font-semibold text-gray-900">
                                    {item.quantity}
                                  </span>
                                </div>
                                
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.size, item.quantity + 1, index)}
                                  disabled={isUpdating[index]}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Unit Price */}
                            <div className="mt-2 text-sm text-gray-500">
                              {currency}
                              {product.price.toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Trust Features */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${feature.color.replace('text-', 'bg-')} bg-opacity-10`}>
                          {feature.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>
                  
                  <div className="space-y-4">
                    <CartTotal />
                  </div>

                  <div className="mt-8 space-y-4">
                    <button
                      onClick={() => navigate("/Place-order")}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => navigate("/")}
                      className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>

                {/* Secure Payment */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">
                      Secure Payment
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Your payment information is encrypted and secure.
                  </p>
                  <div className="flex items-center gap-4">
                    {["visa", "mastercard", "paypal", "applepay"].map((method) => (
                      <div
                        key={method}
                        className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center"
                      >
                        <span className="text-xs font-bold text-gray-600 uppercase">
                          {method}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Need Help */}
                <div className="mt-6 p-6 bg-gray-50 rounded-2xl">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Need Help?
                  </h3>
                  <div className="space-y-3">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-left">
                      Shipping Information
                    </button>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-left">
                      Return Policy
                    </button>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-left">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;