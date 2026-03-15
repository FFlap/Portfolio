'use client';

import { useEffect, useState, MouseEvent } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Share2 } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import { getProjectBySlug, getProjectHref, type Project } from '@/data/portfolio-data';

export default function ProjectModal() {
  const { project, closeModal } = useModal();
  const pathname = usePathname();

  const routeSlugMatch = pathname.match(/^\/projects\/([^/]+)\/?$/);
  const routeProject = routeSlugMatch ? getProjectBySlug(routeSlugMatch[1]) ?? null : null;
  const activeProject = routeProject ?? project;

  useEffect(() => {
    if (!activeProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeProject]);

  if (!activeProject) return null;

  return (
    <ProjectModalContent
      key={activeProject.slug}
      project={activeProject}
      closeModal={closeModal}
      isRouteModal={Boolean(routeProject)}
    />
  );
}

function ProjectModalContent({
  project,
  closeModal,
  isRouteModal,
}: {
  project: Project;
  closeModal: () => void;
  isRouteModal: boolean;
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomX, setZoomX] = useState(0);
  const [zoomY, setZoomY] = useState(0);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const router = useRouter();

  const resetZoom = () => {
    setIsZoomed(false);
    setZoomX(0);
    setZoomY(0);
  };

  const totalSlides = (project?.images?.length || 0) + (project?.video ? 1 : 0);
  const currentImage =
    !project.video || currentSlideIndex > 0
      ? project.images?.[currentSlideIndex - (project.video ? 1 : 0)]
      : undefined;

  const nextSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
      resetZoom();
    }
  };

  const prevSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
      resetZoom();
    }
  };

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    if (!isZoomed) {
      setIsZoomed(true);
      updateZoomPosition(e);
    } else {
      resetZoom();
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLImageElement>) => {
    if (isZoomed) {
      updateZoomPosition(e);
    }
  };

  const updateZoomPosition = (e: MouseEvent<HTMLImageElement>) => {
    const imgElement = e.target as HTMLImageElement;
    const rect = imgElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoomX((x / rect.width) * 100);
    setZoomY((y / rect.height) * 100);
  };

  const handleClose = () => {
    resetZoom();
    closeModal();

    if (isRouteModal) {
      router.replace('/projects', { scroll: false });
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = new URL(getProjectHref(project), window.location.origin).toString();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
  };

  useEffect(() => {
    if (copyStatus === 'idle') return;

    const timer = window.setTimeout(() => {
      setCopyStatus('idle');
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-200 ${
        project ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {copyStatus !== 'idle' && (
        <div className="pointer-events-none absolute left-1/2 top-6 z-[10000] -translate-x-1/2">
          <div
            className={`rounded-full border px-4 py-2 text-xs font-mono shadow-2xl backdrop-blur-md transition-all duration-200 ${
              copyStatus === 'copied'
                ? 'border-theme/40 bg-[var(--bg-surface)]/90 text-theme'
                : 'border-red-400/40 bg-[var(--bg-surface)]/90 text-red-300'
            }`}
            role="status"
            aria-live="polite"
          >
            {copyStatus === 'copied' ? 'Project link copied' : 'Could not copy link'}
          </div>
        </div>
      )}

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>

      {/* Modal Content */}
      <div className="relative bg-[var(--bg-surface)] border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
        <button
          onClick={handleCopyLink}
          aria-label="Copy project link"
          title="Copy project link"
          className={`absolute top-4 right-16 z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
            copyStatus === 'copied'
              ? 'border-theme/50 bg-theme/15 text-theme'
              : copyStatus === 'error'
                ? 'border-red-400/40 bg-red-500/10 text-red-300'
                : 'border-white/10 bg-white/5 text-neutral-400 hover:border-theme/40 hover:bg-theme/10 hover:text-theme'
          }`}
        >
          <Share2 className="h-4.5 w-4.5" strokeWidth={1.8} />
        </button>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white z-10 p-2 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 md:p-8">
          <div className="mb-6 pr-24">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">{project.name}</h2>
                <p className="text-theme font-mono" style={{ opacity: 0.8 }}>{project.tech}</p>
              </div>
            </div>
          </div>

          {/* Media Gallery */}
          {totalSlides > 0 && (
            <div className="relative mb-8 aspect-video bg-black rounded-lg overflow-hidden group border border-neutral-800">
              {/* Video Slide */}
              {project.video && currentSlideIndex === 0 && (
                <div className="w-full h-full">
                  <iframe
                    src={project.video}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* Image Slide */}
              {currentImage && (
                <div className="w-full h-full overflow-hidden relative">
                  <Image
                    src={currentImage}
                    alt="Project Screenshot"
                    fill
                    sizes="(min-width: 1024px) 1200px, (min-width: 768px) 800px, 100vw"
                    priority
                    unoptimized={true}
                    className={`object-contain transition-transform duration-200 ease-out ${
                      isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    style={{
                      transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                      transformOrigin: `${zoomX}% ${zoomY}%`
                    }}
                    onClick={handleImageClick}
                    onMouseMove={handleMouseMove}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-full transition-colors duration-200 z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-full transition-colors duration-200 z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 cursor-pointer ${
                      i === currentSlideIndex ? 'bg-theme' : 'bg-neutral-700'
                    }`}
                    onClick={() => {
                      setCurrentSlideIndex(i);
                      resetZoom();
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <ul className="space-y-3 mb-8">
            {project.description.map((desc, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 mt-2 flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full"></div>
                </span>
                <span className="text-[var(--text-primary)] leading-relaxed" style={{ opacity: 0.9 }}>{desc}</span>
              </li>
            ))}
          </ul>

          {/* Bottom Close Button */}
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-[var(--text-primary)] rounded border border-white/10 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
