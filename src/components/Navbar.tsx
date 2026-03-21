'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const renderNavAction = (label: string, sectionId: string, href: string, className: string) => {
    if (isHomePage) {
      return (
        <button type="button" onClick={() => scrollToSection(sectionId)} className={className}>
          {label}
        </button>
      );
    }

    return (
      <Link href={href} onClick={handleMenuClose} className={className}>
        {label}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-surface)]/80 backdrop-blur-sm border-b border-white/10 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Brand */}
          {isHomePage ? (
            <button type="button" className="flex-shrink-0 cursor-pointer" onClick={() => scrollToSection('home')}>
              <span className="text-xl font-medium text-white tracking-wide font-display">
                Nathan Yan
              </span>
            </button>
          ) : (
            <Link href="/" onClick={handleMenuClose} className="flex-shrink-0">
              <span className="text-xl font-medium text-white tracking-wide font-display">
                Nathan Yan
              </span>
            </Link>
          )}

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {renderNavAction('Home', 'home', '/#home', 'text-neutral-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200')}
              <Link href="/projects" onClick={handleMenuClose} className="text-neutral-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">
                Projects
              </Link>
              {renderNavAction('Experience', 'experience', '/#experience', 'text-neutral-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200')}
              <a
                href="/assets/Nathan_Yan_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleMenuClose}
                className="text-neutral-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Resume
              </a>
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
        <div className="bg-[#2a2f36]/95 backdrop-blur-sm">
          {renderNavAction('Home', 'home', '/#home', 'text-neutral-300 hover:bg-white/5 hover:text-white block px-4 py-3 text-base font-medium w-full text-left transition-colors duration-200')}
          <Link href="/projects" onClick={handleMenuClose} className="text-neutral-300 hover:bg-white/5 hover:text-white block px-4 py-3 text-base font-medium w-full text-left transition-colors duration-200">
            Projects
          </Link>
          {renderNavAction('Experience', 'experience', '/#experience', 'text-neutral-300 hover:bg-white/5 hover:text-white block px-4 py-3 text-base font-medium w-full text-left transition-colors duration-200')}
          <a
            href="/assets/Nathan_Yan_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleMenuClose}
            className="text-neutral-300 hover:bg-white/5 hover:text-white block px-4 py-3 text-base font-medium w-full text-left transition-colors duration-200"
          >
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
}
