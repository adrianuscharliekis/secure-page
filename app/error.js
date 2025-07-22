// app/error.js
"use client"; // This is a requirement for error components

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    // like Sentry, LogRocket, etc.
    console.error(error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h2>Something went wrong!</h2>
      <p style={{color: '#666'}}>
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        style={{
          padding: '10px 20px',
          marginTop: '20px',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#0070f3',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  );
}