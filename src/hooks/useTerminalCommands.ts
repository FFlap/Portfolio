'use client';

import { useState, useCallback, useRef } from 'react';
import { portfolioData } from '@/data/portfolio-data';
import { useTheme, Theme } from '@/hooks/useTheme';
import { useThreeMode } from '@/hooks/useThreeMode';

interface HistoryItem {
  type: 'command' | 'response' | 'html';
  content: string;
}

export function useTerminalCommands() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { theme, setTheme } = useTheme();
  const { isThreeMode, setThreeMode } = useThreeMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { contact, skills, experience } = portfolioData;

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  const processCommand = useCallback(() => {
    const command = inputValue.trim().toLowerCase();
    if (!command) return;

    setHistory(prev => [...prev, { type: 'command', content: command }]);

    switch (command) {
      case 'help':
        setHistory(prev => [...prev, {
          type: 'response',
          content: `Available commands:
  - help: Show this help message
  - skills: Display technical skills
  - socials: List social media links
  - theme <name>: Change theme (purple, green, orange, blue)
  - background <3d|simple>: Switch background mode
  - clear: Clear the terminal history`
        }]);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'socials':
        setHistory(prev => [...prev, {
          type: 'html',
          content: `GitHub: <a href="${contact.github}" target="_blank" class="text-theme hover:underline">${contact.github}</a>
LinkedIn: <a href="${contact.linkedin}" target="_blank" class="text-theme hover:underline">${contact.linkedin}</a>
Email: <a href="mailto:${contact.email}" class="text-theme hover:underline">${contact.email}</a>`
        }]);
        break;

      case 'skills':
        const skillsOutput = skills.map(category => 
          `<span class="text-theme font-bold">${category.name}:</span> ${category.skills.join(', ')}`
        ).join('\n');
        
        setHistory(prev => [...prev, { type: 'html', content: skillsOutput }]);
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
              setHistory(prev => [...prev, { type: 'response', content: 'Background mode set to Simple' }]);
            } else {
              setHistory(prev => [...prev, { type: 'response', content: 'Invalid mode. Usage: background <3d|simple>' }]);
            }
          } else {
            setHistory(prev => [...prev, { type: 'response', content: `Current mode: ${isThreeMode ? '3d' : 'simple'}. Usage: background <3d|simple>` }]);
          }
          break;
        }

        if (command.startsWith('show ')) {
          const companyName = command.slice(5).toLowerCase();
          const job = experience.find(j => 
            j.company.toLowerCase().includes(companyName)
          );
          
          if (job) {
            const details = `<span class="text-theme font-bold">${job.role}</span> at ${job.company}
<span class="text-neutral-500">${job.period} | ${job.location}</span>

${job.description.map(d => `• ${d}`).join('\n')}`;
            
            setHistory(prev => [...prev, { type: 'html', content: details }]);
          } else {
            setHistory(prev => [...prev, { 
              type: 'response', 
              content: `Company not found: "${companyName}". Type 'experience' to see available companies.` 
            }]);
          }
          break;
        }

        setHistory(prev => [...prev, { type: 'response', content: `Command not found: ${command}. Type 'help' for available commands.` }]);
    }

    setInputValue('');
    setTimeout(scrollToBottom, 50);
  }, [inputValue, theme, isThreeMode, setTheme, setThreeMode, contact, skills, experience, scrollToBottom]);

  const handleKeydown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand();
    }
  }, [processCommand]);

  return {
    history,
    inputValue,
    setInputValue,
    handleKeydown,
    containerRef,
    inputRef,
  };
}
