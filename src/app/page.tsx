'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import ProjectModal from '@/components/ProjectModal';

// Dynamically import BackgroundScene to avoid SSR issues with Three.js
const BackgroundScene = dynamic(() => import('@/components/BackgroundScene'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* 3D Background (Fixed) */}
      <BackgroundScene />

      {/* Main Content (Scrollable) */}
      <main className="relative z-10">
        <Hero />
        <Projects />
        <Experience />

        {/* Footer */}
        <footer className="py-8 text-center text-gray-500 text-sm relative z-10 bg-black/50 backdrop-blur-sm">
          <p>Built with Next.js, Three.js, and TailwindCSS</p>
          <p>&copy; 2025 Nathan Yan</p>
        </footer>
      </main>

      {/* Global Modal */}
      <ProjectModal />
    </>
  );
}
