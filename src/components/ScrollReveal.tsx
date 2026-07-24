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
  duration = 0.8,
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

    const revealVars: gsap.TweenVars = {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      ease: 'power3.out'
    };

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      let frame = 0;
      let attempts = 0;

      const showWithoutAnimation = () => {
        const target = observeSelector ? document.querySelector(observeSelector) : element;
        if (target) {
          gsap.set(target, { opacity: 1, x: 0, y: 0 });
        } else if (attempts++ < 60) {
          frame = requestAnimationFrame(showWithoutAnimation);
        }
      };

      showWithoutAnimation();
      return () => {
        if (frame) cancelAnimationFrame(frame);
      };
    }

    let animationTarget: Element = element;
    let isIntersecting = false;

    const showTarget = () => {
      gsap.to(animationTarget, revealVars);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isIntersecting = entry.isIntersecting;
          if (entry.isIntersecting) {
            showTarget();
          } else if (entry.boundingClientRect.top > 0) {
            gsap.to(animationTarget, { ...hidden, duration: 0.2, delay: 0, ease: 'power2.in' });
          }
        }
      },
      { rootMargin: REVEAL_ROOT_MARGIN, threshold: 0 }
    );

    let frame = 0;
    let attempts = 0;

    const attachObserver = () => {
      const target = observeSelector ? document.querySelector(observeSelector) : element;

      if (target) {
        animationTarget = target;
        gsap.set(animationTarget, hidden);
        if (isIntersecting) showTarget();
      } else if (attempts++ < 60) {
        frame = requestAnimationFrame(attachObserver);
      } else {
        animationTarget = element;
        gsap.set(animationTarget, hidden);
        if (isIntersecting) showTarget();
      }
    };

    observer.observe(element);
    attachObserver();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      gsap.killTweensOf(animationTarget);
    };
  }, [type, delay, duration, observeSelector]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
