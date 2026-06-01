import './playerCard.css';
import type { Player, PlayerStatus } from './types';
import { STATUS_LABELS } from './types';

interface PlayerCardProps {
  player: Player;
  status: PlayerStatus;
  onClick?: () => void;
}

export function PlayerCard({ player, status, onClick }: PlayerCardProps) {
  return (
    <article
      className='player-card relative flex w-44 cursor-pointer flex-col items-center gap-3 border border-neutral-200/60 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900'
      data-state={status}
      onClick={onClick}
      aria-label={`${player.name}, ${STATUS_LABELS[status]}`}
    >
      {/* Background fill — morphs independently */}
      <div className='player-card__fill' aria-hidden='true' />

      {/* Avatar */}
      <div className='player-card__avatar relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-medium'>
        {player.initials}
      </div>

      {/* Player info */}
      <div className='relative z-10 text-center'>
        <p className='player-card__name text-sm font-medium leading-none'>
          {player.name}
        </p>
        <p className='player-card__meta mt-1.5 text-xs'>
          #{player.number} · {player.position}
        </p>
      </div>

      {/* Status pill */}
      <div className='player-card__pill relative z-10 flex items-center gap-1.5 text-xs font-medium'>
        <span className='player-card__dot h-1.5 w-1.5 shrink-0' />
        <span>{STATUS_LABELS[status]}</span>
      </div>
    </article>
  );
}
