'use client';

import { portfolioData } from '@/data/portfolio-data';
import ScrollReveal from './ScrollReveal';
import DraggableTerminal from './DraggableTerminal';
import { useTerminalCommands } from '@/hooks/useTerminalCommands';

export default function Experience() {
  const { experience } = portfolioData;
  const {
    history,
    inputValue,
    setInputValue,
    handleKeydown,
    containerRef,
    inputRef,
  } = useTerminalCommands();

  const experienceContent = (
    <div 
      ref={containerRef}
      className="p-6 h-full overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Static Experience Content */}
      <div className="relative">
        <div className="space-y-12">
          {experience.map((job, i) => (
            <div key={job.company} className="relative pl-20">
              {/* Connecting Line to Next Node */}
              {i !== experience.length - 1 && (
                <div
                  className="absolute left-6 top-12 w-px bg-white/10 -z-10"
                  style={{ height: 'calc(100% + 3rem)' }}
                ></div>
              )}

              {/* Timeline Logo Node */}
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute left-0 top-0 w-12 h-12 bg-[var(--bg-surface)] rounded-full border border-zinc-700 flex items-center justify-center z-20 group hover:border-theme transition-colors duration-200 overflow-hidden cursor-pointer"
              >
                {job.logo ? (
                  <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-neutral-400 group-hover:text-theme transition-colors">
                    {job.company.charAt(0)}
                  </span>
                )}
              </a>

              {/* Content */}
              <div className="relative">
                <h3 className="text-2xl font-bold text-white mb-1">
                  {job.role}
                </h3>

                <div className="text-lg text-neutral-300 mb-2 font-medium">
                  {job.company}
                </div>

                <div className="text-neutral-500 text-sm mb-6 font-mono flex items-center gap-3">
                  <span className="bg-white/5 px-2 py-1 rounded text-xs">{job.period}</span>
                  <span>{job.location}</span>
                </div>

                <div className="text-neutral-400 leading-relaxed max-w-2xl">
                  <ul className="space-y-3">
                    {job.description.map((desc, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-neutral-600 rounded-full flex-shrink-0"></span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
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
    <section id="experience" className="min-h-screen py-20 px-4 relative z-10 flex flex-col justify-center">
      <div className="max-w-5xl mx-auto w-full flex justify-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-16 text-center text-white">
          Experience
        </h2>
      </div>

      <div className="max-w-5xl mx-auto w-full">
        <ScrollReveal type="slide-left">
          <DraggableTerminal
            minWidth={400}
            minHeight={300}
            title="~/experience"
          >
            {experienceContent}
          </DraggableTerminal>
        </ScrollReveal>
      </div>
    </section>
  );
}
