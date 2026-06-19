// Import React to build the component
import React, { useState } from 'react';
// Import NavLink from react-router-dom which provides active styling capabilities
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Menu, X } from 'lucide-react';
import DarkModeToggle from './common/DarkModeToggle';

// Navigation items configuration
const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

// Define the Sidebar component
const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // A helper function to determine the classes for each navigation link based on its active state
  const getLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 min-h-[44px] ${
      isActive
        ? 'bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
    }`;

  const closeMobile = () => setIsMobileOpen(false);

  // Return the JSX structure for the Sidebar
  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between transition-colors duration-200">
        <div className="text-lg font-bold tracking-wider text-blue-600 dark:text-white">Startup CRM</div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile slide-over drawer backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-over drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="text-xl font-bold tracking-wider text-blue-600 dark:text-white">Startup CRM</div>
          <button
            onClick={closeMobile}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={getLinkClasses}
              end={item.end}
              onClick={closeMobile}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Drawer footer with Dark Mode Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between transition-colors duration-200">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Appearance</span>
          <DarkModeToggle />
        </div>
      </div>

      {/* Desktop/Tablet sidebar — hidden on mobile */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-800 flex-col min-h-screen shadow-md dark:shadow-none transition-colors duration-200 shrink-0">
        {/* Header section with brand name/logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
          <div className="text-2xl font-bold tracking-wider text-center text-blue-600 dark:text-white">Startup CRM</div>
        </div>

        {/* Navigation section using a column flexbox with vertical spacing */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={getLinkClasses} end={item.end}>
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Dark Mode Toggle at the bottom */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between transition-colors duration-200">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Appearance</span>
          <DarkModeToggle />
        </div>
      </aside>
    </>
  );
};

// Export Sidebar as the default export
export default Sidebar;
