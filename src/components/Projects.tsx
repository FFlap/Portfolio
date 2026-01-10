'use client';

import { portfolioData, Project } from '@/data/portfolio-data';
import { useModal } from '@/hooks/useModal';
import ScrollReveal from './ScrollReveal';
import TiltCard from './TiltCard';

export default function Projects() {
  const { projects } = portfolioData;
  const { openModal } = useModal();

  return (
    <section id="projects" className="min-h-screen py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-16 text-center text-white">
          Projects
        </h2>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <ScrollReveal key={project.name} delay={i * 0.1}>
              <TiltCard>
                <div
                  onClick={() => openModal(project)}
                  className="group bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden hover:border-theme cursor-pointer transition-all duration-200 shadow-lg"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Image Preview */}
                  <div className="h-48 w-full overflow-hidden border-b border-zinc-800" style={{ transform: 'translateZ(20px)' }}>
                    {project.images && project.images.length > 0 && (
                      <img
                        src={project.images[0]}
                        alt={project.name}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="p-6" style={{ transform: 'translateZ(30px)' }}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium text-white group-hover:text-theme transition-colors duration-200">{project.name}</h3>
                      <span className="text-xs text-neutral-500 border border-zinc-700 px-2 py-1 rounded">{project.date}</span>
                    </div>

                    <p className="text-sm text-theme font-mono mb-3" style={{ opacity: 0.8 }}>{project.tech}</p>

                    <p className="text-neutral-400 text-sm line-clamp-3">{project.description[0]}</p>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
