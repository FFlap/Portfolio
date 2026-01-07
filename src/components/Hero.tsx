'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { portfolioData } from '@/data/portfolio-data';
import { useTheme, Theme } from '@/hooks/useTheme';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import ScrollReveal from './ScrollReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

interface HistoryItem {
  type: 'command' | 'response' | 'html';
  content: string;
}

export default function Hero() {
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isInputActive, setIsInputActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { theme, setTheme } = useTheme();

  const { contact, skills } = portfolioData;

  const scrollToBottom = useCallback(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (!terminalOutputRef.current) return;

    const container = terminalOutputRef.current;
    container.innerHTML = '';
    setIsInputActive(false);

    const skillLines: string[] = [];
    skills.forEach(category => {
      skillLines.push(`> Loading module: ${category.name}...`);
      category.skills.forEach(skill => {
        skillLines.push(`  - ${skill}`);
      });
      skillLines.push('__SPACER__'); // Use a marker instead of a space
    });

    const tl = gsap.timeline({ repeat: 0 });

    skillLines.forEach((line) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'font-mono text-sm md:text-base';

      if (line.startsWith('>')) {
        lineEl.className += ' text-yellow-400 font-bold mt-2';
      } else if (line === '__SPACER__') {
        // Add an empty spacer line without any text animation
        lineEl.innerHTML = '&nbsp;';
        lineEl.className += ' h-4';
        container.appendChild(lineEl);
        tl.to({}, { duration: 0.05 });
        return;
      } else {
        lineEl.className += ' text-green-300';
      }

      container.appendChild(lineEl);
      lineEl.textContent = '';

      // Add each character one by one using tl.call() - avoids GSAP object animation issues
      for (let i = 0; i <= line.length; i++) {
        const charIndex = i; // Capture in closure
        tl.call(() => {
          lineEl.textContent = line.substring(0, charIndex);
          scrollToBottom();
        }, [], `+=${0.01}`);
      }
    });

    tl.call(() => {
      const helpEl = document.createElement('div');
      helpEl.className = 'text-white mt-4 font-mono text-sm md:text-base';
      helpEl.textContent = "Type 'help' to get started...";
      container.appendChild(helpEl);
      setIsInputActive(true);
    });

    return () => {
      tl.kill();
    };
  }, [skills, scrollToBottom]);

  const processCommand = () => {
    const command = inputValue.trim().toLowerCase();

    setHistory(prev => [...prev, { type: 'command', content: command }]);

    switch (command) {
      case 'help':
        setHistory(prev => [...prev, {
          type: 'response',
          content: `Available commands:
  - help: Show this help message
  - socials: List social media links
  - theme <name>: Change theme (purple, green, orange, blue)
  - restart: Replay the intro animation
  - clear: Clear the terminal history
  - whoami: Display user info`
        }]);
        break;

      case 'restart':
        window.location.reload();
        return;

      case 'clear':
        setHistory([]);
        if (terminalOutputRef.current) {
          terminalOutputRef.current.innerHTML = '';
        }
        break;

      case 'whoami':
        setHistory(prev => [...prev, { type: 'response', content: 'Nathan Yan - Full Stack Developer & AI Researcher' }]);
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

        setHistory(prev => [...prev, { type: 'response', content: `Command not found: ${command}. Type 'help' for available commands.` }]);
    }

    setInputValue('');
    setTimeout(scrollToBottom, 100);
  };

  const handleKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand();
    }
  };

  return (
    <section id="home" className="min-h-screen flex flex-col md:flex-row items-center justify-center p-8 relative z-10">
      {/* Profile Image (Right on desktop, First on mobile) */}
      <ScrollReveal type="slide-left" className="w-full md:w-1/2 p-4 flex flex-col justify-center items-center md:order-2">
        <div className="relative w-64 h-64 md:w-96 md:h-96 mb-8">
          {/* Glitch/Neon Effect Border */}
          <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-pulse opacity-50 pointer-events-none"></div>
          <div className="absolute inset-2 border-2 border-green-400 rounded-full opacity-30 pointer-events-none"></div>

          {/* Image Container */}
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-600 shadow-[0_0_20px_rgba(168,85,247,0.5)] relative z-10 bg-gray-900">
            <img src="/assets/profile.jpg" alt="Nathan Yan" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-6 z-20">
          {/* GitHub */}
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-500 hover:scale-110 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>

          {/* Email */}
          <a href={`mailto:${contact.email}`} className="text-gray-400 hover:text-green-400 hover:scale-110 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
        </div>
      </ScrollReveal>

      {/* Terminal Interface (Left on desktop, Second on mobile) */}
      <ScrollReveal type="slide-right" delay={0.2} className="w-full md:w-1/2 p-4 md:order-1">
        <div className="bg-[#0a0a0a] border border-gray-700 rounded-lg shadow-2xl overflow-hidden font-mono text-sm md:text-base">
          {/* Terminal Header */}
          <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-gray-400 text-xs">user@portfolio:~</span>
          </div>

          {/* Terminal Body */}
          <div ref={terminalContainerRef} className="p-6 text-green-400 h-96 overflow-y-auto">
            <div>
              <div className="mb-4">
                <span className="text-blue-400">➜</span> <span className="text-cyan-400">~</span> <span className="text-white">whoami</span>
              </div>
              <div className="mb-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">Nathan Yan</h1>
                <p className="text-xl text-gray-300">Full Stack Developer & AI Researcher</p>
              </div>

              <div className="mb-4">
                <span className="text-blue-400">➜</span> <span className="text-cyan-400">~</span> <span className="text-white">cat skills.txt</span>
              </div>
            </div>

            {/* Typing Animation Container */}
            <div ref={terminalOutputRef} className="space-y-1">
              {/* Skills will be injected here by GSAP */}
            </div>

            {/* Interactive History */}
            <div className="space-y-1 mt-2">
              {history.map((item, index) => (
                <div key={index} className="font-mono text-sm md:text-base">
                  {item.type === 'command' && (
                    <div className="flex items-center">
                      <span className="text-blue-400 mr-2">➜</span>
                      <span className="text-cyan-400 mr-2">~</span>
                      <span className="text-white">{item.content}</span>
                    </div>
                  )}
                  {item.type === 'response' && (
                    <div className="text-gray-300 whitespace-pre-wrap ml-4">{item.content}</div>
                  )}
                  {item.type === 'html' && (
                    <div className="text-gray-300 whitespace-pre-wrap ml-4" dangerouslySetInnerHTML={{ __html: item.content }}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Line */}
            {isInputActive && (
              <div className="mt-2 flex items-center font-mono text-sm md:text-base animate-fade-in">
                <span className="text-blue-400 mr-2">➜</span>
                <span className="text-cyan-400 mr-2">~</span>
                <input
                  ref={terminalInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeydown}
                  className="bg-transparent border-none outline-none text-white flex-1 focus:ring-0 p-0"
                  spellCheck="false"
                  autoComplete="off"
                />
              </div>
            )}

            {/* Loading Indicator (only when input is NOT active) */}
            {!isInputActive && (
              <div className="mt-4 animate-pulse">
                <span className="text-blue-400">➜</span> <span className="text-cyan-400">~</span> <span className="inline-block w-2 h-5 bg-white align-middle ml-1"></span>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
