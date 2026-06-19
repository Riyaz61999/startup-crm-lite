// Import React and the lazy/Suspense utilities for code splitting and lazy loading components
import React, { lazy, Suspense } from 'react';
// Import routing components from react-router-dom
import { Routes, Route } from 'react-router-dom';

// Dynamically import the page components using React.lazy
// This ensures that the JavaScript for these pages is only loaded when they are visited
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Define the AppRoutes component which contains all the routing logic
const AppRoutes = () => {
  return (
    // Wrap routes in Suspense to provide a fallback UI (e.g., a loading spinner) while lazy components are fetched
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-xl text-gray-600 dark:text-gray-300">Loading page...</div>}>
      {/* Routes container that matches the current URL to the correct Route */}
      <Routes>
        {/* Define the root route mapping to the Dashboard component */}
        <Route path="/" element={<Dashboard />} />
        {/* Define the /leads route mapping to the Leads component */}
        <Route path="/leads" element={<Leads />} />
        {/* Define the /analytics route mapping to the Analytics component */}
        <Route path="/analytics" element={<Analytics />} />
        {/* Define a catch-all route (using '*') that renders the NotFound component for unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

// Export AppRoutes to be used in App.jsx
export default AppRoutes;
