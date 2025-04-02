'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light'); // Default to 'light'

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; //defaults it to dark mode if the user's system is set to dark mode
      const savedTheme = localStorage.getItem('theme') as Theme;

      if (savedTheme) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        const initialTheme = prefersDark ? 'dark' : 'light';
        setTheme(initialTheme);
        applyTheme(initialTheme);
      }
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme); // Save the theme to localStorage
  }, [theme]); // Re-run whenever `theme` changes

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.style.setProperty('--color-custom-background-primary', 'var(--color-custom-background-primary-dark)');
      root.style.setProperty('--color-custom-background-secondary', 'var(--color-custom-background-secondary-dark)');
      root.style.setProperty('--color-custom-text-primary', 'var(--color-custom-text-primary-dark)');
      root.style.setProperty('--color-custom-text-secondary', 'var(--color-custom-text-secondary-dark)');
      root.style.setProperty('--color-custom-accent-primary', 'var(--color-custom-accent-primary-dark)');
      root.style.setProperty('--color-custom-accent-secondary', 'var(--color-custom-accent-secondary-dark)');
      root.style.setProperty('--color-custom-border', 'var(--color-custom-border-dark)');
      root.style.setProperty('--color-custom-hover', 'var(--color-custom-hover-dark)');
    } else {
      root.style.setProperty('--color-custom-background-primary', 'var(--color-custom-background-primary-light)');
      root.style.setProperty('--color-custom-background-secondary', 'var(--color-custom-background-secondary-light)');
      root.style.setProperty('--color-custom-text-primary', 'var(--color-custom-text-primary-light)');
      root.style.setProperty('--color-custom-text-secondary', 'var(--color-custom-text-secondary-light)');
      root.style.setProperty('--color-custom-accent-primary', 'var(--color-custom-accent-primary-light)');
      root.style.setProperty('--color-custom-accent-secondary', 'var(--color-custom-accent-secondary-light)');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};