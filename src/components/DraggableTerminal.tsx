'use client';

import { useState, useRef, ReactNode, useEffect } from 'react';
import { Rnd } from 'react-rnd';

interface DraggableTerminalProps {
  children: ReactNode;
  minWidth?: number;
  minHeight?: number;
}

export default function DraggableTerminal({
  children,
  minWidth = 400,
  minHeight = 300,
}: DraggableTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const previousState = useRef({ size, position });

  // Measure initial size after mount
  useEffect(() => {
    if (contentRef.current && !mounted) {
      const rect = contentRef.current.getBoundingClientRect();
      const measuredSize = { width: rect.width, height: rect.height };
      setInitialSize(measuredSize);
      setSize(measuredSize);
      setMounted(true);
    }
  }, [mounted]);

  const handleMaximize = () => {
    if (isMaximized) {
      setSize(previousState.current.size);
      setPosition(previousState.current.position);
      setIsMaximized(false);
      setIsInteracting(false);
    } else {
      previousState.current = { size, position };
      
      // Calculate maximized size and position
      const maxWidth = window.innerWidth - 100;
      const maxHeight = window.innerHeight - 150;
      
      // Get container's position on screen to calculate offset
      const containerRect = containerRef.current?.getBoundingClientRect();
      const offsetX = containerRect ? -containerRect.left + 50 : 0;
      const offsetY = containerRect ? -containerRect.top + 75 : 0;
      
      setSize({ width: maxWidth, height: maxHeight });
      setPosition({ x: offsetX, y: offsetY });
      setIsMaximized(true);
      setIsInteracting(true);
    }
  };

  // Before mount, render normally to measure
  if (!mounted) {
    return (
      <div ref={contentRef} className="glass-panel rounded-lg overflow-hidden font-mono text-sm md:text-base flex flex-col">
        {/* Terminal Header */}
        <div className="terminal-drag-handle bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/5 cursor-grab active:cursor-grabbing select-none">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 cursor-pointer transition-all" title="Close"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 cursor-pointer transition-all" title="Minimize"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 cursor-pointer transition-all" title="Maximize"></div>
          <span className="ml-2 text-neutral-500 text-xs font-mono">~/portfolio</span>
        </div>
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="relative" 
      style={{ 
        width: isInteracting ? initialSize.width : size.width, 
        height: isInteracting ? initialSize.height : size.height 
      }}
    >
      <Rnd
        size={size}
        position={position}
        onDragStart={() => setIsInteracting(true)}
        onDrag={(e, d) => {
          setPosition({ x: d.x, y: d.y });
        }}
        onDragStop={(e, d) => {
          setPosition({ x: d.x, y: d.y });
        }}
        onResizeStart={() => setIsInteracting(true)}
        onResize={(e, direction, ref, delta, pos) => {
          setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          });
          // Only update position when resizing from top or left edges
          if (direction.includes('top') || direction.includes('left')) {
            setPosition(pos);
          }
        }}
        onResizeStop={(e, direction, ref, delta, pos) => {
          setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          });
          // Only update position when resizing from top or left edges
          if (direction.includes('top') || direction.includes('left')) {
            setPosition(pos);
          }
        }}
        minWidth={minWidth}
        minHeight={minHeight}
        dragHandleClassName="terminal-drag-handle"
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
        className="terminal-window"
        style={{ position: isInteracting ? 'absolute' : 'relative', zIndex: isInteracting ? 50 : 'auto' }}
      >
        <div className="glass-panel rounded-lg overflow-hidden font-mono text-sm md:text-base h-full flex flex-col">
          {/* Terminal Header - Drag Handle */}
          <div 
            className="terminal-drag-handle bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/5 cursor-grab active:cursor-grabbing select-none"
            onDoubleClick={handleMaximize}
          >
            <div 
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 cursor-pointer transition-all"
              title="Close"
            ></div>
            <div 
              className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 cursor-pointer transition-all"
              title="Minimize"
            ></div>
            <div 
              className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 cursor-pointer transition-all"
              onClick={handleMaximize}
              title={isMaximized ? "Restore" : "Maximize"}
            ></div>
            <span className="ml-2 text-neutral-500 text-xs font-mono">~/portfolio</span>
          </div>

          {/* Terminal Body */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </Rnd>
    </div>
  );
}
