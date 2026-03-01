'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isScrollTriggerRegistered = false;

export function ensureScrollTriggerRegistered() {
  if (typeof window === 'undefined') {
    return false;
  }

  if (isScrollTriggerRegistered) {
    return true;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);
    isScrollTriggerRegistered = true;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Failed to register ScrollTrigger. Scroll animations are disabled.', error);
    }
    return false;
  }

  return true;
}

export { gsap, ScrollTrigger };
