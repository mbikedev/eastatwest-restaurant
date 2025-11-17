/**
 * Safe localStorage utilities for SSR-compatible applications
 * These helpers prevent "localStorage is not defined" errors during server-side rendering
 */

/**
 * Check if we're in a browser environment with real localStorage
 */
const hasRealLocalStorage = (): boolean => {
  try {
    if (typeof window === "undefined") return false;
    if (typeof localStorage === "undefined") return false;
    if (!localStorage) return false;
    
    // Check if localStorage has the required methods
    if (typeof localStorage.getItem !== "function") return false;
    if (typeof localStorage.setItem !== "function") return false;
    if (typeof localStorage.removeItem !== "function") return false;
    
    // Try to actually use it (some browsers block it in private mode)
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "test");
    const result = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    return result === "test";
  } catch (e) {
    return false;
  }
};

/**
 * Safely get an item from localStorage
 * @param key - The localStorage key to retrieve
 * @returns The stored value or null if not available
 */
export const safeGetItem = (key: string): string | null => {
  try {
    if (!hasRealLocalStorage()) return null;
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

/**
 * Safely set an item in localStorage
 * @param key - The localStorage key to set
 * @param value - The value to store
 * @returns true if successful, false otherwise
 */
export const safeSetItem = (key: string, value: string): boolean => {
  try {
    if (!hasRealLocalStorage()) return false;
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Safely remove an item from localStorage
 * @param key - The localStorage key to remove
 * @returns true if successful, false otherwise
 */
export const safeRemoveItem = (key: string): boolean => {
  try {
    if (!hasRealLocalStorage()) return false;
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Safely clear all localStorage
 * @returns true if successful, false otherwise
 */
export const safeClear = (): boolean => {
  try {
    if (!hasRealLocalStorage()) return false;
    localStorage.clear();
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns true if localStorage is available and functional
 */
export const isStorageAvailable = (): boolean => {
  return hasRealLocalStorage();
};

/**
 * Get a parsed JSON object from localStorage
 * @param key - The localStorage key to retrieve
 * @returns The parsed object or null if not available or invalid JSON
 */
export const safeGetJSON = <T = any>(key: string): T | null => {
  try {
    const item = safeGetItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (e) {
    return null;
  }
};

/**
 * Set a JSON object in localStorage
 * @param key - The localStorage key to set
 * @param value - The object to store
 * @returns true if successful, false otherwise
 */
export const safeSetJSON = <T = any>(key: string, value: T): boolean => {
  try {
    const stringified = JSON.stringify(value);
    return safeSetItem(key, stringified);
  } catch (e) {
    return false;
  }
};
