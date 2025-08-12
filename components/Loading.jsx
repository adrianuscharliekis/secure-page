import { Loader2 } from "lucide-react";
import React from "react";

const Loading = ({ text = "Memuat data..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 z-50">
      {/* Spinner */}
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
        <p className="text-lg font-semibold text-sky-700 animate-pulse">
          {text}
        </p>
      </div>

      {/* Optional decorative pulse ring */}
      <div className="absolute w-32 h-32 border-4 border-sky-300 rounded-full animate-ping opacity-20"></div>
    </div>
  );
};

export default Loading;
