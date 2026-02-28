'use client';

import { useTerminalState } from '@/hooks/useTerminalState';
import { Terminal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function AppDock() {
  const { terminals, restoreTerminal, minimizeTerminal } = useTerminalState();

  const terminalList = Object.values(terminals).filter(t => !t.isClosed);
  const currentMinimizedCount = terminalList.filter(t => t.isMinimized).length;

  const [isHovered, setIsHovered] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const previousMinimizedCount = useRef(0);

  useEffect(() => {
    // If the number of minimized terminals increases, show the dock temporarily
    if (currentMinimizedCount > previousMinimizedCount.current) {
      setShowIndicator(true);
      const timer = setTimeout(() => setShowIndicator(false), 2500);
      previousMinimizedCount.current = currentMinimizedCount;
      return () => clearTimeout(timer);
    }
    previousMinimizedCount.current = currentMinimizedCount;
  }, [currentMinimizedCount]);

  if (terminalList.length === 0) return null;

  const isVisible = isHovered || showIndicator || currentMinimizedCount > 0 && isHovered;

  return (
    <>
      {/* Invisible trigger area at the very bottom edge of the screen */}
      <div 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-4 z-[90]"
        onMouseEnter={() => setIsHovered(true)}
      />

      <div 
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-y-0' : 'translate-y-[calc(100%+2rem)]'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="px-4 py-3 glass-panel rounded-2xl flex items-end gap-3 pointer-events-auto border border-white/10 shadow-2xl">
          {terminalList.map((terminal) => {
        const isActive = !terminal.isMinimized && terminal.isOpen;

        return (
          <div key={terminal.id} className="relative group flex flex-col items-center">
            {/* Tooltip */}
            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-neutral-800 text-white text-xs px-2 py-1 rounded pointer-events-none mb-2 z-10 font-mono">
              {terminal.title || terminal.id}
            </div>

            <button
              onClick={() => {
                if (terminal.isMinimized) {
                  restoreTerminal(terminal.id);
                } else {
                  minimizeTerminal(terminal.id);
                }
              }}
              className={`
                relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                hover:scale-110 active:scale-95 hover:bg-white/10
                ${isActive ? 'bg-white/10 shadow-inner' : 'bg-transparent'}
              `}
              title={terminal.title}
            >
              <Terminal className={`w-7 h-7 ${isActive ? 'text-theme' : 'text-neutral-400 group-hover:text-white'}`} strokeWidth={1.5} />
            </button>
            
              {/* Active Indicator dot */}
              <div 
                className={`w-1 h-1 rounded-full mt-1.5 transition-all duration-300 ${isActive ? 'bg-theme opacity-100' : 'bg-transparent opacity-0 group-hover:opacity-50 group-hover:bg-neutral-500'}`} 
              />
            </div>
          );
        })}
        </div>
      </div>
    </>
  );
}
