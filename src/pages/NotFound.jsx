// Import the React library
import React from 'react';
// Import the Link component from react-router-dom to allow client-side navigation back home
import { Link } from 'react-router-dom';

// Define the NotFound component, displayed when a user visits an unknown route
const NotFound = () => {
  // Return the UI for the 404 page
  return (
    // Flexbox container to center content on the screen
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Display a large 404 error code */}
      <h1 className="text-6xl font-bold text-red-500 dark:text-red-400 mb-4">404</h1>
      {/* Provide a user-friendly error message */}
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">Oops! The page you are looking for does not exist.</p>
      {/* A link that navigates the user back to the Dashboard */}
      <Link to="/" className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200">
        Go Back Home
      </Link>
    </div>
  );
};

// Export the NotFound component as the default export
export default NotFound;
