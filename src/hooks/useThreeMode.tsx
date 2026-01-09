'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThreeModeContextType {
  isThreeMode: boolean;
  setThreeMode: (value: boolean) => void;
  toggleThreeMode: () => void;
}

const ThreeModeContext = createContext<ThreeModeContextType | undefined>(undefined);

export function ThreeModeProvider({ children }: { children: ReactNode }) {
  const [isThreeMode, setIsThreeMode] = useState(false);

  // Optional: Persist to local storage
  useEffect(() => {
    const saved = localStorage.getItem('threeMode');
    if (saved !== null) {
      setIsThreeMode(saved === 'true');
    }
  }, []);

  const setThreeMode = (value: boolean) => {
    setIsThreeMode(value);
    localStorage.setItem('threeMode', String(value));
  };

  const toggleThreeMode = () => {
    setThreeMode(!isThreeMode);
  };

  return (
    <ThreeModeContext.Provider value={{ isThreeMode, setThreeMode, toggleThreeMode }}>
      {children}
    </ThreeModeContext.Provider>
  );
}

export function useThreeMode() {
  const context = useContext(ThreeModeContext);
  if (context === undefined) {
    throw new Error('useThreeMode must be used within a ThreeModeProvider');
  }
  return context;
}
