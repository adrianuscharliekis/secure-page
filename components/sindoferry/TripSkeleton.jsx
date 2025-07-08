// components/sindoferry/TripSkeleton.jsx
import React from "react";

const TripSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      {/* Two small pill-shaped filters */}
      <div className="flex gap-3">
        <div className="w-28 h-8 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
        <div className="w-32 h-8 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
      </div>

      {/* Multiple trip cards */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-36 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
        />
      ))}
    </div>
  );
};

export default TripSkeleton;
