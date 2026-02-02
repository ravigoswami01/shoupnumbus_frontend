import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { toast } from "react-toastify";


const Order = () => {
  const { currency, BackendURL, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnLoading, setReturnLoading] = useState(false);

  const fetchOrderData = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${BackendURL}/api/order/userorder`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        const allOrderItems = response.data.orders.flatMap((order) => {
          if (!order.items.length) return [];
          return order.items.map((item) => ({
            ...item,
            orderId: order._id,
            status: order.status,
            payment: order.payment,
            date: order.date,
            amout: order.amount,
            paymentMethod: order.paymentMethode,
            canReturn: order.status === "Delivered" && !item.returnRequested,
          }));
        });

        setOrderData(allOrderItems.reverse());
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  const handleReturnSubmit = async () => {
  if (!selectedItem || returnReason.trim() === "") {
    toast.error("Please select a product and enter a reason.");
    return;
  }

  setReturnLoading(true);

  try {
    await axios.post(
      `${BackendURL}/api/users/return_product/${selectedItem._id}`,
      { reason: returnReason },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Return request submitted successfully");

    setOrderData((prev) =>
      prev.map((item) =>
        item._id === selectedItem._id
          ? {
              ...item,
              returnRequested: true,
              returnStatus: "Requested",
              canReturn: false,
            }
          : item
      )
    );

    setReturnModalOpen(false);
    setReturnReason("");
    setSelectedItem(null);

  } catch (error) {
    const message =
      error?.response?.data?.message ||  
      error?.message ||                  
      "Something went wrong";

    toast.error(message);
    console.error("Return request failed:", error);

  } finally {
    setReturnLoading(false);
  }
};


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "shipped":
        return "bg-blue-500";
      case "processing":
        return "bg-yellow-500";
      case "return requested":
        return "bg-purple-500";
      default:
        return "bg-green-500";
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [token]);

  return (
    <div className="border-t pt-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="text-2xl">
            <Title text1={"MY"} text2={"ORDER"} />
          </div>
        </div>

        {returnModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                    Return
                </h3>
                <button
                  onClick={() => {
                    setReturnModalOpen(false);
                    setReturnReason("");
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <img
                    src={selectedItem?.image?.[0] || ""}
                    alt={selectedItem?.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {selectedItem?.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {currency}
                      {selectedItem?.amout}.00
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for return
                </label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please explain why you're returning this item..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setReturnModalOpen(false);
                    setReturnReason("");
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReturnSubmit}
                  disabled={returnReason.trim() === "" || returnLoading}
                  className={`px-4 py-2 rounded-lg text-white font-medium ${
                    returnReason.trim() === "" || returnLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {returnLoading ? "Processing..." : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          {orderData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No orders found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orderData.map((item, index) => (
                <div
                  key={index}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-start gap-6 text-sm">
                      <img
                        className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg border border-gray-200"
                        src={item.image?.[0] || ""}
                        alt={item.name}
                      />
                      <div className="flex-1">
                        <p className="sm:text-base font-medium text-gray-900 mb-2">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-base text-gray-600">
                          <p className="font-semibold text-blue-600">
                            {currency}
                            {item.amout}.00
                          </p>
                          <p>
                            Qty:{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </p>
                          <p>
                            Size:{" "}
                            <span className="font-medium">
                              {item.size || "-"}
                            </span>
                          </p>
                        </div>
                        <div className="mt-3 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Date:</span>{" "}
                            <span className="text-gray-500">
                              {new Date(item.date).toDateString()}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Payment Method:</span>{" "}
                            <span className="text-gray-500 capitalize">
                              {item.paymentMethod}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/2 flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <p
                          className={`min-w-2 h-2 rounded-full ${getStatusColor(
                            item.status
                          )}`}
                        ></p>
                        <p className="text-sm md:text-base font-medium text-gray-700">
                          {item.status || "Pending"}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={fetchOrderData}
                          className="border border-gray-300 px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Track your Order
                        </button>

                        {item.canReturn && (
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setReturnModalOpen(true);
                            }}
                            className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 text-sm font-medium rounded-lg hover:bg-orange-100 transition-colors"
                          >
                          Return
                          </button>
                        )}

                        {item.returnRequested && (
                          <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 text-sm font-medium rounded-lg text-center">
                            Return Requested
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
