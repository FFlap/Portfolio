import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import SiteFooter from '@/components/SiteFooter';

export default function Home() {
  return (
    <main className="relative z-10">
      <Hero />
      <Experience />
      <Projects />
      <SiteFooter />
    </main>
  );
}
