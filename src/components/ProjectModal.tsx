'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Github, Share2, X } from 'lucide-react';
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
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const router = useRouter();

  const totalSlides = (project?.images?.length || 0) + (project?.video ? 1 : 0);
  const imageOffset = project.video ? 1 : 0;
  const currentImageIndex = currentSlideIndex - imageOffset;
  const currentImage =
    !project.video || currentSlideIndex > 0 ? project.images?.[currentImageIndex] : undefined;
  const fullscreenImage =
    fullscreenImageIndex !== null ? project.images?.[fullscreenImageIndex] : undefined;
  const isImageViewerOpen = fullscreenImageIndex !== null;

  const syncToImageIndex = (imageIndex: number) => {
    setCurrentSlideIndex(imageIndex + imageOffset);
  };

  const openImageViewer = () => {
    if (currentImageIndex < 0) return;
    setFullscreenImageIndex(currentImageIndex);
  };

  const closeImageViewer = () => {
    setFullscreenImageIndex(null);
  };

  const nextSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  const nextFullscreenImage = () => {
    if (!project.images.length || fullscreenImageIndex === null) return;

    const nextImageIndex = (fullscreenImageIndex + 1) % project.images.length;
    setFullscreenImageIndex(nextImageIndex);
    syncToImageIndex(nextImageIndex);
  };

  const prevFullscreenImage = () => {
    if (!project.images.length || fullscreenImageIndex === null) return;

    const prevImageIndex = (fullscreenImageIndex - 1 + project.images.length) % project.images.length;
    setFullscreenImageIndex(prevImageIndex);
    syncToImageIndex(prevImageIndex);
  };

  useEffect(() => {
    if (!isImageViewerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeImageViewer();
        return;
      }

      if (project.images.length <= 1) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setFullscreenImageIndex((prev) => {
          if (prev === null) return prev;

          const nextImageIndex = (prev + 1) % project.images.length;
          setCurrentSlideIndex(nextImageIndex + imageOffset);
          return nextImageIndex;
        });
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setFullscreenImageIndex((prev) => {
          if (prev === null) return prev;

          const prevImageIndex = (prev - 1 + project.images.length) % project.images.length;
          setCurrentSlideIndex(prevImageIndex + imageOffset);
          return prevImageIndex;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageViewerOpen, project.images.length, imageOffset]);

  const getShareUrl = () => {
    const { origin, pathname } = window.location;
    const normalizedPath = pathname.replace(/\/$/, '');
    let basePath = '';

    if (normalizedPath.endsWith('/projects')) {
      basePath = normalizedPath.slice(0, -'/projects'.length);
    } else {
      const projectPathMatch = normalizedPath.match(/^(.*)\/projects\/[^/]+$/);
      if (projectPathMatch) {
        basePath = projectPathMatch[1];
      } else if (normalizedPath !== '') {
        basePath = normalizedPath;
      }
    }

    const baseUrl = basePath ? `${origin}${basePath}` : origin;
    return new URL(getProjectHref(project).replace(/^\//, ''), `${baseUrl}/`).toString();
  };

  const handleClose = () => {
    closeImageViewer();
    closeModal();

    if (isRouteModal) {
      router.replace('/projects', { scroll: false });
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = getShareUrl();

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

      {isImageViewerOpen && fullscreenImage && (
        <div className="absolute inset-0 z-[10001] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            onClick={closeImageViewer}
          ></div>

          <div
            className="relative z-[10002] flex h-full w-full items-center justify-center"
            onClick={closeImageViewer}
          >
            <button
              onClick={closeImageViewer}
              className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border text-[var(--text-primary)] transition-all duration-200 hover:scale-105 hover:bg-theme/15 hover:text-theme"
              style={{
                borderColor: 'color-mix(in srgb, var(--primary-color) 28%, rgba(255,255,255,0.1))',
                background: 'color-mix(in srgb, var(--bg-surface) 88%, rgba(0,0,0,0.28))',
                boxShadow: '0 18px 44px rgba(0,0,0,0.22)'
              }}
              aria-label="Close fullscreen image"
            >
              <X className="h-5 w-5" strokeWidth={1.8} />
            </button>

            {project.images.length > 1 && (
              <>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    prevFullscreenImage();
                  }}
                  className="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border text-[var(--text-primary)] transition-all duration-200 hover:-translate-y-1/2 hover:scale-105 hover:bg-theme/15 hover:text-theme"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--primary-color) 28%, rgba(255,255,255,0.1))',
                    background: 'color-mix(in srgb, var(--bg-surface) 88%, rgba(0,0,0,0.28))',
                    boxShadow: '0 18px 44px rgba(0,0,0,0.22)'
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={1.8} />
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    nextFullscreenImage();
                  }}
                  className="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border text-[var(--text-primary)] transition-all duration-200 hover:-translate-y-1/2 hover:scale-105 hover:bg-theme/15 hover:text-theme"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--primary-color) 28%, rgba(255,255,255,0.1))',
                    background: 'color-mix(in srgb, var(--bg-surface) 88%, rgba(0,0,0,0.28))',
                    boxShadow: '0 18px 44px rgba(0,0,0,0.22)'
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" strokeWidth={1.8} />
                </button>
              </>
            )}

            <div
              className="relative h-[82vh] w-[94vw] max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[0_40px_140px_rgba(0,0,0,0.65)]"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={fullscreenImage}
                alt={`${project.name} screenshot ${fullscreenImageIndex + 1}`}
                fill
                sizes="100vw"
                priority
                unoptimized={true}
                className="object-contain"
              />
            </div>

            <div
              className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border px-4 py-2 text-xs font-mono text-[var(--text-primary)] backdrop-blur-md"
              style={{
                borderColor: 'color-mix(in srgb, var(--primary-color) 24%, rgba(255,255,255,0.08))',
                background: 'color-mix(in srgb, var(--bg-surface) 86%, rgba(0,0,0,0.25))',
                boxShadow: '0 18px 44px rgba(0,0,0,0.2)'
              }}
            >
              {fullscreenImageIndex + 1} / {project.images.length}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>

      {/* Modal Content */}
      <div className="project-modal-scroll relative bg-[var(--bg-surface)] border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
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

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white z-10 p-2 transition-colors duration-200"
        >
          <X className="h-6 w-6" strokeWidth={1.8} />
        </button>

        <div className="p-6 md:p-8">
          <div className="mb-6 pr-24">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">{project.name}</h2>
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} GitHub repository`}
                      title="View GitHub repository"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 transition-colors duration-200 hover:border-theme/40 hover:bg-theme/10 hover:text-theme"
                    >
                      <Github className="h-4.5 w-4.5" strokeWidth={1.8} />
                    </a>
                  )}
                </div>
                <p className="text-theme font-mono" style={{ opacity: 0.8 }}>{project.tech}</p>
              </div>
            </div>
          </div>

          {totalSlides > 0 && (
            <div className="relative mb-8 aspect-video bg-black rounded-lg overflow-hidden group border border-neutral-800">
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

              {currentImage && (
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={currentImage}
                    alt="Project Screenshot"
                    fill
                    sizes="(min-width: 1024px) 1200px, (min-width: 768px) 800px, 100vw"
                    priority
                    unoptimized={true}
                    className="cursor-zoom-in object-contain transition-transform duration-200 ease-out hover:scale-[1.01]"
                    onClick={openImageViewer}
                  />
                </div>
              )}

              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-full transition-colors duration-200 z-10"
                  >
                    <ChevronLeft className="h-6 w-6" strokeWidth={1.8} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-full transition-colors duration-200 z-10"
                  >
                    <ChevronRight className="h-6 w-6" strokeWidth={1.8} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 cursor-pointer ${
                      i === currentSlideIndex ? 'bg-theme' : 'bg-neutral-700'
                    }`}
                    onClick={() => setCurrentSlideIndex(i)}
                  ></div>
                ))}
              </div>
            </div>
          )}

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
