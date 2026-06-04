import { useState } from 'react';
import { DoubleStrokeCard } from './Doublestrokecard.tsx';
import type { StrokeVariant, PlayerStatus } from './Types';
import {
  VARIANT_LABELS,
  VARIANT_DESCRIPTIONS,
  STATUS_LABELS,
  STROKE_TOKENS,
} from './Types';

const VARIANTS: StrokeVariant[] = ['none', 'subtle', 'defined', 'tinted'];
const STATUSES: PlayerStatus[] = [
  'available',
  'injured',
  'called_up',
  'playing',
];

const PLAYER = {
  name: 'C. Rodríguez',
  number: 9,
  position: 'Delantero',
  initials: 'CR',
};

export default function DoubleStrokeExperiment() {
  const [variant, setVariant] = useState<StrokeVariant>('subtle');
  const [status, setStatus] = useState<PlayerStatus>('available');

  const tokens = STROKE_TOKENS[variant];

  return (
    <section className='mx-auto max-w-2xl px-6 py-16'>
      {/* Header */}
      <div className='mb-10'>
        <p className='mb-1.5 text-xs font-medium uppercase tracking-widest text-neutral-400'>
          Experiment #07
        </p>
        <h1 className='text-xl font-medium text-neutral-900'>
          Double Stroke System
        </h1>
        <p className='mt-2 text-sm leading-relaxed text-neutral-500'>
          En los experimentos anteriores trabajé cómo se mueve una card. Aquí
          trabajo cómo se ve cuando no se mueve.
        </p>
      </div>

      {/* Main layout */}
      <div className='flex flex-col gap-10 sm:flex-row sm:items-start'>
        {/* Card preview */}
        <div className='flex shrink-0 items-center justify-center rounded-2xl bg-[#f4f4f5] p-10'>
          <DoubleStrokeCard variant={variant} status={status} {...PLAYER} />
        </div>

        {/* Controls */}
        <div className='flex flex-1 flex-col gap-6'>
          {/* Variant selector */}
          <div>
            <p className='mb-2.5 text-xs font-medium uppercase tracking-widest text-neutral-400'>
              Variante
            </p>
            <div className='flex flex-wrap gap-2'>
              {VARIANTS.map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={[
                    'rounded-full border px-4 py-1.5 text-sm transition-all duration-150',
                    variant === v
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900',
                  ].join(' ')}
                >
                  {VARIANT_LABELS[v]}
                </button>
              ))}
            </div>
            <p className='mt-2.5 text-xs leading-relaxed text-neutral-400'>
              {VARIANT_DESCRIPTIONS[variant]}
            </p>
          </div>

          {/* Status selector */}
          <div>
            <p className='mb-2.5 text-xs font-medium uppercase tracking-widest text-neutral-400'>
              Estado del jugador
            </p>
            <div className='flex flex-wrap gap-2'>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={[
                    'rounded-full border px-4 py-1.5 text-sm transition-all duration-150',
                    status === s
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900',
                  ].join(' ')}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Token reference */}
          {tokens && (
            <div>
              <p className='mb-2.5 text-xs font-medium uppercase tracking-widest text-neutral-400'>
                Implementación
              </p>
              <div className='flex flex-col gap-1.5 rounded-xl border border-neutral-100 bg-neutral-50 p-3'>
                <code className='font-mono text-xs text-neutral-500'>
                  box-shadow:
                </code>
                <code className='font-mono text-xs text-neutral-500 pl-4'>
                  0 0 0 1px{' '}
                  <span className='text-neutral-900'>{tokens.inner}</span>
                  <span className='text-neutral-400'>, /* inner */</span>
                </code>
                <code className='font-mono text-xs text-neutral-500 pl-4'>
                  0 0 0 3px{' '}
                  <span className='text-neutral-900'>{tokens.outer}</span>
                  <span className='text-neutral-400'>; /* outer */</span>
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
