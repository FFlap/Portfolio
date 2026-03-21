import type { Metadata } from 'next';
import ProjectsPageContent from '@/components/ProjectsPageContent';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Projects | Nathan Yan',
  description:
    'Projects by Nathan Yan, including full-stack web apps, AI tools, accessibility builds, and hackathon projects.',
  path: '/projects/',
});

export default function ProjectsPage() {
  return <ProjectsPageContent />;
}
