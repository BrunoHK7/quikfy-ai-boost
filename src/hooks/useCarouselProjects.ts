
import { useState, useEffect } from 'react';

export interface CarouselProject {
  id: string;
  name: string;
  dimensions: '1080x1080' | '1080x1350';
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  marginEnabled: boolean;
  marginSize: number;
  frames: CarouselFrame[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CarouselFrame {
  id: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  lineHeight: number;
  letterSpacing: number;
  backgroundImage?: string;
  elements: CarouselElement[];
}

export interface CarouselElement {
  id: string;
  type: 'image' | 'shape' | 'icon';
  src?: string;
  shape?: 'rectangle' | 'circle' | 'arrow' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

export const useCarouselProjects = () => {
  const [projects, setProjects] = useState<CarouselProject[]>([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('carousel-projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const saveProject = (project: CarouselProject) => {
    const updatedProject = {
      ...project,
      updatedAt: new Date()
    };

    const existingIndex = projects.findIndex(p => p.id === project.id);
    let newProjects;

    if (existingIndex >= 0) {
      newProjects = [...projects];
      newProjects[existingIndex] = updatedProject;
    } else {
      newProjects = [...projects, updatedProject];
    }

    setProjects(newProjects);
    localStorage.setItem('carousel-projects', JSON.stringify(newProjects));
    return updatedProject;
  };

  const deleteProject = (projectId: string) => {
    const newProjects = projects.filter(p => p.id !== projectId);
    setProjects(newProjects);
    localStorage.setItem('carousel-projects', JSON.stringify(newProjects));
  };

  const getProject = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  return {
    projects,
    saveProject,
    deleteProject,
    getProject
  };
};
