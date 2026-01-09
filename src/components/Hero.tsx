'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { portfolioData } from '@/data/portfolio-data';
import { useTheme, Theme } from '@/hooks/useTheme';
import { useThreeMode } from '@/hooks/useThreeMode';
import ScrollReveal from './ScrollReveal';

interface HistoryItem {
  type: 'command' | 'response' | 'html';
  content: string;
}

export default function Hero() {
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  // Start input as active comfortably
  const [inputValue, setInputValue] = useState('');
  const { theme, setTheme } = useTheme();
  const { isThreeMode, setThreeMode } = useThreeMode();

  const { contact } = portfolioData;

  const scrollToBottom = useCallback(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, []);

  // UseEffect to focus input on mount
  useEffect(() => {
    if (terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  }, []);

  const processCommand = () => {
    const command = inputValue.trim().toLowerCase();

    setHistory(prev => [...prev, { type: 'command', content: command }]);

    switch (command) {
      case 'help':
        setHistory(prev => [...prev, {
          type: 'response',
          content: `Available commands:
  - help: Show this help message
  - background <3d|simple>: Switch background mode
  - socials: List social media links
  - theme <name>: Change theme (purple, green, orange, blue)
  - clear: Clear the terminal history`
        }]);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'socials':
        setHistory(prev => [...prev, {
          type: 'html',
          content: `GitHub: <a href="${contact.github}" target="_blank" class="text-blue-400 hover:underline">${contact.github}</a>
LinkedIn: <a href="${contact.linkedin}" target="_blank" class="text-blue-400 hover:underline">${contact.linkedin}</a>
Email: <a href="mailto:${contact.email}" class="text-blue-400 hover:underline">${contact.email}</a>`
        }]);
        break;

      default:
        if (command.startsWith('theme')) {
          const args = command.split(' ');
          if (args.length > 1) {
            const themeName = args[1] as Theme;
            if (['purple', 'green', 'orange', 'blue'].includes(themeName)) {
              setTheme(themeName);
              setHistory(prev => [...prev, { type: 'response', content: `Theme switched to ${themeName}` }]);
            } else {
              setHistory(prev => [...prev, { type: 'response', content: `Invalid theme. Available themes: purple, green, orange, blue` }]);
            }
          } else {
            setHistory(prev => [...prev, { type: 'response', content: `Current theme: ${theme}. Usage: theme <name>` }]);
          }
          break;
        }

        if (command.startsWith('background')) {
          const args = command.split(' ');
          if (args.length > 1) {
            const mode = args[1];
            if (mode === '3d') {
              setThreeMode(true);
              setHistory(prev => [...prev, { type: 'response', content: 'Background mode set to 3D' }]);
            } else if (mode === 'simple') {
              setThreeMode(false);
              setHistory(prev => [...prev, { type: 'response', content: 'Background mode set to Simple (Minimalist)' }]);
            } else {
              setHistory(prev => [...prev, { type: 'response', content: 'Invalid mode. Usage: background <3d|simple>' }]);
            }
          } else {
             setHistory(prev => [...prev, { type: 'response', content: `Current mode: ${isThreeMode ? '3d' : 'simple'}. Usage: background <3d|simple>` }]);
          }
          break;
        }

        setHistory(prev => [...prev, { type: 'response', content: `Command not found: ${command}. Type 'help' for available commands.` }]);
    }

    setInputValue('');
    setTimeout(scrollToBottom, 50);
  };

  const handleKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand();
    }
  };

  return (
    <section id="home" className="min-h-screen flex flex-col md:flex-row items-center justify-center p-8 md:p-16 relative z-10 gap-10">
      
      {/* Profile Image (Left) */}
      <ScrollReveal type="slide-left" className="w-full md:w-5/12 flex justify-center">
        <div className="relative w-64 md:w-80">
          <div className="w-full rounded-3xl overflow-hidden border-2 border-gray-700 shadow-2xl relative z-10 bg-gray-900">
            <img 
              src="/assets/profile.jpg" 
              alt="Nathan Yan" 
              className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500" 
            />
          </div>
          {/* subtle decoration behind */}
          <div className="absolute -inset-4 bg-purple-500/10 rounded-3xl -z-10 blur-xl"></div>
        </div>
      </ScrollReveal>

      {/* Terminal Interface (Right) */}
      <ScrollReveal type="slide-right" delay={0.2} className="w-full md:w-7/12 text-left">
        <div className="bg-[#0a0a0a] border border-gray-700 rounded-lg shadow-2xl overflow-hidden font-mono text-sm md:text-base">
          {/* Terminal Header */}
          <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-gray-400 text-xs font-mono">user@portfolio:~</span>
          </div>
          
          {/* Terminal Body content */}
          <div ref={terminalContainerRef} className="p-6 h-auto max-h-[500px] overflow-y-auto space-y-2" onClick={() => terminalInputRef.current?.focus()}>
            
            {/* The "Example" Content as static terminal output */}
            <div className="space-y-2">
               <div>
                  <span className="text-green-400 font-bold mr-2">➜</span>
                  <span className="text-cyan-400 font-bold mr-2">~</span>
                  <span className="text-white">whoami</span>
               </div>
               
               <div className="space-y-4">
                  <p className="text-gray-300 text-lg md:text-xl font-medium font-mono">
                    I'm Nathan Yan, and I enjoy
                  </p>
                  
                  <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                    Building pixel-perfect <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse">
                      Interactive apps
                    </span>
                    <span className="ml-2">🔥</span>
                  </h1>

                  <p className="text-lg md:text-xl text-gray-400 font-medium font-sans">
                    Full-Stack Developer & AI Researcher
                  </p>

                  {/* Social Icons inside the terminal output */}
                  <div className="flex space-x-6 pt-2">
                    <a href={contact.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </a>
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                    <a href={`mailto:${contact.email}`} className="text-gray-400 hover:text-green-400 transition-all duration-300 transform hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </a>
                    <a href="/assets/Nathan_Yan_Resume.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-all duration-300 transform hover:scale-110">
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
            <div className="space-y-1">
              {history.map((item, index) => (
                <div key={index} className="font-mono text-sm md:text-base break-words">
                  {item.type === 'command' && (
                    <div className="flex items-center">
                      <span className="text-green-400 font-bold mr-2">➜</span>
                      <span className="text-cyan-400 font-bold mr-2">~</span>
                      <span className="text-white">{item.content}</span>
                    </div>
                  )}
                  {item.type === 'response' && (
                    <div className="text-gray-300 whitespace-pre-wrap ml-6">{item.content}</div>
                  )}
                  {item.type === 'html' && (
                    <div className="text-gray-300 whitespace-pre-wrap ml-6" dangerouslySetInnerHTML={{ __html: item.content }}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Line */}
            <div className="flex items-center font-mono text-sm md:text-base animate-fade-in group">
                <span className="text-green-400 font-bold mr-2">➜</span>
                <span className="text-cyan-400 font-bold mr-2">~</span>
                <input
                    ref={terminalInputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeydown}
                    className="bg-transparent border-none outline-none text-white flex-1 focus:ring-0 p-0"
                    spellCheck="false"
                    autoComplete="off"
                    placeholder="Type 'help'..."
                />
            </div>

          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
