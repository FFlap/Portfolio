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
    </>
  );
}
