'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Project } from '@/data/portfolio-data';

interface ModalContextType {
  project: Project | null;
  openModal: (project: Project) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<Project | null>(null);

  const openModal = (project: Project) => {
    setProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setProject(null);
    document.body.style.overflow = '';
  };

  return (
    <ModalContext.Provider value={{ project, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
