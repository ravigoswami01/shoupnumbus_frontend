import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="bg-gray-100 py-20">
      <div className="flex flex-col sm:flex-row justify-around gap-12 text-center text-xs sm:text-sm md:text-base text-gray-700 px-6 sm:px-12">
        
        {/* Exchange Policy */}
        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <img src={assets.exchange_icon} alt="Exchange Policy" className="w-14 mx-auto mb-4" />
          <p className="font-semibold text-lg text-gray-800">Easy Exchange Policy</p>
          <p className="text-gray-500 mt-2">Enjoy hassle-free exchange services with us.</p>
        </div>

        {/* Return Policy */}
        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <img src={assets.quality_icon} alt="Return Policy" className="w-14 mx-auto mb-4" />
          <p className="font-semibold text-lg text-gray-800">7 Days Return Policy</p>
          <p className="text-gray-500 mt-2">Return products within 7 days, no questions asked.</p>
        </div>

        {/* Customer Support */}
        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <img src={assets.support_img} alt="Customer Support" className="w-14 mx-auto mb-4" />
          <p className="font-semibold text-lg text-gray-800">Best Customer Support</p>
          <p className="text-gray-500 mt-2">Our 24/7 support team is always here to help you.</p>
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;