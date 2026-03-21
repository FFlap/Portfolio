import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectsPageContent from '@/components/ProjectsPageContent';
import { getProjectBySlug, portfolioData } from '@/data/portfolio-data';
import { createPageMetadata, createProjectMetadata, getAbsoluteUrl } from '@/lib/seo';

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return createPageMetadata({
      title: 'Project Not Found | Nathan Yan',
      description: 'The requested Nathan Yan project could not be found.',
      path: '/projects/',
    });
  }

  return createProjectMetadata(project);
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

  const projectImage = project.thumbnail ?? project.images[0];
  const projectImagePath = typeof projectImage === 'string' ? projectImage : projectImage.src;

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description.join(' '),
    author: {
      '@type': 'Person',
      name: 'Nathan Yan',
    },
    creator: {
      '@type': 'Person',
      name: 'Nathan Yan',
    },
    url: getAbsoluteUrl(`/projects/${project.slug}/`),
    image: getAbsoluteUrl(projectImagePath),
    keywords: project.tech,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <ProjectsPageContent />
    </>
  );
}
