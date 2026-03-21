import type { MetadataRoute } from 'next';
import { portfolioData } from '@/data/portfolio-data';
import { getAbsoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: getAbsoluteUrl('/'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: getAbsoluteUrl('/projects/'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...portfolioData.projects.map((project) => ({
      url: getAbsoluteUrl(`/projects/${project.slug}/`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
