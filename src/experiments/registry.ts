import type { ComponentType, LazyExoticComponent } from 'react';
import { lazy } from 'react';

// Define la forma de cada experimento
export interface Experiment {
  id: string;
  title: string;
  date: string;
  tags: string[];
  component: LazyExoticComponent<ComponentType>;
}

// El registro — una línea por experimento
export const experiments: Experiment[] = [
  {
    id: '01-gsap-morphing',
    title: 'SVG Morphing con GSAP',
    date: '2026-05-12',
    tags: ['gsap', 'svg'],
    // lazy() significa: no cargues este componente hasta que alguien lo visite
    component: lazy(() => import('./01-depth-color')),
  },
];
