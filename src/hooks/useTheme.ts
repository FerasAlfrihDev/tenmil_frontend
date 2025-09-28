// ========================================
// THEME PERSISTENCE HOOK
// ========================================

import { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'tenmil-theme-preference';

type Theme = 'light' | 'dark';

/**
 * Custom hook for managing theme state with localStorage persistence
 * Supports system preference detection and user preference storage
 */
export const useTheme = () => {
  // Initialize theme from localStorage or system preference
  const getInitialTheme = (): boolean => {
    try {
      // First, check if user has a saved preference
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        return savedTheme === 'dark';
      }

      // If no saved preference, check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true; // System prefers dark mode
      }

      // Default to dark mode if no preference found
      return true;
    } catch (error) {
      console.warn('Failed to read theme preference from localStorage:', error);
      return true; // Default to dark mode
    }
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    try {
      const theme: Theme = isDarkMode ? 'dark' : 'light';
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme preference to localStorage:', error);
    }
  }, [isDarkMode]);

  // Update HTML class when theme changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.remove('theme-light');
      htmlElement.classList.add('theme-dark');
    } else {
      htmlElement.classList.remove('theme-dark');
      htmlElement.classList.add('theme-light');
    }
  }, [isDarkMode]);

  // Listen for system theme changes (optional enhancement)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a manual preference
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!savedTheme) {
        setIsDarkMode(e.matches);
      }
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const setTheme = (theme: Theme) => {
    setIsDarkMode(theme === 'dark');
  };

  return {
    isDarkMode,
    theme: (isDarkMode ? 'dark' : 'light') as Theme,
    toggleTheme,
    setTheme,
  };
};
