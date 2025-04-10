'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme') as Theme;
  
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        applyTheme(initialTheme);
        setMounted(true); // ✅ Ready to render
      }
    }, []);
  
    useEffect(() => {
      if (mounted) {
        applyTheme(theme);
        localStorage.setItem('theme', theme);
      }
    }, [theme, mounted]);
  
    const applyTheme = (theme: Theme) => {
      const root = document.documentElement;
      root.setAttribute('data-theme', theme); // ✅ Optional but helpful for debugging
  
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
        root.style.setProperty('--color-custom-border', 'var(--color-custom-border-light)');
        root.style.setProperty('--color-custom-hover', 'var(--color-custom-hover-light)');
      }
    };
  
    if (!mounted) return null; // ✅ Prevent hydration mismatch
  
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
    export default ThemeProvider;  