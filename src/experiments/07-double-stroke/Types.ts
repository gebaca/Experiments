export type StrokeVariant = 'none' | 'subtle' | 'defined' | 'tinted';
export type PlayerStatus = 'available' | 'injured' | 'called_up' | 'playing';

export const VARIANT_LABELS: Record<StrokeVariant, string> = {
  none: 'Sin borde',
  subtle: 'Subtle',
  defined: 'Defined',
  tinted: 'Tinted',
};

export const STATUS_LABELS: Record<PlayerStatus, string> = {
  available: 'Disponible',
  injured: 'Lesionado',
  called_up: 'Convocado',
  playing: 'En campo',
};

export const VARIANT_DESCRIPTIONS: Record<StrokeVariant, string> = {
  none: 'Un solo borde plano. Sin profundidad.',
  subtle:
    'Borde exterior gris claro, interior blanco. Refinado, casi invisible.',
  defined: 'Exterior más marcado. La card tiene peso propio.',
  tinted:
    'El borde exterior hereda el color del estado. Conecta forma y significado.',
};

export const STROKE_TOKENS: Record<
  StrokeVariant,
  { outer: string; inner: string } | null
> = {
  none: null,
  subtle: { outer: '#d4d4d4', inner: '#ffffff' },
  defined: { outer: '#b0b0b0', inner: '#f7f7f7' },
  tinted: { outer: 'color del estado', inner: '#ffffff' },
};
