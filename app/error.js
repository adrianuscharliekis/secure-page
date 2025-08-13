// app/error.js
"use client";

import { useEffect } from "react";

// An SVG icon component for a cleaner look
const ErrorIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props} // Pass through props like className
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);


export default function Error({ error, reset }) {
  useEffect(() => {
    // You can report the error to a service like Sentry, LogRocket, etc.
    console.error(error);
  }, [error]);

  return (
    // Main container for centering content
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center">
      
      <ErrorIcon className="mb-6 text-red-500" />

      <h1 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">
        Oops! Something Went Wrong
      </h1>

      <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-600">
        Sorry for the inconvenience. Our team has been notified. Please try again.
      </p>

      {/* The reset button with hover and active effects */}
      <button
        onClick={() => window.location.reload()}
        className="transform rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 active:scale-95"
      >
        Try Again
      </button>

      {/* Optional: Developer-only error details for easier debugging */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-10 w-full max-w-3xl overflow-x-auto rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm">
          <h2 className="mb-4 text-base font-semibold uppercase tracking-wider text-red-600">
            Developer Info
          </h2>
          <pre className="whitespace-pre-wrap break-words font-mono text-sm text-slate-800">
            {error.stack || error.toString()}
          </pre>
        </div>
      )} */}
    </div>
  );
}