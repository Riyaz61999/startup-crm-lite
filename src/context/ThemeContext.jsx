import React, { createContext, useEffect, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

/**
 * Context object for the application-wide theme (light/dark) system.
 *
 * @type {React.Context<{
 *   isDarkMode: boolean,
 *   toggleTheme: () => void
 * } | undefined>}
 */
const ThemeContext = createContext(undefined);

/** localStorage key used to persist the theme preference. */
const THEME_STORAGE_KEY = 'startup-crm-theme';

/**
 * Provider component that wraps the application (or a subtree) to supply
 * the current theme state and a toggle function through React Context.
 *
 * Uses `useLocalStorage` under the hood — the dark-mode preference is
 * automatically persisted to `localStorage` under the key "startup-crm-theme".
 *
 * When dark mode is enabled, the CSS class `dark` is applied to
 * `document.documentElement` (<html>), enabling Tailwind's dark-mode
 * variant selectors and any custom dark-mode CSS rules.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that need access to theme context.
 * @returns {React.JSX.Element} The provider-wrapped children.
 */
const ThemeProvider = ({ children }) => {
  /**
   * Dark-mode flag backed by localStorage via the useLocalStorage hook.
   * Defaults to `false` (light mode) when no preference is stored.
   *
   * @type {[boolean, (value: boolean | ((prev: boolean) => boolean)) => void]}
   */
  const [isDarkMode, setIsDarkMode] = useLocalStorage(THEME_STORAGE_KEY, false);

  /**
   * Synchronize the `dark` class on <html> whenever `isDarkMode` changes.
   * The persistence side is already handled by `useLocalStorage`, so this
   * effect only manages the DOM class.
   */
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  /**
   * Toggle between dark mode and light mode.
   * Flips the `isDarkMode` boolean — useLocalStorage persists it automatically.
   */
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, [setIsDarkMode]);

  /** @type {React.ContextType<typeof ThemeContext>} */
  const contextValue = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to consume theme context.
 * Must be called inside a component wrapped by `<ThemeProvider>`.
 *
 * @returns {{ isDarkMode: boolean, toggleTheme: () => void }}
 * @throws {Error} If used outside of a ThemeProvider.
 */
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      'useTheme() must be used within a <ThemeProvider>. ' +
      'Wrap your component tree with <ThemeProvider> to provide theme context.'
    );
  }
  return context;
};

export { ThemeContext, ThemeProvider, useTheme };
