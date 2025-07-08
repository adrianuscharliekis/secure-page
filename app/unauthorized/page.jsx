// app/unauthorized/page.tsx or wherever you route unauthorized access
import React from "react";
import { Lock } from "lucide-react";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-6 text-center">
      <Lock className="w-16 h-16 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Unauthorized</h1>
      <p className="text-gray-600 mb-6">
        You do not have permission to access this page.
      </p>
    </div>
  );
};

export default UnauthorizedPage;
