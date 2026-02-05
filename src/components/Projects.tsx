'use client';

import { portfolioData } from '@/data/portfolio-data';
import Image from 'next/image';
import { useModal } from '@/hooks/useModal';
import ScrollReveal from './ScrollReveal';
import DraggableTerminal from './DraggableTerminal';

export default function Projects() {
  const { projects } = portfolioData;
  const { openModal } = useModal();

  // Create URL-friendly slug from project name
  const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <section id="projects" className="min-h-screen py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-16 text-center text-[var(--text-primary)]">
          Projects
        </h2>

        {/* Project Grid with Draggable Terminals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <ScrollReveal key={project.name} delay={i * 0.1}>
              {(() => {
                const preview = project.images?.[0];
                const isDataPreview = typeof preview === 'string' && preview.startsWith('data:');

                return (
              <DraggableTerminal 
                title={`~/projects/${slugify(project.name)}`}
                minWidth={350}
                minHeight={280}
                defaultHeight={540}
              >
                <div
                  onClick={() => openModal(project)}
                  className="cursor-pointer h-full flex flex-col"
                >
                  {/* Image Preview */}
                  <div className="relative h-40 w-full overflow-hidden border-b border-white/5 shrink-0">
                    {preview && (
                      <Image
                        src={preview}
                        alt={project.name}
                        fill
                        sizes="(min-width: 1024px) 350px, (min-width: 768px) 50vw, 100vw"
                        unoptimized={isDataPreview}
                        className="object-cover opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col min-h-0">
                    <div className="flex justify-between items-start mb-2 shrink-0">
                      <h3 className="min-w-0 flex-1 text-lg font-medium text-[var(--text-primary)] hover:text-theme transition-colors duration-200 break-words">{project.name}</h3>
                      <span className="text-xs text-neutral-500 border border-white/10 px-2 py-1 rounded ml-2 shrink-0">{project.date}</span>
                    </div>

                    <p className="text-sm text-theme font-mono mb-3 shrink-0" style={{ opacity: 0.8 }}>{project.tech}</p>

                    {/* Description area - no nested scroll on mobile */}
                    <div className="flex-none sm:flex-1 sm:min-h-0 sm:overflow-y-auto text-neutral-400 text-sm space-y-2 sm:scrollbar-auto-hide sm:pr-1">
                      {project.description.map((desc, idx) => (
                        <div key={idx} className={`${idx === 0 ? 'flex' : 'hidden sm:flex'} items-start`}>
                          <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-neutral-600 rounded-full flex-shrink-0"></span>
                          <span className="min-w-0 break-words">{desc}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-3 border-t border-white/5 shrink-0 mt-auto">
                      <span className="text-xs text-neutral-500 font-mono">$ click to view details</span>
                    </div>
                  </div>
                </div>
              </DraggableTerminal>
                );
              })()}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
