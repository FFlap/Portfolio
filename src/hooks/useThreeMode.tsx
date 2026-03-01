'use client';

import React, { createContext, useContext, useSyncExternalStore, ReactNode } from 'react';

interface ThreeModeContextType {
  isThreeMode: boolean;
  setThreeMode: (value: boolean) => void;
  toggleThreeMode: () => void;
}

const ThreeModeContext = createContext<ThreeModeContextType | undefined>(undefined);
const THREE_MODE_STORAGE_KEY = 'threeMode';
const listeners = new Set<() => void>();

function resolveThreeModeFromStorage() {
  if (typeof window === 'undefined') {
    return false;
  }

  return localStorage.getItem(THREE_MODE_STORAGE_KEY) === 'true';
}

function emitThreeModeChange() {
  listeners.forEach((listener) => listener());
}

function subscribeThreeModeStore(listener: () => void) {
  listeners.add(listener);

  if (typeof window === 'undefined') {
    return () => {
      listeners.delete(listener);
    };
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === THREE_MODE_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function ThreeModeProvider({ children }: { children: ReactNode }) {
  const isThreeMode = useSyncExternalStore(
    subscribeThreeModeStore,
    resolveThreeModeFromStorage,
    () => false
  );

  const setThreeMode = (value: boolean) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(THREE_MODE_STORAGE_KEY, String(value));
    emitThreeModeChange();
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
