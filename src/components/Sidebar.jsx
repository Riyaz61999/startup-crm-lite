// Import React to build the component
import React, { useState } from 'react';
// Import NavLink from react-router-dom which provides active styling capabilities
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Menu, X, UserCircle, LogOut } from 'lucide-react';
import DarkModeToggle from './common/DarkModeToggle';
import { useAuth } from '../context/AuthContext';

// Navigation items configuration
const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

// Define the Sidebar component
const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

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

        {/* Drawer footer with User Profile and Dark Mode Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-4 transition-colors duration-200">
          {user && (
            <div className="flex flex-col gap-2">
              <div 
                className="flex items-center gap-3 cursor-pointer text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <UserCircle className="w-8 h-8" />
                <span className="font-semibold text-sm">{user.username || 'Admin'}</span>
              </div>
              
              {isProfileOpen && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm space-y-2 mb-2 shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">Email</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium truncate">{user.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">Mobile</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{user.mobileNumber}</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-1.5 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Appearance</span>
            <DarkModeToggle />
          </div>
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

        {/* Desktop Sidebar footer with User Profile and Dark Mode Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-4 transition-colors duration-200">
          {user && (
            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <UserCircle className="w-8 h-8 shrink-0 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-sm truncate">{user.username || 'Admin'}</span>
              </div>
              
              {isProfileOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 text-sm space-y-3 z-50">
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">Email</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium truncate" title={user.email}>{user.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">Mobile</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{user.mobileNumber}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 py-2 rounded-lg transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Appearance</span>
            <DarkModeToggle />
          </div>
        </div>
      </aside>
    </>
  );
};

// Export Sidebar as the default export
export default Sidebar;
