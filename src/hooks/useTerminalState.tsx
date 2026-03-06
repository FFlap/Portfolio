'use client';

import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';

export interface TerminalState {
  id: string;
  title: string;
  isMinimized: boolean;
  isClosed: boolean;
  isOpen: boolean;
}

interface TerminalContextType {
  terminals: Record<string, TerminalState>;
  registerTerminal: (id: string, title: string) => void;
  unregisterTerminal: (id: string) => void;
  minimizeTerminal: (id: string) => void;
  restoreTerminal: (id: string) => void;
  closeTerminal: (id: string) => void;
  openTerminal: (id: string) => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [terminals, setTerminals] = useState<Record<string, TerminalState>>({});

  const registerTerminal = useCallback((id: string, title: string) => {
    setTerminals((prev) => {
      // Don't overwrite if it already exists to preserve minimized/closed state across re-renders
      if (prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          id,
          title,
          isMinimized: false,
          isClosed: false,
          isOpen: true,
        },
      };
    });
  }, []);

  const unregisterTerminal = useCallback((id: string) => {
    setTerminals((prev) => {
      if (!prev[id]) return prev;

      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const minimizeTerminal = useCallback((id: string) => {
    setTerminals((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  }, []);

  const restoreTerminal = useCallback((id: string) => {
    setTerminals((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: false, isClosed: false, isOpen: true },
    }));
  }, []);

  const closeTerminal = useCallback((id: string) => {
    setTerminals((prev) => ({
      ...prev,
      [id]: { ...prev[id], isClosed: true, isOpen: false },
    }));
  }, []);

  const openTerminal = useCallback((id: string) => {
    setTerminals((prev) => ({
      ...prev,
      [id]: { ...prev[id], isClosed: false, isMinimized: false, isOpen: true },
    }));
  }, []);

  return (
    <TerminalContext.Provider
      value={{
        terminals,
        registerTerminal,
        unregisterTerminal,
        minimizeTerminal,
        restoreTerminal,
        closeTerminal,
        openTerminal,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminalState() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminalState must be used within a TerminalProvider');
  }
  return context;
}
