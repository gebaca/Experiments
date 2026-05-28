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
// El registro — corregido para que coincida la URL con el ID
export const experiments: Experiment[] = [
  {
    // 1. Cambia el ID para que coincida con lo que quieres poner en la URL
    id: '01-depth-color',
    title: 'Profundidad Atmosférica Estática',
    date: '2026-05-15',
    tags: ['CSS', 'Depth', 'Hooks'],
    // 2. Apunta a la carpeta correcta donde tienes el código de las tres tarjetas
    component: lazy(() => import('./01-depth-color')),
  },
  {
    // 1. Cambia el ID para que coincida con lo que quieres poner en la URL
    id: '02-panel-selector',
    title: 'Selector de Paneles',
    date: '2026-05-16',
    tags: ['React', 'Components', 'UI'],

    // 2. Apunta a la carpeta correcta donde tienes el código de las tres tarjetas
    component: lazy(() => import('./02-panel-selector')),
  },
  {
    // 1. Cambia el ID para que coincida con lo que quieres poner en la URL
    id: '03-svg-draw',
    title: 'Dibujo SVG Animado',
    date: '2026-05-17',
    tags: ['React', 'SVG', 'Animation'],

    // 2. Apunta a la carpeta correcta donde tienes el código de las tres tarjetas
    component: lazy(() => import('./03-svg-draw')),
  },
  {
    // 1. Cambia el ID para que coincida con lo que quieres poner en la URL
    id: '04-brush-trail',
    title: 'Estela de Pincel',
    date: '2026-05-18',
    tags: ['React', 'SVG', 'Animation'],

    // 2. Apunta a la carpeta correcta donde tienes el código de las tres tarjetas
    component: lazy(() => import('./04-brush-trail')),
  },
];
