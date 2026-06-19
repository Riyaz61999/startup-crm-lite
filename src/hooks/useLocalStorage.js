import { useState, useCallback } from 'react';

/**
 * Custom React hook that mirrors the `useState` API while automatically
 * persisting the value to `localStorage` under the given key.
 *
 * Features:
 * - On first render: reads and parses the stored JSON value, or falls back to `initialValue`.
 * - `setValue` updates React state AND writes to `localStorage` simultaneously.
 * - Gracefully handles JSON parse errors (returns `initialValue`).
 * - Gracefully handles `localStorage` being unavailable (e.g. private browsing, storage full).
 * - Works with any JSON-serializable data type: arrays, objects, strings, numbers, booleans.
 *
 * @template T
 * @param {string} key          - The localStorage key to read from / write to.
 * @param {T}      initialValue - The fallback value when no stored value exists or parsing fails.
 * @returns {[T, (value: T | ((prev: T) => T)) => void]} A stateful value and a setter function,
 *          identical in API to React's `useState`.
 *
 * @example
 * const [name, setName] = useLocalStorage('user-name', 'Guest');
 * setName('Jane');                     // stores "Jane" in localStorage
 *
 * @example
 * const [items, setItems] = useLocalStorage('cart', []);
 * setItems(prev => [...prev, newItem]); // supports updater functions
 */
const useLocalStorage = (key, initialValue) => {
  /**
   * Lazy initializer — runs only on the very first render.
   * Attempts to read and parse the value from localStorage.
   * Falls back to `initialValue` on any error or if the key doesn't exist.
   *
   * @returns {T} The persisted value or the provided initial value.
   */
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      // If the key exists in localStorage, parse and return it
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch (error) {
      // JSON.parse failed or localStorage is unavailable
      console.error(
        `[useLocalStorage] Error reading key "${key}" from localStorage:`,
        error
      );
    }
    // No stored value found (or error occurred) — use the provided initial value
    return initialValue;
  });

  /**
   * Setter that updates both React state and localStorage simultaneously.
   * Accepts either a direct value or an updater function (same API as useState).
   *
   * @param {T | ((prev: T) => T)} value - The new value, or a function that
   *        receives the previous value and returns the new value.
   */
  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        // Resolve the next value — support updater functions like setState
        const nextValue = value instanceof Function ? value(prev) : value;

        // Persist to localStorage
        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch (error) {
          // Storage full, private browsing, or SecurityError
          console.error(
            `[useLocalStorage] Error writing key "${key}" to localStorage:`,
            error
          );
        }

        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
};

export default useLocalStorage;
