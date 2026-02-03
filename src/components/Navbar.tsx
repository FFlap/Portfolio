'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-surface)]/80 backdrop-blur-sm border-b border-white/10 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Brand */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => scrollToSection('home')}>
            <span className="text-xl font-medium text-white tracking-wide font-display">
              Nathan Yan
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-neutral-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">Home</button>
              <button onClick={() => scrollToSection('projects')} className="text-neutral-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">Projects</button>
              <button onClick={() => scrollToSection('experience')} className="text-neutral-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">Experience</button>
              <a href="assets/Nathan_Yan_Resume.pdf" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">Resume</a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-white focus:outline-none transition-colors duration-200">
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? '' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#4F4557]/95 backdrop-blur-sm border-b border-white/10">
          <button onClick={() => scrollToSection('home')} className="text-neutral-400 hover:text-white block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-200">Home</button>
          <button onClick={() => scrollToSection('projects')} className="text-neutral-400 hover:text-white block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-200">Projects</button>
          <button onClick={() => scrollToSection('experience')} className="text-neutral-400 hover:text-white block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-200">Experience</button>
          <a href="assets/Nathan_Yan_Resume.pdf" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-200">Resume</a>
        </div>
      </div>
    </nav>
  );
}
