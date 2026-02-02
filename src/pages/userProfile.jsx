import React, { useContext, useEffect, useState } from "react";
import {
  User,
  ShoppingBag,
  Heart,
  CreditCard,
  MapPin,
  Star,
  Gift,
  Settings,
  LogOut,
  X,
  Save,
} from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { BackendURL, token, setToken } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const navigate = useNavigate();

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${BackendURL}/api/users/user_profile`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.UserDetails.length > 0) {
        setUser(response.data.UserDetails[0]);
        setEditName(response.data.UserDetails[0].name);
        setEditEmail(response.data.UserDetails[0].email);
      }
      const orderData = response.data.UserDetails.slice(1);
      setOrders(orderData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditSubmit = async () => {
    try {
      const res = await axios.put(
        `${BackendURL}/api/users/update_profile`,
        { name: editName, email: editEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.updatedUser);
      setEditMode(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusProps = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return { text: "Delivered", color: "text-green-600" };
      case "out for delivery":
        return { text: "Out for Delivery", color: "text-orange-600" };
      case "order placed":
        return { text: "Order Placed", color: "text-gray-600" };
      case "packing":
        return { text: "Packing", color: "text-yellow-600" };
      case "shipped":
        return { text: "Shipped", color: "text-indigo-600" };
      case "in transit":
        return { text: "In Transit", color: "text-blue-600" };
      default:
        return { text: status, color: "text-gray-600" };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="bg-blue-600 p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center ring-4 ring-blue-400/30 shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                {editMode ? (
                  <div>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-xl font-semibold text-white bg-blue-500 px-2 py-1 rounded"
                    />
                    <input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="block mt-2 text-sm text-white bg-blue-500 px-2 py-1 rounded"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-white">
                      {user.name}
                    </h1>
                    <p className="text-blue-100 text-sm mt-1">
                      {user.createdAt
                        ? `Member since ${new Date(
                            user.createdAt
                          ).getFullYear()}`
                        : "Premium Member"}
                    </p>
                  </>
                )}
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-blue-100 text-sm">4.8 Reviews</span>
                  </div>
                  <div className="text-blue-200 text-sm">•</div>
                  <div className="text-blue-100 text-sm">
                    {orders.length} Orders
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {editMode ? (
                  <>
                    <button
                      onClick={handleEditSubmit}
                      className="p-2 bg-green-500 hover:bg-green-400 rounded-lg transition-colors"
                    >
                      <Save className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="p-2 bg-red-500 hover:bg-red-400 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      className="p-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors"
                    >
                      <Settings className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shopping Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.length}
                  </p>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
                  <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">43</p>
                  <p className="text-gray-600 text-sm">Wishlist Items</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center">
                  <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">89</p>
                  <p className="text-gray-600 text-sm">Reviews Given</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                  <Gift className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">2,450</p>
                  <p className="text-gray-600 text-sm">Reward Points</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => {
                  const statusProps = getStatusProps(order.status);
                  return (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">
                            Order #{order._id.slice(-5).toUpperCase()}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {order.items.length} item
                            {order.items.length > 1 ? "s" : ""} • $
                            {order.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`${statusProps.color} text-sm font-medium`}
                        >
                          {statusProps.text}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {formatDate(order.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-900 text-sm font-medium">
                      {user.email}
                    </p>
                    <p className="text-gray-500 text-xs">Email Address</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-900 text-sm font-medium">
                      {orders.length > 0 && orders[0].address
                        ? `${orders[0].address.city}, ${orders[0].address.state} ${orders[0].address.zipCode}`
                        : "Add your address"}
                    </p>
                    <p className="text-gray-500 text-xs">Default Address</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-900 text-sm font-medium">
                      •••• •••• •••• 4532
                    </p>
                    <p className="text-gray-500 text-xs">Default Payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
