'use client';

import { ReactNode, useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/gsapPlugins';

interface ScrollRevealProps {
  children: ReactNode;
  type?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';
  delay?: number;
  duration?: number;
  className?: string;
  observeSelector?: string;
}

const REVEAL_ROOT_MARGIN = '0px 0px -8% 0px';

export default function ScrollReveal({
  children,
  type = 'fade-up',
  delay = 0,
  duration = 1,
  className = '',
  observeSelector
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      gsap.set(element, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const hidden: gsap.TweenVars = { opacity: 0 };

    switch (type) {
      case 'fade-up':
        hidden.y = 20;
        break;
      case 'slide-left':
        hidden.x = -20;
        break;
      case 'slide-right':
        hidden.x = 20;
        break;
      case 'fade-in':
      default:
        break;
    }

    gsap.set(element, hidden);

    const revealVars: gsap.TweenVars = {
      opacity: 1,
      x: 0,
      y: 0,
      duration: duration * 0.6,
      delay,
      ease: 'power2.out'
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            gsap.to(element, revealVars);
          } else if (entry.boundingClientRect.top > 0) {
            gsap.to(element, { ...hidden, duration: 0.2, delay: 0, ease: 'power2.in' });
          }
        }
      },
      { rootMargin: REVEAL_ROOT_MARGIN, threshold: 0 }
    );

    let frame = 0;
    let attempts = 0;

    const attachObserver = () => {
      const target = observeSelector ? element.querySelector(observeSelector) : element;

      if (target) {
        observer.observe(target);
      } else if (attempts++ < 60) {
        frame = requestAnimationFrame(attachObserver);
      } else {
        observer.observe(element);
      }
    };

    attachObserver();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      gsap.killTweensOf(element);
    };
  }, [type, delay, duration, observeSelector]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
