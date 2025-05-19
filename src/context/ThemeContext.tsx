import React, { useState, useEffect } from 'react';
import { ThemeContext, themes } from './themeHelpers';
import { ThemeType } from '../helpers/sharedTypes';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
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
