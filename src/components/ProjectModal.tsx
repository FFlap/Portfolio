'use client';

import { useState, useEffect, MouseEvent } from 'react';
import { useModal } from '@/hooks/useModal';

export default function ProjectModal() {
  const { project, closeModal } = useModal();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomX, setZoomX] = useState(0);
  const [zoomY, setZoomY] = useState(0);

  useEffect(() => {
    setCurrentSlideIndex(0);
    resetZoom();
  }, [project]);

  const resetZoom = () => {
    setIsZoomed(false);
    setZoomX(0);
    setZoomY(0);
  };

  const totalSlides = (project?.images?.length || 0) + (project?.video ? 1 : 0);

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
  };

  if (!project) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-200 ${
        project ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>

      {/* Modal Content */}
      <div className="relative bg-[var(--bg-surface)] border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
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
          <h2 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">{project.name}</h2>
          <p className="text-theme font-mono mb-6" style={{ opacity: 0.8 }}>{project.tech}</p>

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
              {(!project.video || currentSlideIndex > 0) && project.images && (
                <div className="w-full h-full overflow-hidden relative">
                  <img
                    src={project.images[currentSlideIndex - (project.video ? 1 : 0)]}
                    className={`w-full h-full object-cover transition-transform duration-200 ease-out ${
                      isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    style={{
                      transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                      transformOrigin: `${zoomX}% ${zoomY}%`
                    }}
                    onClick={handleImageClick}
                    onMouseMove={handleMouseMove}
                    alt="Project Screenshot"
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
