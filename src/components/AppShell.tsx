'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import ProjectModal from '@/components/ProjectModal';
import AppDock from '@/components/AppDock';
import { useThreeMode } from '@/hooks/useThreeMode';

const BackgroundScene = dynamic(() => import('@/components/BackgroundScene'), {
  ssr: false,
});

export default function AppShell({ children }: { children: ReactNode }) {
  const { isThreeMode } = useThreeMode();

  return (
    <>
      <Navbar />
      {isThreeMode && <BackgroundScene />}
      {children}
      <ProjectModal />
      <AppDock />
      <div
        id="terminal-window-layer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 0,
          overflow: 'visible',
          pointerEvents: 'none',
          zIndex: 40,
        }}
      />
    </>
  );
}
