// Import React to build the component
import React from 'react';
// Import NavLink from react-router-dom which provides active styling capabilities
import { NavLink } from 'react-router-dom';

// Define the Sidebar component
const Sidebar = () => {
  // A helper function to determine the classes for each navigation link based on its active state
  const getLinkClasses = ({ isActive }) => 
    // Apply block display for vertical layout and Tailwind classes for styling and hover effects
    `block px-4 py-3 rounded transition-colors duration-200 ${
      isActive ? 'bg-gray-800 text-blue-400 font-bold' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  // Return the JSX structure for the Sidebar
  return (
    // Use an <aside> element for semantic sidebar structure, with fixed width and full height
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen shadow-md">
      {/* Header section with brand name/logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="text-2xl font-bold tracking-wider text-center">Startup CRM</div>
      </div>
      
      {/* Navigation section using a column flexbox with vertical spacing */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {/* Dashboard NavLink mapping to the root path */}
        <NavLink to="/" className={getLinkClasses} end>
          Dashboard
        </NavLink>
        {/* Leads NavLink mapping to the /leads path */}
        <NavLink to="/leads" className={getLinkClasses}>
          Leads
        </NavLink>
        {/* Analytics NavLink mapping to the /analytics path */}
        <NavLink to="/analytics" className={getLinkClasses}>
          Analytics
        </NavLink>
      </nav>
    </aside>
  );
};

// Export Sidebar as the default export
export default Sidebar;
