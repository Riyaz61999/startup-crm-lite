// Import React library
import React from 'react';
// Import BrowserRouter from react-router-dom to enable routing functionality across the entire app
import { BrowserRouter } from 'react-router-dom';
// Import Toaster component for notification banners
import { Toaster } from 'react-hot-toast';
// Import the global CSS file which includes Tailwind directives
import './index.css';
// Import the Sidebar component to display navigation on the left
import Sidebar from './components/Sidebar';
// Import the centralized routing configuration from the routes folder
import AppRoutes from './routes';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';

const AppContent = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex min-h-screen bg-background text-text-dark font-sans transition-colors duration-200">
      {/* Render the Sidebar component on the left side */}
      <Sidebar />
      
      {/* Main content area dynamically takes up the remaining horizontal space using flex-1 */}
      <main className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        {/* Internal container to handle scrolling independently if needed */}
        <div className="flex-1 overflow-y-auto">
          {/* Render the dynamically imported routes based on the current URL */}
          <AppRoutes />
        </div>
      </main>
    </div>
  );
};

// Define the root App component
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0F172A',
              color: '#FFFFFF',
              borderRadius: '0.75rem',
              padding: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          }}
        />
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

// Export the App component as the main entry point for the application UI
export default App;