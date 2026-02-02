import React, { useState, useContext, useRef } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Contact = () => {
  const { token, BackendURL } = useContext(ShopContext);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  const handleInquiryClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };
    try {
      const response = await axios.post(`${BackendURL}/api/contact/create`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Inquiry submitted successfully!");
      formRef.current.reset();
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-16 lg:px-32 py-3 pb-12 bg-gray-50">
      <div className="text-center border-t border-gray-300 pt-12">
        <Title text1="CONTACT" text2="US" />
      </div>

      <div className="mt-12 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
        <div className="w-full lg:max-w-xl flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Our Store</h2>
          <p className="text-gray-600 leading-relaxed">
            ShopNimbus Internet Private Limited, <br />
            Buildings Alyssa, Begonia & Clove <br />
            Embassy Tech Village, <br />
            Outer Ring Road, <br />
            Devarabeesanahalli Village, Bengaluru, 560103, <br />
            Karnataka, India
          </p>
          <p className="text-gray-600 text-lg">Phone: +91 7767 1238-4567</p>

          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Careers at Shop</h3>
            <p className="text-gray-600 leading-relaxed">
              We’re always looking for passionate, creative individuals to join our team. If you're interested in working with us, send your resume and details to
              <span className="font-medium text-black"> careers@yourstore.com</span>.
            </p>
          </div>

          <button
            onClick={handleInquiryClick}
            className="mt-6 border border-black px-6 py-3 rounded-md text-sm font-medium hover:bg-black hover:text-white transition-colors duration-300 w-max"
          >
            Send Inquiry
          </button>
        </div>

        <div className="w-full lg:w-[480px]">
          <img
            className="w-full rounded-xl shadow-xl object-cover"
            src={assets.contact_img}
            alt="Contact"
          />
        </div>
      </div>

      {showForm && (
        <div className="mt-12 bg-white p-6 shadow-lg rounded-xl transition-opacity duration-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-center">
            Get in Touch
          </h2>
          <form ref={formRef} className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
            <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Contact;
