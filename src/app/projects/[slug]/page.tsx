import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectsPageContent from '@/components/ProjectsPageContent';
import { getProjectBySlug, portfolioData } from '@/data/portfolio-data';

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Nathan Yan | Project Not Found',
    };
  }

  return {
    title: `Nathan Yan | ${project.name}`,
    description: project.description[0],
  };
}

export function generateStaticParams() {
  return portfolioData.projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectsPageContent />;
}
