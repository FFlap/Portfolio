'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'purple' | 'green' | 'orange' | 'blue';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Distinct color palettes for each theme
const themeColors = {
  purple: {
    primary: '#a855f7',
    secondary: '#9333ea',
    accent: '#c084fc',
    bg: '#181C22',
    text: '#EEEEEE'
  },
  green: {
    primary: '#4ade80',
    secondary: '#22c55e',
    accent: '#86efac',
    bg: '#181C22',
    text: '#EEEEEE'
  },
  orange: {
    primary: '#fb923c',
    secondary: '#f97316',
    accent: '#fdba74',
    bg: '#181C22',
    text: '#EEEEEE'
  },
  blue: {
    primary: '#76ABAE',
    secondary: '#5d9a9d',
    accent: '#9fc5c7',
    bg: '#181C22',
    text: '#EEEEEE'
  }
};

function resolveInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'purple';
  const savedTheme = localStorage.getItem('theme') as Theme;
  if (savedTheme && themeColors[savedTheme]) return savedTheme;
  return 'purple';
}

function applyThemeVariables(theme: Theme) {
  if (typeof document === 'undefined') return;
  const colors = themeColors[theme];
  const root = document.documentElement;
  root.style.setProperty('--primary-color', colors.primary);
  root.style.setProperty('--secondary-color', colors.secondary);
  root.style.setProperty('--accent-color', colors.accent);
  root.style.setProperty('--bg-color', colors.bg);
  root.style.setProperty('--text-color', colors.text);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => resolveInitialTheme());

  useEffect(() => {
    applyThemeVariables(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
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
