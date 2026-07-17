'use client';

import React, { createContext, useCallback, useContext, useRef, useState, ReactNode } from 'react';

const BASE_TERMINAL_Z_INDEX = 10;

export interface TerminalState {
  id: string;
  title: string;
  isMinimized: boolean;
  isClosed: boolean;
  isOpen: boolean;
  zIndex: number;
}

interface TerminalContextType {
  terminals: Record<string, TerminalState>;
  registerTerminal: (id: string, title: string) => void;
  unregisterTerminal: (id: string) => void;
  minimizeTerminal: (id: string) => void;
  restoreTerminal: (id: string) => void;
  closeTerminal: (id: string) => void;
  openTerminal: (id: string) => void;
  bringToFront: (id: string) => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [terminals, setTerminals] = useState<Record<string, TerminalState>>({});
  const nextZIndexRef = useRef(BASE_TERMINAL_Z_INDEX);

  const allocateZIndex = useCallback(() => {
    nextZIndexRef.current += 1;
    return nextZIndexRef.current;
  }, []);

  const bringToFront = useCallback((id: string) => {
    setTerminals((prev) => {
      const terminal = prev[id];
      if (!terminal) return prev;

      const maxZ = Math.max(BASE_TERMINAL_Z_INDEX, ...Object.values(prev).map((t) => t.zIndex));
      if (terminal.zIndex === maxZ) return prev;

      const zIndex = allocateZIndex();
      return {
        ...prev,
        [id]: { ...terminal, zIndex },
      };
    });
  }, [allocateZIndex]);

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
          zIndex: allocateZIndex(),
        },
      };
    });
  }, [allocateZIndex]);

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
    setTerminals((prev) => {
      const terminal = prev[id];
      if (!terminal) return prev;

      const maxZ = Math.max(BASE_TERMINAL_Z_INDEX, ...Object.values(prev).map((t) => t.zIndex));
      const zIndex = terminal.zIndex === maxZ ? terminal.zIndex : allocateZIndex();

      return {
        ...prev,
        [id]: {
          ...terminal,
          isMinimized: false,
          isClosed: false,
          isOpen: true,
          zIndex,
        },
      };
    });
  }, [allocateZIndex]);

  const closeTerminal = useCallback((id: string) => {
    setTerminals((prev) => ({
      ...prev,
      [id]: { ...prev[id], isClosed: true, isOpen: false },
    }));
  }, []);

  const openTerminal = useCallback((id: string) => {
    setTerminals((prev) => {
      const terminal = prev[id];
      if (!terminal) return prev;

      const maxZ = Math.max(BASE_TERMINAL_Z_INDEX, ...Object.values(prev).map((t) => t.zIndex));
      const zIndex = terminal.zIndex === maxZ ? terminal.zIndex : allocateZIndex();

      return {
        ...prev,
        [id]: {
          ...terminal,
          isClosed: false,
          isMinimized: false,
          isOpen: true,
          zIndex,
        },
      };
    });
  }, [allocateZIndex]);

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
        bringToFront,
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
