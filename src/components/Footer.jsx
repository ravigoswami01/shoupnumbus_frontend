import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="bg-slate-900 text-white py-16 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:grid grid-cols-[2fr_1fr_1fr] gap-12 my-10 text-sm px-6 sm:px-12 md:px-20">
          
          {/* Company Info Section */}
          <div className="space-y-6">
            <div className="group cursor-pointer">
              <img 
                src={assets.logo} 
                alt="Logo" 
                className="mb-6 w-44 filter brightness-0 invert transition-all duration-300 group-hover:opacity-80" 
              />
            </div>
            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              Delivering exceptional digital solutions with precision and reliability. 
              We focus on creating robust, scalable products that drive business success 
              through innovative technology and strategic thinking.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 pt-4">
              <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 cursor-pointer">
                <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </div>
              <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 cursor-pointer">
                <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 cursor-pointer">
                <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-6 relative">
              Services
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-slate-600 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {['Customer Support', 'Retail Services', 'Secure Payment Processing', 'Order Tracking', 'Returns & Exchanges'].map((item, index) => (
                <li key={index} className="group cursor-pointer">
                  <span className="text-slate-400 hover:text-white transition-all duration-300 relative flex items-center text-sm">
                    <span className="w-0 h-px bg-slate-500 transition-all duration-300 group-hover:w-3 mr-0 group-hover:mr-2"></span>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-6 relative">
              Contact Us
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-slate-600 rounded-full"></div>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 text-sm">+1 (123) 456-7890</span>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 text-sm">support@yourstore.com</span>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 text-sm">123 Commerce Street, Suite 100<br />Business District, NY 10001</span>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 text-sm">Monday–Friday<br />9:00 AM–6:00 PM EST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 mb-8 px-6 sm:px-12 md:px-20">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-3">Stay Informed</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm">
              Subscribe to receive updates on new features, products, and company news.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2.5 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm"
              />
              <button className="px-6 py-2.5 bg-slate-700 border border-slate-600 text-white font-medium rounded-md hover:bg-slate-600 hover:border-slate-500 transition-all duration-300 text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-800 mt-12 relative z-10">
        <div className="container mx-auto px-6 sm:px-12 md:px-20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-500 text-xs text-center md:text-left">
              © 2025 YourStore. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-xs text-slate-500">
              <span className="hover:text-slate-400 transition-colors duration-300 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-400 transition-colors duration-300 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 transition-colors duration-300 cursor-pointer">Cookie Policy</span>
            </div>
          </div>
          <div className="text-center mt-3">
            <p className="text-xs text-slate-600">
              Crafted by <span className="text-slate-500 font-medium hover:text-slate-400 transition-colors duration-300 cursor-pointer">Ravi</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;