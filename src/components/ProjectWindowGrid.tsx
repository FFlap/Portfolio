'use client';

import Image from 'next/image';
import type { Project } from '@/data/portfolio-data';
import { useModal } from '@/hooks/useModal';
import { useTerminalState } from '@/hooks/useTerminalState';
import ScrollReveal from './ScrollReveal';
import DraggableTerminal from './DraggableTerminal';

interface ProjectWindowGridProps {
  projects: Project[];
  idPrefix: string;
}

export default function ProjectWindowGrid({ projects, idPrefix }: ProjectWindowGridProps) {
  const { openModal } = useModal();
  const { terminals } = useTerminalState();

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => {
        const terminalId = `${idPrefix}-${project.slug}`;
        const preview = project.thumbnail ?? project.images?.[0];
        const isUnoptimizedPreview =
          typeof preview === 'string' && (preview.startsWith('data:') || preview.endsWith('.svg'));
        const previewContainerClassName =
          project.thumbnail && project.thumbnailBackground === 'white'
            ? 'relative h-40 w-full shrink-0 overflow-hidden border-b border-white/5 bg-white'
            : 'relative h-40 w-full shrink-0 overflow-hidden border-b border-white/5';
        const defaultScale = project.thumbnailScale ?? (project.thumbnailFit === 'contain' ? 1.25 : 1);
        const hoverScale = project.thumbnailScale ? project.thumbnailScale * 1.15 : (project.thumbnailFit === 'contain' ? 1.3 : 1.05);

        const previewClassName =
          project.thumbnail && project.thumbnailFit === 'contain'
            ? 'object-contain p-1 opacity-90 transition-all duration-300 [transform:scale(var(--thumb-scale))] hover:[transform:scale(var(--thumb-hover-scale))] hover:opacity-100'
            : 'object-cover opacity-90 transition-all duration-300 [transform:scale(var(--thumb-scale))] hover:[transform:scale(var(--thumb-hover-scale))] hover:opacity-100';

        return (
          <div
            key={project.name}
            className="relative min-w-0"
            style={{ zIndex: terminals[terminalId]?.zIndex ?? 'auto' }}
          >
            <ScrollReveal delay={(index % 3) * 0.08} observeSelector=".terminal-window">
              <DraggableTerminal
                id={terminalId}
                title={`~/projects/${project.slug}`}
                minWidth={350}
                minHeight={280}
                defaultHeight={540}
              >
                <div
                  onClick={() => openModal(project)}
                  className="flex h-full cursor-pointer flex-col"
                >
                  <div className={previewContainerClassName}>
                    {preview && (
                      <Image
                        src={preview}
                        alt={project.name}
                        fill
                        sizes="(min-width: 1024px) 350px, (min-width: 768px) 50vw, 100vw"
                        unoptimized={isUnoptimizedPreview}
                        className={previewClassName}
                        style={{
                          '--thumb-scale': defaultScale,
                          '--thumb-hover-scale': hoverScale,
                        } as React.CSSProperties}
                      />
                    )}
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col p-5">
                    <div className="mb-2 flex items-start justify-between shrink-0">
                      <h3 className="min-w-0 flex-1 break-words text-lg font-medium text-[var(--text-primary)] transition-colors duration-200 hover:text-theme">
                        {project.name}
                      </h3>
                      <span className="ml-2 shrink-0 rounded border border-white/10 px-2 py-1 text-xs text-neutral-500">
                        {project.date}
                      </span>
                    </div>

                    <p className="mb-3 shrink-0 font-mono text-sm text-theme" style={{ opacity: 0.8 }}>
                      {project.tech}
                    </p>

                    <div className="flex-none space-y-2 text-sm text-neutral-400 sm:min-h-0 sm:flex-1 sm:overflow-y-auto sm:pr-1 sm:scrollbar-auto-hide">
                      {project.description.map((desc, descIndex) => (
                        <div key={descIndex} className={`${descIndex === 0 ? 'flex' : 'hidden sm:flex'} items-start`}>
                          <span className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-600"></span>
                          <span className="min-w-0 break-words">{desc}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto shrink-0 border-t border-white/5 pt-3">
                      <span className="font-mono text-xs text-neutral-500">$ click to view details</span>
                    </div>
                  </div>
                </div>
              </DraggableTerminal>
            </ScrollReveal>
          </div>
        );
      })}
    </div>
  );
}
