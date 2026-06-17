// Import React to create the functional component
import React from 'react';

// Define the Analytics component
const Analytics = () => {
  // Render the Analytics page content
  return (
    // Wrapper div providing padding around the content
    <div className="p-8">
      {/* Heading for the Analytics section with specific styling */}
      <h1 className="text-3xl font-bold mb-4">Analytics</h1>
      {/* Descriptive text explaining the purpose of this page */}
      <p>View your performance metrics, conversion rates, and other vital statistics here.</p>
    </div>
  );
};

// Export the Analytics component as default to enable dynamic imports
export default Analytics;
