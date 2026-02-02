'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThreeModeContextType {
  isThreeMode: boolean;
  setThreeMode: (value: boolean) => void;
  toggleThreeMode: () => void;
}

const ThreeModeContext = createContext<ThreeModeContextType | undefined>(undefined);

function resolveInitialThreeMode(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('threeMode');
  return saved === 'true';
}

export function ThreeModeProvider({ children }: { children: ReactNode }) {
  const [isThreeMode, setIsThreeMode] = useState(() => resolveInitialThreeMode());

  const setThreeMode = (value: boolean) => {
    setIsThreeMode(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('threeMode', String(value));
    }
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
