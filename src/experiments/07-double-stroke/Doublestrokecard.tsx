import './doubleStroke.css';
import type { StrokeVariant, PlayerStatus } from './Types.ts';
import { STATUS_LABELS } from './Types.ts';

interface DoubleStrokeCardProps {
  variant: StrokeVariant;
  status: PlayerStatus;
  name: string;
  number: number;
  position: string;
  initials: string;
}

export function DoubleStrokeCard({
  variant,
  status,
  name,
  number,
  position,
  initials,
}: DoubleStrokeCardProps) {
  return (
    <article
      className='ds-card'
      data-variant={variant}
      data-state={status}
      aria-label={`${name}, ${STATUS_LABELS[status]}`}
    >
      <div className='ds-card__fill' aria-hidden='true' />
      <div className='ds-card__avatar'>{initials}</div>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <p className='ds-card__name'>{name}</p>
        <p className='ds-card__meta'>
          #{number} · {position}
        </p>
      </div>
      <div className='ds-card__pill'>{STATUS_LABELS[status]}</div>
    </article>
  );
}
