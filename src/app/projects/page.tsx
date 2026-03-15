import type { Metadata } from 'next';
import ProjectsPageContent from '@/components/ProjectsPageContent';

export const metadata: Metadata = {
  title: 'Nathan Yan | Projects',
  description: "Nathan Yan's projects",
};

export default function ProjectsPage() {
  return <ProjectsPageContent />;
}
