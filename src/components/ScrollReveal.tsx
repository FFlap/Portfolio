'use client';

import { ReactNode, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  type?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  type = 'fade-up',
  delay = 0,
  duration = 1,
  className = ''
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(element, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const startProps: gsap.TweenVars = { opacity: 0 };

    // Subtler animations - reduced movement
    switch (type) {
      case 'fade-up':
        startProps.y = 20;
        break;
      case 'slide-left':
        startProps.x = -20;
        break;
      case 'slide-right':
        startProps.x = 20;
        break;
      case 'fade-in':
      default:
        break;
    }

    let refreshRaf: number | null = null;
    const scheduleRefresh = () => {
      if (typeof window === 'undefined') return;
      if (refreshRaf !== null) return;
      refreshRaf = window.requestAnimationFrame(() => {
        refreshRaf = null;
        ScrollTrigger.refresh();
      });
    };

    const animation = gsap.fromTo(
      element,
      startProps,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: duration * 0.6, // Faster, subtler
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true
        }
      }
    );

    scheduleRefresh();

    const handleResize = () => scheduleRefresh();
    const handleLoad = () => scheduleRefresh();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('load', handleLoad);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => scheduleRefresh());
      resizeObserver.observe(element);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => scheduleRefresh()).catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('load', handleLoad);
      resizeObserver?.disconnect();
      if (refreshRaf !== null) {
        window.cancelAnimationFrame(refreshRaf);
      }
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [type, delay, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
