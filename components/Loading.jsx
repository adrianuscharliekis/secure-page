import React from "react";

const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
};

export default Loading;
