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
        ? 'bg-primary/10 dark:bg-primary/15 text-primary font-bold'
        : 'text-text-gray hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-text-dark dark:hover:text-text-dark'
    }`;

  const closeMobile = () => setIsMobileOpen(false);

  // Return the JSX structure for the Sidebar
  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card dark:bg-background border-b border-border px-4 py-3 flex items-center justify-between transition-colors duration-200">
        <div className="text-lg font-bold tracking-wider text-primary">Startup CRM</div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg text-text-gray hover:bg-primary/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
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
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-card dark:bg-background border-r border-border flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="text-xl font-bold tracking-wider text-primary">Startup CRM</div>
          <button
            onClick={closeMobile}
            className="p-2 rounded-lg text-text-gray hover:bg-primary/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
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
        <div className="p-4 border-t border-border flex flex-col gap-4 transition-colors duration-200">
          {user && (
            <div className="flex flex-col gap-2">
              <div 
                className="flex items-center gap-3 cursor-pointer text-text-dark hover:text-primary"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <UserCircle className="w-8 h-8" />
                <span className="font-semibold text-sm">{user.username || 'Admin'}</span>
              </div>
              
              {isProfileOpen && (
                <div className="bg-background dark:bg-card rounded-lg p-3 text-sm space-y-2 mb-2 shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-text-gray text-xs">Email</span>
                    <span className="text-text-dark font-medium truncate">{user.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-gray text-xs">Mobile</span>
                    <span className="text-text-dark font-medium">{user.mobileNumber}</span>
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
            <span className="text-sm font-medium text-text-gray">Appearance</span>
            <DarkModeToggle />
          </div>
        </div>
      </div>

      {/* Desktop/Tablet sidebar — hidden on mobile */}
      <aside className="hidden md:flex w-64 bg-card dark:bg-background text-text-dark border-r border-border flex-col min-h-screen shadow-md dark:shadow-none transition-colors duration-200 shrink-0">
        {/* Header section with brand name/logo */}
        <div className="p-6 border-b border-border transition-colors duration-200">
          <div className="text-2xl font-bold tracking-wider text-center text-primary">Startup CRM</div>
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
        <div className="p-4 border-t border-border flex flex-col gap-4 transition-colors duration-200">
          {user && (
            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer p-2 rounded-xl text-text-dark hover:bg-primary/10 transition-colors"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <UserCircle className="w-8 h-8 shrink-0 text-primary" />
                <span className="font-semibold text-sm truncate">{user.username || 'Admin'}</span>
              </div>
              
              {isProfileOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-card border border-border rounded-xl p-4 shadow-xl text-sm space-y-3 z-50">
                  <div className="flex flex-col">
                    <span className="text-text-gray text-xs">Email</span>
                    <span className="text-text-dark font-medium truncate" title={user.email}>{user.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-gray text-xs">Mobile</span>
                    <span className="text-text-dark font-medium">{user.mobileNumber}</span>
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
            <span className="text-sm font-medium text-text-gray">Appearance</span>
            <DarkModeToggle />
          </div>
        </div>
      </aside>
    </>
  );
};

// Export Sidebar as the default export
export default Sidebar;
