export type PlayerStatus = 'available' | 'injured' | 'called_up' | 'playing';

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  initials: string;
  status: PlayerStatus;
}

export const STATUS_LABELS: Record<PlayerStatus, string> = {
  available: 'Disponible',
  injured: 'Lesionado',
  called_up: 'Convocado',
  playing: 'En campo',
};

export const STATUS_ORDER: PlayerStatus[] = [
  'available',
  'injured',
  'called_up',
  'playing',
];
