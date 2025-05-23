import { createContext, useContext } from 'react';

import { ThemeType } from 'helpers/sharedTypes';

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (_theme: ThemeType) => void;
};

export const themes: Record<ThemeType, Record<string, string>> = {
  dark: {
    '--color-primary': '#4f46e5',
    '--color-hover-primary': '#4338ca',
    '--color-hover-secondary': 'rgba(75, 85, 99, 0.1)',
    '--color-text': '#e5e7eb',
    '--color-text-light': '#9ca3af',
    '--color-border': 'rgba(75, 85, 99, 0.2)',
    '--color-border-navbar': 'rgba(55, 65, 81, 0.3)',
    '--color-primary-bg': '#1f2937',
    '--color-secondary-bg': '#111827',
    '--color-active-bg': 'rgba(79, 70, 229, 0.1)',
    '--color-navbar-bg': 'rgba(17, 24, 39, 0.95)',
    '--color-mobile-menu-bg': '#1e1e1e',
  },
  black: {
    '--color-primary': '#4f46e5',
    '--color-hover-primary': '#4338ca',
    '--color-hover-secondary': 'rgba(75, 85, 99, 0.1)',
    '--color-text': '#e5e7eb',
    '--color-text-light': '#9ca3af',
    '--color-border': 'rgba(75, 85, 99, 0.2)',
    '--color-border-navbar': 'rgba(38, 38, 38, 0.3)',
    '--color-primary-bg': '#000000',
    '--color-secondary-bg': '#0a0a0a',
    '--color-active-bg': 'rgba(79, 70, 229, 0.1)',
    '--color-navbar-bg': 'rgba(17, 24, 39, 0.95)',
    '--color-mobile-menu-bg': '#000000',
  },
  red: {
    '--color-primary': '#dc2626',
    '--color-hover-primary': '#991b1b',
    '--color-hover-secondary': 'rgba(220, 38, 38, 0.1)',
    '--color-text': '#374151',
    '--color-text-light': '#6b7280',
    '--color-border': 'rgba(220, 38, 38, 0.2)',
    '--color-border-navbar': 'rgba(220, 38, 38, 0.2)',
    '--color-primary-bg': '#fee2e2',
    '--color-secondary-bg': '#fecaca',
    '--color-active-bg': 'rgba(220, 38, 38, 0.1)',
    '--color-navbar-bg': 'rgba(254, 226, 226, 0.9)',
    '--color-mobile-menu-bg': '#450a0a',
  },
  green: {
    '--color-primary': '#059669',
    '--color-hover-primary': '#065f46',
    '--color-hover-secondary': 'rgba(5, 150, 105, 0.1)',
    '--color-text': '#374151',
    '--color-text-light': '#6b7280',
    '--color-border': 'rgba(5, 150, 105, 0.2)',
    '--color-border-navbar': 'rgba(5, 150, 105, 0.2)',
    '--color-primary-bg': '#d1fae5',
    '--color-secondary-bg': '#a7f3d0',
    '--color-active-bg': 'rgba(5, 150, 105, 0.1)',
    '--color-navbar-bg': 'rgba(209, 250, 229, 0.9)',
    '--color-mobile-menu-bg': '#064e3b',
  },
  blue: {
    '--color-primary': '#2563eb',
    '--color-hover-primary': '#1d4ed8',
    '--color-hover-secondary': 'rgba(37, 99, 235, 0.1)',
    '--color-text': '#374151',
    '--color-text-light': '#6b7280',
    '--color-border': 'rgba(37, 99, 235, 0.2)',
    '--color-border-navbar': 'rgba(37, 99, 235, 0.2)',
    '--color-primary-bg': '#dbeafe',
    '--color-secondary-bg': '#bfdbfe',
    '--color-active-bg': 'rgba(37, 99, 235, 0.1)',
    '--color-navbar-bg': 'rgba(219, 234, 254, 0.9)',
    '--color-mobile-menu-bg': '#1e3a8a',
  },
  purple: {
    '--color-primary': '#7c3aed',
    '--color-hover-primary': '#5b21b6',
    '--color-hover-secondary': 'rgba(124, 58, 237, 0.1)',
    '--color-text': '#374151',
    '--color-text-light': '#6b7280',
    '--color-border': 'rgba(124, 58, 237, 0.2)',
    '--color-border-navbar': 'rgba(124, 58, 237, 0.2)',
    '--color-primary-bg': '#ede9fe',
    '--color-secondary-bg': '#ddd6fe',
    '--color-active-bg': 'rgba(124, 58, 237, 0.1)',
    '--color-navbar-bg': 'rgba(237, 233, 254, 0.9)',
    '--color-mobile-menu-bg': '#4c1d95',
  },
  cyan: {
    '--color-primary': '#0891b2',
    '--color-hover-primary': '#0e7490',
    '--color-hover-secondary': 'rgba(8, 145, 178, 0.1)',
    '--color-text': '#374151',
    '--color-text-light': '#6b7280',
    '--color-border': 'rgba(8, 145, 178, 0.2)',
    '--color-border-navbar': 'rgba(8, 145, 178, 0.2)',
    '--color-primary-bg': '#cffafe',
    '--color-secondary-bg': '#a5f3fc',
    '--color-active-bg': 'rgba(8, 145, 178, 0.1)',
    '--color-navbar-bg': 'rgba(207, 250, 254, 0.9)',
    '--color-mobile-menu-bg': '#064e3b',
  },
  white: {
    '--color-primary': '#2563eb',
    '--color-hover-primary': '#1d4ed8',
    '--color-hover-secondary': 'rgba(37, 99, 235, 0.1)',
    '--color-text': '#1f2937',
    '--color-text-light': '#4b5563',
    '--color-border': 'rgba(37, 99, 235, 0.2)',
    '--color-border-navbar': 'rgba(37, 99, 235, 0.2)',
    '--color-primary-bg': '#ffffff',
    '--color-secondary-bg': '#f3f4f6',
    '--color-active-bg': 'rgba(37, 99, 235, 0.1)',
    '--color-navbar-bg': 'rgba(255, 255, 255, 0.9)',
    '--color-mobile-menu-bg': '#f9fafb',
  },
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};