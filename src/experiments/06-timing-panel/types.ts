export type AnimationMode = 'standard' | 'expressive';

export interface ConvocationPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  initials: string;
}

export const SQUAD: ConvocationPlayer[] = [
  {
    id: '1',
    name: 'C. Rodríguez',
    number: 9,
    position: 'Delantero',
    initials: 'CR',
  },
  {
    id: '2',
    name: 'M. García',
    number: 4,
    position: 'Defensa',
    initials: 'MG',
  },
  {
    id: '3',
    name: 'A. López',
    number: 7,
    position: 'Mediocampista',
    initials: 'AL',
  },
  {
    id: '4',
    name: 'J. Martínez',
    number: 1,
    position: 'Portero',
    initials: 'JM',
  },
  {
    id: '5',
    name: 'D. Fernández',
    number: 11,
    position: 'Extremo',
    initials: 'DF',
  },
];
