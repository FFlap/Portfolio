'use client';

import { portfolioData } from '@/data/portfolio-data';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';
import DraggableTerminal from './DraggableTerminal';
import { useTerminalCommands } from '@/hooks/useTerminalCommands';
import profileImage from '../../public/assets/profile.jpg';

export default function Hero() {
  const {
    history,
    inputValue,
    setInputValue,
    handleKeydown,
    containerRef,
    inputRef,
  } = useTerminalCommands();

  const { contact } = portfolioData;

  // Terminal body content - passed as children to DraggableTerminal
  const terminalContent = (
    <div 
      ref={containerRef} 
      className="p-6 h-full overflow-y-auto space-y-2" 
      onClick={() => inputRef.current?.focus()}
    >
      {/* Static intro content */}
      <div className="space-y-2">
         <div>
            <span className="text-neutral-500 mr-2">$</span>
            <span className="text-neutral-300">whoami</span>
         </div>

         <div className="space-y-4 mt-4">
            <p className="text-neutral-500 text-lg">
              I&apos;m Nathan Yan, and I enjoy
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight">
              <span className="text-white block mb-2">Building pixel-perfect</span>
              <span className="text-theme">Interactive apps</span>
            </h1>

            <p className="text-neutral-400 text-lg md:text-xl font-mono">
              Full-Stack Developer & AI Researcher
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 pt-2 text-neutral-400">
              <a 
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-theme transition-colors"
                title="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              <a 
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-theme transition-colors"
                title="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a 
                href={`mailto:${contact.email}`}
                className="hover:text-theme transition-colors"
                title="Email"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
              <a
                href="assets/Nathan_Yan_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-theme transition-colors"
                title="Resume"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </a>
            </div>
         </div>
      </div>

      {/* Interactive History */}
      <div className="space-y-1 mt-4">
        {history.map((item, index) => (
          <div key={index} className="font-mono text-sm md:text-base break-words">
            {item.type === 'command' && (
              <div className="flex items-center">
                <span className="text-neutral-500 mr-2">$</span>
                <span className="text-neutral-300">{item.content}</span>
              </div>
            )}
            {item.type === 'response' && (
              <div className="text-neutral-400 whitespace-pre-wrap ml-4">{item.content}</div>
            )}
            {item.type === 'html' && (
              <div className="text-neutral-400 whitespace-pre-wrap ml-4" dangerouslySetInnerHTML={{ __html: item.content }}></div>
            )}
          </div>
        ))}
      </div>

      {/* Input Line */}
      <div className="flex items-center font-mono text-sm md:text-base mt-2">
          <span className="text-neutral-500 mr-2">$</span>
          <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeydown}
              className="bg-transparent border-none outline-none text-neutral-200 flex-1 focus:ring-0 p-0 placeholder-neutral-600"
              spellCheck="false"
              autoComplete="off"
              placeholder="Type 'help'..."
          />
      </div>
    </div>
  );

  return (
    <section id="home" className="min-h-screen relative z-10">
      {/* Fixed layout for profile - stays in place */}
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-8 md:p-16 gap-12">
        {/* Profile Image (Left) */}
        <ScrollReveal type="slide-left" className="w-full md:w-5/12 flex justify-center">
          <div className="w-80 md:w-96 rounded-2xl overflow-hidden glass-panel">
            <Image
              src={profileImage}
              alt="Nathan Yan"
              width={764}
              height={1024}
              priority
              className="w-full h-auto object-contain"
            />
          </div>
        </ScrollReveal>

        {/* Terminal placeholder - reserves space but doesn't affect layout */}
        <div className="w-full md:w-7/12" style={{ height: 'auto' }}>
          <ScrollReveal type="slide-right" delay={0.2}>
            <DraggableTerminal
              id="hero-terminal"
              minWidth={400}
              minHeight={300}
            >
              {terminalContent}
            </DraggableTerminal>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
