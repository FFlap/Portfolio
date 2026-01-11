'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'purple' | 'green' | 'orange' | 'blue';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Refined, muted color palettes for Swiss Precision aesthetic
const themeColors = {
  purple: {
    primary: '#76ABAE',
    secondary: '#76ABAE',
    accent: '#76ABAE',
    bg: '#181C22',
    text: '#EEEEEE'
  },
  green: {
    primary: '#4ade80',
    secondary: '#22c55e',
    accent: '#f59e0b',
    bg: '#393646',
    text: '#F4EEE0'
  },
  orange: {
    primary: '#fb923c',
    secondary: '#fbbf24',
    accent: '#f59e0b',
    bg: '#393646',
    text: '#F4EEE0'
  },
  blue: {
    primary: '#76ABAE',
    secondary: '#76ABAE',
    accent: '#76ABAE',
    bg: '#181C22',
    text: '#EEEEEE'
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('purple');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themeColors[savedTheme]) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('purple');
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    const colors = themeColors[theme];
    const root = document.documentElement;
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--bg-color', colors.bg);
    root.style.setProperty('--text-color', colors.text);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
