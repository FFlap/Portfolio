'use client';

import {
  useState,
  useRef,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useCallback,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import { Rnd } from 'react-rnd';
import { useTerminalState } from '@/hooks/useTerminalState';

const WINDOW_LAYER_ID = 'terminal-window-layer';
const TOUCH_LAYOUT_QUERY = '(max-width: 768px), (pointer: coarse)';

function getWindowLayer(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return document.getElementById(WINDOW_LAYER_ID);
}

function subscribeToTouchLayout(onChange: () => void) {
  const mediaQuery = window.matchMedia(TOUCH_LAYOUT_QUERY);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

function getTouchLayoutSnapshot() {
  return window.matchMedia(TOUCH_LAYOUT_QUERY).matches;
}

function getServerTouchLayoutSnapshot() {
  return false;
}

function getDocumentPosition(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return {
    x: Math.round(rect.left + window.scrollX),
    y: Math.round(rect.top + window.scrollY),
  };
}

interface DraggableTerminalProps {
  id: string;
  children: ReactNode;
  minWidth?: number;
  minHeight?: number;
  defaultHeight?: number;
  capInitialHeightToViewport?: boolean;
  title?: string;
}

export default function DraggableTerminal({
  id,
  children,
  minWidth = 400,
  minHeight = 300,
  defaultHeight,
  capInitialHeightToViewport = true,
  title = '~/portfolio',
}: DraggableTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isDetachedRef = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDetached, setIsDetached] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const previousState = useRef({ size, position });
  const isTouchLayout = useSyncExternalStore(
    subscribeToTouchLayout,
    getTouchLayoutSnapshot,
    getServerTouchLayoutSnapshot,
  );

  const { registerTerminal, unregisterTerminal, minimizeTerminal, closeTerminal, bringToFront, terminals } =
    useTerminalState();

  useEffect(() => {
    registerTerminal(id, title);
    return () => {
      unregisterTerminal(id);
    };
  }, [id, title, registerTerminal, unregisterTerminal]);

  const terminalState = terminals[id];
  const zIndex = terminalState?.zIndex ?? 10;

  useLayoutEffect(() => {
    if (contentRef.current && !mounted) {
      const rect = contentRef.current.getBoundingClientRect();
      const desiredHeight = defaultHeight ?? rect.height;

      const unclampedHeight = Math.max(minHeight, desiredHeight);
      const heightCap = Math.max(minHeight, window.innerHeight - 150);
      const height = Math.ceil(
        capInitialHeightToViewport ? Math.min(unclampedHeight, heightCap) : unclampedHeight
      );

      const width = Math.ceil(Math.max(minWidth, rect.width));
      const measuredSize = { width, height };
      setSize(measuredSize);
      setMounted(true);
    }
  }, [mounted, defaultHeight, minHeight, minWidth, capInitialHeightToViewport]);

  useLayoutEffect(() => {
    if (!mounted || isTouchLayout || isDetached) return;

    const syncToPlaceholder = () => {
      if (isDetachedRef.current) return;
      const placeholder = containerRef.current;
      if (!placeholder) return;
      setPosition(getDocumentPosition(placeholder));
    };

    syncToPlaceholder();
    const raf = requestAnimationFrame(syncToPlaceholder);
    window.addEventListener('resize', syncToPlaceholder);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', syncToPlaceholder);
    };
  }, [mounted, isTouchLayout, isDetached, size.width, size.height]);

  const handleFocus = useCallback(() => {
    if (isTouchLayout) return;
    bringToFront(id);
  }, [isTouchLayout, bringToFront, id]);

  const detach = useCallback(() => {
    if (isTouchLayout || isDetachedRef.current) return;
    isDetachedRef.current = true;
    setIsDetached(true);
  }, [isTouchLayout]);

  const handleMaximize = () => {
    if (isTouchLayout) return;

    if (isMaximized) {
      setSize(previousState.current.size);
      setPosition(previousState.current.position);
      setIsMaximized(false);
    } else {
      previousState.current = { size, position };
      detach();
      bringToFront(id);

      setSize({
        width: window.innerWidth - 100,
        height: window.innerHeight - 150,
      });
      setPosition({
        x: Math.round(50 + window.scrollX),
        y: Math.round(75 + window.scrollY),
      });
      setIsMaximized(true);
    }
  };

  const handleMinimize = () => {
    if (isTouchLayout) return;
    minimizeTerminal(id);
  };

  if (!mounted) {
    return (
      <div
        ref={contentRef}
        className="rounded-lg overflow-hidden font-mono text-sm md:text-base flex flex-col border border-zinc-700 shadow-xl"
        style={{ backgroundColor: '#252A30' }}
      >
        <div className="terminal-drag-handle bg-[#2a2f36] px-4 py-3 flex items-center gap-2 border-b border-zinc-700 cursor-grab active:cursor-grabbing select-none">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 cursor-pointer transition-all" onClick={() => closeTerminal(id)} title="Close"></div>
          <div
            className={`w-3 h-3 rounded-full bg-[#ffbd2e] transition-all ${isTouchLayout ? 'cursor-default opacity-60' : 'cursor-pointer hover:brightness-110'}`}
            onClick={handleMinimize}
            title="Minimize"
            aria-disabled={isTouchLayout}
          ></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 cursor-pointer transition-all" title="Maximize"></div>
          <span className="ml-2 text-neutral-500 text-xs font-mono">{title}</span>
        </div>
        <div className="overflow-hidden">{children}</div>
      </div>
    );
  }

  const resizeConfig = isTouchLayout
    ? false
    : {
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      };

  if (terminalState?.isClosed) return null;

  const usePortal = !isTouchLayout;
  const layer = usePortal ? getWindowLayer() : null;
  const isHidden = Boolean(terminalState?.isMinimized);

  const windowNode = (
    <Rnd
      data-terminal-id={id}
      size={size}
      position={usePortal ? position : { x: 0, y: 0 }}
      disableDragging={isTouchLayout || isHidden}
      onDragStart={() => {
        handleFocus();
        detach();
      }}
      onDrag={(e, d) => {
        setPosition({ x: Math.round(d.x), y: Math.round(d.y) });
      }}
      onDragStop={(e, d) => {
        setPosition({ x: Math.round(d.x), y: Math.round(d.y) });
      }}
      onResizeStart={() => {
        handleFocus();
        detach();
      }}
      onResize={(e, direction, ref, delta, pos) => {
        setSize({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
        if (direction.includes('top') || direction.includes('left')) {
          setPosition({ x: Math.round(pos.x), y: Math.round(pos.y) });
        }
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        setSize({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
        if (direction.includes('top') || direction.includes('left')) {
          setPosition({ x: Math.round(pos.x), y: Math.round(pos.y) });
        }
      }}
      minWidth={minWidth}
      minHeight={minHeight}
      dragHandleClassName="terminal-drag-handle"
      enableResizing={isHidden ? false : resizeConfig}
      className="terminal-window"
      style={{
        position: usePortal ? 'absolute' : 'relative',
        zIndex: isTouchLayout ? undefined : zIndex,
        visibility: isHidden ? 'hidden' : 'visible',
        pointerEvents: isHidden ? 'none' : 'auto',
        opacity: isHidden ? 0 : 1,
      }}
      onMouseDown={handleFocus}
    >
      <div
        className="rounded-lg overflow-hidden font-mono text-sm md:text-base h-full flex flex-col border border-zinc-700 shadow-xl"
        style={{ backgroundColor: '#252A30' }}
      >
        <div
          className={`terminal-drag-handle bg-[#2a2f36] px-4 py-3 flex items-center gap-2 border-b border-zinc-700 select-none ${
            isTouchLayout ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
          }`}
          onDoubleClick={isTouchLayout ? undefined : handleMaximize}
        >
          <div
            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 cursor-pointer transition-all"
            onClick={() => closeTerminal(id)}
            title="Close"
          ></div>
          <div
            className={`w-3 h-3 rounded-full bg-[#ffbd2e] transition-all ${isTouchLayout ? 'cursor-default opacity-60' : 'cursor-pointer hover:brightness-110'}`}
            onClick={handleMinimize}
            title="Minimize"
            aria-disabled={isTouchLayout}
          ></div>
          <div
            className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 cursor-pointer transition-all"
            onClick={handleMaximize}
            title={isMaximized ? 'Restore' : 'Maximize'}
          ></div>
          <span className="ml-2 text-neutral-500 text-xs font-mono">{title}</span>
        </div>

        <div className="flex-1 overflow-auto scrollbar-auto-hide">{children}</div>
      </div>
    </Rnd>
  );

  return (
    <div
      ref={containerRef}
      className={`relative transition-opacity duration-300 ${
        terminalState?.isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${usePortal ? 'pointer-events-none' : ''}`}
      style={{
        width: size.width,
        height: size.height,
        visibility: terminalState?.isMinimized ? 'hidden' : 'visible',
      }}
    >
      {usePortal && layer ? createPortal(windowNode, layer) : windowNode}
    </div>
  );
}
