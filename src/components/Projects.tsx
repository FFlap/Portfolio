'use client';

import { portfolioData, Project } from '@/data/portfolio-data';
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
              <DraggableTerminal 
                title={`~/projects/${slugify(project.name)}`}
                minWidth={350}
                minHeight={280}
                defaultHeight={450}
              >
                <div
                  onClick={() => openModal(project)}
                  className="cursor-pointer h-full flex flex-col"
                >
                  {/* Image Preview */}
                  <div className="h-40 w-full overflow-hidden border-b border-white/5 shrink-0">
                    {project.images && project.images.length > 0 && (
                      <img
                        src={project.images[0]}
                        alt={project.name}
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col min-h-0">
                    <div className="flex justify-between items-start mb-2 shrink-0">
                      <h3 className="text-lg font-medium text-[var(--text-primary)] hover:text-theme transition-colors duration-200">{project.name}</h3>
                      <span className="text-xs text-neutral-500 border border-white/10 px-2 py-1 rounded ml-2 shrink-0">{project.date}</span>
                    </div>

                    <p className="text-sm text-theme font-mono mb-3 shrink-0" style={{ opacity: 0.8 }}>{project.tech}</p>

                    {/* Description area - scrollable on hover */}
                    <div className="flex-1 overflow-hidden hover:overflow-y-auto text-neutral-400 text-sm space-y-2 scrollbar-auto-hide">
                      {project.description.map((desc, idx) => (
                        <div key={idx} className="flex items-start">
                          <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-neutral-600 rounded-full flex-shrink-0"></span>
                          <span>{desc}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-3 border-t border-white/5 shrink-0 mt-auto">
                      <span className="text-xs text-neutral-500 font-mono">$ click to view details</span>
                    </div>
                  </div>
                </div>
              </DraggableTerminal>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

