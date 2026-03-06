'use client';

import { useTerminalCommands } from '@/hooks/useTerminalCommands';
import ScrollReveal from './ScrollReveal';
import DraggableTerminal from './DraggableTerminal';

export default function ProjectsTerminal() {
  const {
    history,
    inputValue,
    setInputValue,
    handleKeydown,
    containerRef,
    inputRef,
  } = useTerminalCommands();

  return (
    <ScrollReveal type="fade-in">
      <DraggableTerminal
        id="projects-terminal"
        title="~/projects"
        minWidth={420}
        minHeight={190}
        defaultHeight={250}
      >
        <div
          ref={containerRef}
          className="h-full overflow-y-auto p-6 scrollbar-auto-hide"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-display font-bold leading-tight text-white md:text-4xl">
                Projects
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-400 md:text-base">
                These are the projects I&apos;ve been building through hackathons, coursework, and side experiments.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            {history.map((item, index) => (
              <div key={index} className="break-words font-mono text-sm md:text-base">
                {item.type === 'command' && (
                  <div className="flex items-center">
                    <span className="mr-2 text-neutral-500">$</span>
                    <span className="text-neutral-300">{item.content}</span>
                  </div>
                )}
                {item.type === 'response' && (
                  <div className="ml-4 whitespace-pre-wrap text-neutral-400">{item.content}</div>
                )}
                {item.type === 'html' && (
                  <div
                    className="ml-4 whitespace-pre-wrap text-neutral-400"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  ></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center font-mono text-sm md:text-base">
            <span className="mr-2 text-neutral-500">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeydown}
              className="flex-1 border-none bg-transparent p-0 text-neutral-200 outline-none placeholder-neutral-600 focus:ring-0"
              spellCheck="false"
              autoComplete="off"
              placeholder="Type 'help'..."
            />
          </div>
        </div>
      </DraggableTerminal>
    </ScrollReveal>
  );
}
