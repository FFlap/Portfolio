import type { Metadata } from 'next';
import { portfolioData } from '@/data/portfolio-data';
import ProjectWindowGrid from '@/components/ProjectWindowGrid';
import ProjectsTerminal from '@/components/ProjectsTerminal';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Nathan Yan | Projects',
  description: "Nathan Yan's projects",
};

export default function ProjectsPage() {
  const { projects } = portfolioData;

  return (
    <main className="relative z-10 pt-24">
      <section className="px-4 pb-20 pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <ProjectsTerminal />
          </div>

          <ProjectWindowGrid projects={projects} idPrefix="projects-page" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
