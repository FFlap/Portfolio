'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'purple' | 'green' | 'orange' | 'blue';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors = {
  purple: {
    primary: '#a855f7',
    secondary: '#22d3ee',
    accent: '#4ade80',
    bg: '#050505',
    text: '#ffffff'
  },
  green: {
    primary: '#22c55e',
    secondary: '#15803d',
    accent: '#ffffff',
    bg: '#020c02',
    text: '#4ade80'
  },
  orange: {
    primary: '#f97316',
    secondary: '#eab308',
    accent: '#f43f5e',
    bg: '#1c1917',
    text: '#fcd34d'
  },
  blue: {
    primary: '#3b82f6',
    secondary: '#06b6d4',
    accent: '#f472b6',
    bg: '#0f172a',
    text: '#e0f2fe'
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
