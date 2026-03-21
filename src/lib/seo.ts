import type { Metadata } from 'next';
import type { StaticImageData } from 'next/image';
import type { Project } from '@/data/portfolio-data';

export const siteConfig = {
  name: 'Nathan Yan',
  siteName: 'Nathan Yan',
  url: 'https://nathanyan.com',
  title: 'Nathan Yan | Software Developer and Computer Science Student',
  description:
    'Portfolio of Nathan Yan, a Calgary-based software developer and University of Alberta computer science student building full-stack and AI-powered apps.',
  location: 'Calgary, Canada',
  defaultOgImage: '/assets/profile.jpg',
  keywords: [
    'Nathan Yan',
    'Nathan Yan portfolio',
    'software developer Calgary',
    'computer science student',
    'full-stack developer',
    'AI developer',
    'Next.js portfolio',
  ],
} as const;

export function getAbsoluteUrl(path: string = '/') {
  return new URL(path, siteConfig.url).toString();
}

function getImageUrl(image?: string | StaticImageData) {
  if (!image) {
    return siteConfig.defaultOgImage;
  }

  return typeof image === 'string' ? image : image.src;
}

export function createPageMetadata({
  title,
  description,
  path = '/',
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string | StaticImageData;
} = {}): Metadata {
  const resolvedTitle = title ?? siteConfig.title;
  const resolvedDescription = description ?? siteConfig.description;
  const resolvedImage = getImageUrl(image);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: [...siteConfig.keywords],
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      siteName: siteConfig.siteName,
      locale: 'en_CA',
      url: path,
      title: resolvedTitle,
      description: resolvedDescription,
      images: [
        {
          url: resolvedImage,
          alt: `${siteConfig.name} portfolio preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [resolvedImage],
    },
  };
}

export function createProjectMetadata(project: Project): Metadata {
  const description = `${project.description[0]} Built by Nathan Yan using ${project.tech}.`;
  const path = `/projects/${project.slug}/`;

  return createPageMetadata({
    title: `${project.name} | Nathan Yan`,
    description,
    path,
    image: project.thumbnail ?? project.images[0],
  });
}
