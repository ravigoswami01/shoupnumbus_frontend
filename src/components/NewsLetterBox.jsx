import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
// /import NewsLetterBox from '../components/NewsLetterBox';

const NewsLetterBox  = () => {
  return (
    <div className="bg-white text-gray-700">
      {/* Top Section */}
      <div className="text-2xl text-center pt-10 border-t border-gray-200">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      {/* Image & Description Section */}
      <div className="my-12 px-4 sm:px-8 flex flex-col md:flex-row gap-10 items-center">
        <img
          className="w-full md:max-w-[450px] rounded-xl shadow-lg"
          src={assets.about_img}
          alt="About Us"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 text-sm sm:text-base">
          <p>
            <span className="font-medium text-gray-800">50 Best Discovery</span>, a database representing the
            very best of hospitality, operates as an extension of the annual 50 Best rankings of restaurants,
            bars, and hotels. The venues featured on 50 Best Discovery have all received votes from the experts
            who create these rankings.
          </p>
          <p>
            This digital collection includes not only elite establishments but also local favorites and emerging
            talents across the globe.
          </p>
          <b className="text-lg text-gray-800 mt-4">Our Mission</b>
          <p>
            We aim to inspire and connect food and drink lovers with the most exceptional experiences around the
            world — from hidden gems to world-renowned names.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="text-xl text-center py-6 bg-gray-50">
        <Title text1={" Best"} text2={"Choose Us"} />
      </div>

      {/* Features Cards */}
      <div className="px-4 sm:px-8 flex flex-col md:flex-row gap-6 mb-20">
        <div className="bg-white border rounded-xl shadow-md px-8 py-10 flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-800">Quality Assurance</h3>
          <p className="text-gray-600">
            Every establishment listed goes through strict expert reviews, ensuring a trustworthy and high-quality experience.
          </p>
        </div>

        <div className="bg-white border rounded-xl shadow-md px-8 py-10 flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-800">Convenience</h3>
          <p className="text-gray-600">
            We help you make the right dining decision easily, whether you're exploring a new city or rediscovering your own.
          </p>
        </div>

        <div className="bg-white border rounded-xl shadow-md px-8 py-10 flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-800">Exceptional Service</h3>
          <p className="text-gray-600">
            Our platform and recommendations prioritize your experience with accurate insights and seamless interactions.
          </p>
        </div>
      </div>
     
    </div>
    
    
  );
};

export default NewsLetterBox;