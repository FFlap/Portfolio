'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

interface ScrollTypingProps {
  text: string;
  startDelay?: number;
  cursorColor?: string;
  className?: string;
}

export default function ScrollTyping({
  text,
  startDelay = 0,
  cursorColor = '#4ade80',
  className = ''
}: ScrollTypingProps) {
  const elementRef = useRef<HTMLHeadingElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!elementRef.current || hasAnimated) return;

    const element = elementRef.current;
    element.textContent = '';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateTyping();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(element);

    function animateTyping() {
      element.innerHTML = '';

      const wrapper = document.createElement('span');
      wrapper.style.display = 'inline-block';
      wrapper.style.borderRight = `2px solid ${cursorColor}`;
      wrapper.style.paddingRight = '5px';
      element.appendChild(wrapper);

      const proxy = { value: 0 };
      const totalLength = text.length;

      gsap.to(proxy, {
        duration: totalLength * 0.05,
        value: totalLength,
        delay: startDelay,
        ease: 'none',
        onUpdate: () => {
          const currentLength = Math.floor(proxy.value);

          let html = '';
          for (let i = 0; i < currentLength; i++) {
            const char = text[i];
            if (char === '<' || (i >= text.length - 2)) {
              html += `<span style="color: ${cursorColor}">${char}</span>`;
            } else {
              html += `<span class="text-white">${char}</span>`;
            }
          }

          wrapper.innerHTML = html;
        },
        onComplete: () => {
          gsap.to(wrapper, {
            borderRightColor: 'transparent',
            repeat: -1,
            yoyo: true,
            duration: 0.5
          });
        }
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [text, startDelay, cursorColor, hasAnimated]);

  return (
    <h2 ref={elementRef} className={className}>
      {text}
    </h2>
  );
}
