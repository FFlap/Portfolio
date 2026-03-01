'use client';

import { createContext, useContext, useEffect, useSyncExternalStore, ReactNode } from 'react';

export type Theme = 'purple' | 'green' | 'orange' | 'blue';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_STORAGE_KEY = 'theme';
const THEME_DEFAULT: Theme = 'purple';
const listeners = new Set<() => void>();

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

function resolveThemeFromStorage(): Theme {
  if (typeof window === 'undefined') {
    return THEME_DEFAULT;
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (savedTheme && themeColors[savedTheme]) {
    return savedTheme;
  }

  return THEME_DEFAULT;
}

function emitThemeChange() {
  listeners.forEach((listener) => listener());
}

function subscribeThemeStore(listener: () => void) {
  listeners.add(listener);

  if (typeof window === 'undefined') {
    return () => {
      listeners.delete(listener);
    };
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeThemeStore,
    resolveThemeFromStorage,
    () => THEME_DEFAULT
  );

  useEffect(() => {
    applyThemeVariables(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyThemeVariables(newTheme);
    emitThemeChange();
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
