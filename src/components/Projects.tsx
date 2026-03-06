import { portfolioData } from '@/data/portfolio-data';
import Link from 'next/link';
import ProjectWindowGrid from './ProjectWindowGrid';

export default function Projects() {
  const { projects } = portfolioData;
  const featuredProjects = projects.slice(0, 6);

  return (
    <section id="projects" className="min-h-screen py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="mb-16 text-4xl md:text-5xl font-display font-bold text-center text-[var(--text-primary)]">
          Projects
        </h2>

        <ProjectWindowGrid projects={featuredProjects} idPrefix="home-project" />

        <div className="mt-16 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-[var(--bg-surface)]/85 px-6 py-3 font-mono text-sm text-[var(--text-primary)] shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-theme hover:text-theme"
          >
            <span>View More</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-base transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
