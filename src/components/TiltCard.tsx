'use client';

import { useRef, ReactNode, MouseEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  maxAngleX?: number;
  maxAngleY?: number;
  scale?: number;
}

export default function TiltCard({
  children,
  maxAngleX = 10,
  maxAngleY = 10,
  scale = 1.05
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxAngleX;
    const rotateY = ((x - centerX) / centerX) * maxAngleY;

    const shadowX = rotateY * -1;
    const shadowY = rotateX * 1;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    cardRef.current.style.transition = 'transform 0.1s ease-out';
    cardRef.current.style.boxShadow = `${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.5)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    cardRef.current.style.boxShadow = 'none';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}
