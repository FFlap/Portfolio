'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import ProjectModal from '@/components/ProjectModal';
import { useThreeMode } from '@/hooks/useThreeMode';

// Dynamically import BackgroundScene to avoid SSR issues with Three.js
const BackgroundScene = dynamic(() => import('@/components/BackgroundScene'), {
  ssr: false,
});

import AppDock from '@/components/AppDock';

export default function Home() {
  const { isThreeMode } = useThreeMode();
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* 3D Background (Fixed) */}
      {isThreeMode && <BackgroundScene />}

      {/* Main Content (Scrollable) */}
      <main className="relative z-10">
        <Hero />
        <Experience />
        <Projects />

        {/* Footer */}
        <footer className="py-12 text-center border-t border-neutral-800">
          <p className="text-neutral-500 text-sm">Built with Next.js and TailwindCSS</p>
          <p className="text-neutral-600 text-xs mt-1">&copy; 2025 Nathan Yan</p>
        </footer>
      </main>

      {/* Global Modal */}
      <ProjectModal />

      {/* App Dock */}
      <AppDock />
    </>
  );
}
