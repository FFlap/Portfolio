'use client';

import { useEffect, useRef, ReactNode } from 'react';
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

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    let startProps: gsap.TweenVars = { opacity: 0 };

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

    const animation = gsap.fromTo(element,
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
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      animation.kill();
    };
  }, [type, delay, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
