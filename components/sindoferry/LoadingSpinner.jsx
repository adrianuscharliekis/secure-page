import React from 'react';

/**
 * A modern, general-purpose loading spinner component.
 * It displays a centered modal overlay with a clean, animated spinner.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls the visibility of the spinner modal.
 * @param {string} [props.text] - Optional text to display below the spinner.
 */
const LoadingSpinner = ({ isOpen, text }) => {
  // Render nothing if the spinner is not set to be open.
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* The style tag is included here for self-containment. 
          In a real app, this would likely go in a global CSS file. */}
      <style>
        {`
          .spinner {
            width: 56px; /* 14 * 4 */
            height: 56px; /* 14 * 4 */
            border-radius: 50%;
            padding: 6px;
            background: 
              /* Changed spinner color from blue to gray */
              conic-gradient(from 180deg at 50% 50%, rgba(255, 255, 255, 0) 0deg, #6B7280 360deg) 
              content-box, 
              linear-gradient(rgba(156, 163, 175, 0.4) 0%, rgba(156, 163, 175, 0.4) 100%) 
              border-box;
            -webkit-mask:
              linear-gradient(#fff 0 0) content-box,
              linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(1turn);
            }
          }
        `}
      </style>

      {/* Main container: a fixed overlay to cover the screen. Changed opacity for a darker overlay. */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* The Spinner */}
          <div className="spinner"></div>

          {/* Optional Loading Text */}
          {text && (
            <p className="text-lg font-medium text-white shadow-lg">{text}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default LoadingSpinner;
