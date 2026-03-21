import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import SiteFooter from '@/components/SiteFooter';
import { createPageMetadata, getAbsoluteUrl, siteConfig } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata();

export default function Home() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    url: siteConfig.url,
    image: getAbsoluteUrl(siteConfig.defaultOgImage),
    jobTitle: 'Software Developer',
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Calgary',
      addressRegion: 'Alberta',
      addressCountry: 'CA',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'University of Alberta',
    },
    sameAs: [
      'https://github.com/fflap',
      'https://www.linkedin.com/in/nathan-yan-cs/',
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.siteName,
    url: siteConfig.url,
    description: siteConfig.description,
  };

  return (
    <main className="relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero />
      <Experience />
      <Projects />
      <SiteFooter />
    </main>
  );
}
