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
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Brand */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => scrollToSection('home')}>
            <span className="text-xl font-bold text-white font-mono tracking-wide">
              <span className="text-green-400">&lt;</span> NY <span className="text-green-400">/&gt;</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-300 hover:text-white hover:bg-gray-700/50 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</button>
              <button onClick={() => scrollToSection('projects')} className="text-gray-300 hover:text-white hover:bg-gray-700/50 px-3 py-2 rounded-md text-sm font-medium transition-colors">Projects</button>
              <button onClick={() => scrollToSection('experience')} className="text-gray-300 hover:text-white hover:bg-gray-700/50 px-3 py-2 rounded-md text-sm font-medium transition-colors">Experience</button>
              <a href="/assets/Nathan_Yan_Resume.pdf" target="_blank" className="text-gray-300 hover:text-white hover:bg-gray-700/50 px-3 py-2 rounded-md text-sm font-medium transition-colors">Resume</a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
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
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
          <button onClick={() => scrollToSection('home')} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">Home</button>
          <button onClick={() => scrollToSection('projects')} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">Projects</button>
          <button onClick={() => scrollToSection('experience')} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">Experience</button>
          <a href="/assets/Nathan_Yan_Resume.pdf" target="_blank" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">Resume</a>
        </div>
      </div>
    </nav>
  );
}
