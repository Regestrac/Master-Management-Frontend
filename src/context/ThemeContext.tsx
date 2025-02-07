import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'black' | 'red' | 'green' | 'blue' | 'purple' | 'cyan' | 'white';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes: Record<Theme, Record<string, string>> = {
  dark: {
    '--primary-color': '#4f46e5',
    '--primary-hover': '#4338ca',
    '--text-color': '#e5e7eb',
    '--text-light': '#9ca3af',
    '--bg-color': '#1f2937',
    '--bg-secondary': '#111827',
    '--border-color': 'rgba(75, 85, 99, 0.2)',
    '--hover-color': 'rgba(75, 85, 99, 0.1)',
    '--active-bg': 'rgba(79, 70, 229, 0.1)',
    '--navbar-bg': 'rgba(17, 24, 39, 0.95)',
    '--navbar-border': 'rgba(55, 65, 81, 0.3)',
    '--mobile-menu-bg': '#1e1e1e',
  },
  black: {
    '--primary-color': '#4f46e5',
    '--primary-hover': '#4338ca',
    '--text-color': '#e5e7eb',
    '--text-light': '#9ca3af',
    '--bg-color': '#000000',
    '--bg-secondary': '#0a0a0a',
    '--border-color': 'rgba(75, 85, 99, 0.2)',
    '--hover-color': 'rgba(75, 85, 99, 0.1)',
    '--active-bg': 'rgba(79, 70, 229, 0.1)',
    '--navbar-bg': 'rgba(17, 24, 39, 0.95)',
    '--navbar-border': 'rgba(38, 38, 38, 0.3)',
    '--mobile-menu-bg': '#000000',
  },
  red: {
    '--primary-color': '#dc2626',
    '--primary-hover': '#991b1b',
    '--text-color': '#374151',
    '--text-light': '#6b7280',
    '--bg-color': '#fee2e2',
    '--bg-secondary': '#fecaca',
    '--border-color': 'rgba(220, 38, 38, 0.2)',
    '--hover-color': 'rgba(220, 38, 38, 0.1)',
    '--active-bg': 'rgba(220, 38, 38, 0.1)',
    '--navbar-bg': 'rgba(254, 226, 226, 0.9)',
    '--navbar-border': 'rgba(220, 38, 38, 0.2)',
    '--mobile-menu-bg': '#450a0a',
  },
  green: {
    '--primary-color': '#059669',
    '--primary-hover': '#065f46',
    '--text-color': '#374151',
    '--text-light': '#6b7280',
    '--bg-color': '#d1fae5',
    '--bg-secondary': '#a7f3d0',
    '--border-color': 'rgba(5, 150, 105, 0.2)',
    '--hover-color': 'rgba(5, 150, 105, 0.1)',
    '--active-bg': 'rgba(5, 150, 105, 0.1)',
    '--navbar-bg': 'rgba(209, 250, 229, 0.9)',
    '--navbar-border': 'rgba(5, 150, 105, 0.2)',
    '--mobile-menu-bg': '#064e3b',
  },
  blue: {
    '--primary-color': '#2563eb',
    '--primary-hover': '#1d4ed8',
    '--text-color': '#374151',
    '--text-light': '#6b7280',
    '--bg-color': '#dbeafe',
    '--bg-secondary': '#bfdbfe',
    '--border-color': 'rgba(37, 99, 235, 0.2)',
    '--hover-color': 'rgba(37, 99, 235, 0.1)',
    '--active-bg': 'rgba(37, 99, 235, 0.1)',
    '--navbar-bg': 'rgba(219, 234, 254, 0.9)',
    '--navbar-border': 'rgba(37, 99, 235, 0.2)',
    '--mobile-menu-bg': '#1e3a8a',
  },
  purple: {
    '--primary-color': '#7c3aed',
    '--primary-hover': '#5b21b6',
    '--text-color': '#374151',
    '--text-light': '#6b7280',
    '--bg-color': '#ede9fe',
    '--bg-secondary': '#ddd6fe',
    '--border-color': 'rgba(124, 58, 237, 0.2)',
    '--hover-color': 'rgba(124, 58, 237, 0.1)',
    '--active-bg': 'rgba(124, 58, 237, 0.1)',
    '--navbar-bg': 'rgba(237, 233, 254, 0.9)',
    '--navbar-border': 'rgba(124, 58, 237, 0.2)',
    '--mobile-menu-bg': '#4c1d95',
  },
  cyan: {
    '--primary-color': '#0891b2',
    '--primary-hover': '#0e7490',
    '--text-color': '#374151',
    '--text-light': '#6b7280',
    '--bg-color': '#cffafe',
    '--bg-secondary': '#a5f3fc',
    '--border-color': 'rgba(8, 145, 178, 0.2)',
    '--hover-color': 'rgba(8, 145, 178, 0.1)',
    '--active-bg': 'rgba(8, 145, 178, 0.1)',
    '--navbar-bg': 'rgba(207, 250, 254, 0.9)',
    '--navbar-border': 'rgba(8, 145, 178, 0.2)',
    '--mobile-menu-bg': '#064e3b',
  },
  white: {
    '--primary-color': '#2563eb',
    '--primary-hover': '#1d4ed8',
    '--text-color': '#1f2937',
    '--text-light': '#4b5563',
    '--bg-color': '#ffffff',
    '--bg-secondary': '#f3f4f6',
    '--border-color': 'rgba(37, 99, 235, 0.2)',
    '--hover-color': 'rgba(37, 99, 235, 0.1)',
    '--active-bg': 'rgba(37, 99, 235, 0.1)',
    '--navbar-bg': 'rgba(255, 255, 255, 0.9)',
    '--navbar-border': 'rgba(37, 99, 235, 0.2)',
    '--mobile-menu-bg': '#f9fafb',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    Object.entries(themes[theme]).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
