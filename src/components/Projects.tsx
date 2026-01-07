'use client';

import { portfolioData, Project } from '@/data/portfolio-data';
import { useModal } from '@/hooks/useModal';
import ScrollReveal from './ScrollReveal';
import ScrollTyping from './ScrollTyping';
import TiltCard from './TiltCard';

export default function Projects() {
  const { projects } = portfolioData;
  const { openModal } = useModal();

  return (
    <section id="projects" className="min-h-screen py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollTyping
          text="< Projects />"
          cursorColor="#4ade80"
          className="text-4xl md:text-5xl font-bold mb-12 text-center text-white"
        />

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <ScrollReveal key={project.name} delay={i * 0.1}>
              <TiltCard>
                <div
                  onClick={() => openModal(project)}
                  className="group relative bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Image Preview */}
                  <div className="h-48 w-full overflow-hidden relative border-b border-gray-700" style={{ transform: 'translateZ(20px)' }}>
                    {project.images && project.images.length > 0 && (
                      <img
                        src={project.images[0]}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                  </div>

                  {/* Glitch Overlay */}
                  <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" style={{ transform: 'translateZ(30px)' }}></div>

                  <div className="p-6" style={{ transform: 'translateZ(30px)' }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-500 transition-colors">{project.name}</h3>
                      <span className="text-xs font-mono text-gray-500 border border-gray-700 px-2 py-1 rounded">{project.date}</span>
                    </div>

                    <p className="text-sm text-purple-500 font-mono mb-4 h-12 overflow-hidden">{project.tech}</p>

                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm line-clamp-3">{project.description[0]}</p>
                    </div>

                    <div className="mt-4 flex items-center text-purple-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>View Details</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Decorative Corners */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-transparent group-hover:border-green-400 transition-all duration-300"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-transparent group-hover:border-green-400 transition-all duration-300"></div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
