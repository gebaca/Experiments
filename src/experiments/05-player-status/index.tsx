import { useState, useEffect, useRef } from 'react';
import { PlayerCard } from './PlayerCard';
import type { Player, PlayerStatus } from './types';
import { STATUS_LABELS, STATUS_ORDER } from './types';

const PLAYERS: Player[] = [
  {
    id: '1',
    name: 'C. Rodríguez',
    number: 9,
    position: 'Delantero',
    initials: 'CR',
    status: 'available',
  },
  {
    id: '2',
    name: 'M. García',
    number: 4,
    position: 'Defensa',
    initials: 'MG',
    status: 'injured',
  },
  {
    id: '3',
    name: 'A. López',
    number: 7,
    position: 'Mediocampista',
    initials: 'AL',
    status: 'called_up',
  },
];

const TOKENS = [
  { name: '--duration-fast', value: '160ms' },
  { name: '--duration-medium', value: '300ms' },
  { name: '--ease-standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  { name: '--ease-expressive', value: 'cubic-bezier(0.34, 1.4, 0.64, 1)' },
];

export default function PlayerStatusExperiment() {
  const [globalStatus, setGlobalStatus] = useState<PlayerStatus>('available');
  const [isAutoCycling, setIsAutoCycling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoIndexRef = useRef(0);

  useEffect(() => {
    if (isAutoCycling) {
      autoIndexRef.current = STATUS_ORDER.indexOf(globalStatus);
      intervalRef.current = setInterval(() => {
        autoIndexRef.current = (autoIndexRef.current + 1) % STATUS_ORDER.length;
        setGlobalStatus(STATUS_ORDER[autoIndexRef.current]);
      }, 1500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoCycling]);

  function handleStateChange(status: PlayerStatus) {
    setIsAutoCycling(false);
    setGlobalStatus(status);
  }

  return (
    <section className='mx-auto max-w-2xl px-6 py-16'>
      {/* Header */}
      <div className='mb-10'>
        <p className='mt-2 text-sm leading-relaxed text-neutral-500'>
          El estado tiene forma. El contenedor morfea — no muta.
        </p>
      </div>

      {/* Controls */}
      <div className='mb-8 flex flex-wrap items-center gap-2'>
        {STATUS_ORDER.map((status) => (
          <button
            key={status}
            onClick={() => handleStateChange(status)}
            className={[
              'rounded-full border px-4 py-1.5 text-sm transition-all duration-150',
              globalStatus === status && !isAutoCycling
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900',
            ].join(' ')}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
        <button
          onClick={() => setIsAutoCycling((p) => !p)}
          className={[
            'rounded-full border px-4 py-1.5 text-sm transition-all duration-150',
            isAutoCycling
              ? 'border-neutral-300 bg-neutral-100 text-neutral-700'
              : 'border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-700',
          ].join(' ')}
        >
          {isAutoCycling ? '⏹ Detener' : '▶ Auto'}
        </button>
      </div>

      {/* Cards */}
      <div className='mb-10 flex flex-wrap gap-4'>
        {PLAYERS.map((player) => (
          <PlayerCard key={player.id} player={player} status={globalStatus} />
        ))}
      </div>

      {/* Token reference */}
      <div className='flex flex-wrap gap-2'>
        {TOKENS.map((token) => (
          <code
            key={token.name}
            className='rounded-md border border-neutral-100 bg-neutral-50 px-2.5 py-1 font-mono text-xs text-neutral-500'
          >
            {token.name}: {token.value}
          </code>
        ))}
      </div>
    </section>
  );
}
