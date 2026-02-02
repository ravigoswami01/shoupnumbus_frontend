import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <p className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-wide">
        {text1} <span className="text-black">{text2}</span>
      </p>
      <div className="w-16 sm:w-24 h-1 bg-black rounded-full"></div>
    </div>
  );
};

export default Title;
