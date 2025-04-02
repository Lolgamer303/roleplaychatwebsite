'use client';

import { useTheme } from "../ThemeProvider";
import { useEffect, useState, useRef } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme === 'dark');
  const isFirstRender = useRef(true); // Track first render
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark hydration as complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Synchronize `isDark` with the `theme` value
  useEffect(() => {
    if (isFirstRender.current) {
      // Skip animation on the first render
      isFirstRender.current = false;
    } else {
      setIsDark(theme === 'dark');
    }
  }, [theme]);

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <div className={`theme-toggle ${isHydrated ? 'hydrated' : 'not-hydrated'} flex items-center justify-center scale-90`}>
      <div
        onClick={handleToggle}
        className={`relative w-16 h-8 rounded-full cursor-pointer transition-colors duration-300 ${
          isDark ? "bg-gray-800" : "bg-yellow-400"
        }`}
      >
        {/* Toggle Knob */}
        <div
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform ${
            isFirstRender.current
              ? '' // No animation on first render
              : 'transition-transform duration-300'
          } ${isDark ? "translate-x-8" : "translate-x-0"}`}
        >
          {/* SVG Icons */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isDark ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Moon Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-800"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
              />
            </svg>
          </div>
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isDark ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Sun Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}