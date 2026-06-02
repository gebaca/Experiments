import { useRef, useImperativeHandle, forwardRef } from 'react';
import gsap from 'gsap';
import type { AnimationMode, ConvocationPlayer } from './types';
import './timingPanel.css';

interface ConvocationPanelProps {
  mode: AnimationMode;
  players: ConvocationPlayer[];
}

export interface ConvocationPanelHandle {
  play: () => void;
  reset: () => void;
}

export const ConvocationPanel = forwardRef<
  ConvocationPanelHandle,
  ConvocationPanelProps
>(({ mode, players }, ref) => {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    reset() {
      rowRefs.current.forEach((row) => {
        if (!row) return;
        const avatar = row.querySelector('.player-row__avatar');
        const name = row.querySelector('.player-row__name');
        const meta = row.querySelector('.player-row__meta');
        const pill = row.querySelector('.player-row__pill');
        gsap.set([avatar, name, meta, pill], {
          opacity: 0,
          x: 0,
          y: 0,
          scale: 1,
        });
      });
    },

    play() {
      if (mode === 'standard') playStandard();
      else playExpressive();
    },
  }));

  // ── Standard ──────────────────────────────────────────────
  // Uniform duration, same ease, stagger by amount
  function playStandard() {
    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      const els = row.querySelectorAll(
        '.player-row__avatar, .player-row__name, .player-row__meta, .player-row__pill'
      );
      gsap.fromTo(
        els,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power1.inOut',
          stagger: 0.05,
          delay: i * 0.08,
        }
      );
    });
  }

  // ── Expressive ────────────────────────────────────────────
  // Each element has semantic timing. Stagger with 'each'.
  // Avatar arrives with slight elastic — it has physical presence.
  // Name slides with power3.out — fast entry, confident stop.
  // Meta fades softly — secondary info, no urgency.
  // Pill delays — it's a confirmation, not an announcement.
  function playExpressive() {
    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      const avatar = row.querySelector('.player-row__avatar');
      const name = row.querySelector('.player-row__name');
      const meta = row.querySelector('.player-row__meta');
      const pill = row.querySelector('.player-row__pill');

      const rowDelay = i * 0.07;

      // Avatar — physical presence, slight overshoot
      gsap.fromTo(
        avatar,
        { opacity: 0, scale: 0.82 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.4)',
          delay: rowDelay,
        }
      );

      // Name — fast, directional, confident
      gsap.fromTo(
        name,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          ease: 'power3.out',
          delay: rowDelay + 0.04,
        }
      );

      // Meta — soft fade, no movement needed
      gsap.fromTo(
        meta,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.38,
          ease: 'power1.out',
          delay: rowDelay + 0.08,
        }
      );

      // Pill — arrives last, confirms the state
      gsap.fromTo(
        pill,
        { opacity: 0, scale: 0.88 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.2)',
          delay: rowDelay + 0.14,
        }
      );
    });
  }

  return (
    <div className='convocation-panel'>
      <div className='panel-header'>
        <p className='panel-label'>Convocatoria</p>
        <p className='panel-title'>Valencia CF B</p>
        <p className='panel-date'>Sábado, 7 Jun · 17:00</p>
      </div>

      {players.map((player, i) => (
        <div
          key={player.id}
          className='player-row'
          ref={(el) => {
            rowRefs.current[i] = el;
          }}
        >
          <div className='player-row__avatar'>{player.initials}</div>
          <div className='player-row__info'>
            <p className='player-row__name'>{player.name}</p>
            <p className='player-row__meta'>
              #{player.number} · {player.position}
            </p>
          </div>
          <span className='player-row__pill'>Conv.</span>
        </div>
      ))}
    </div>
  );
});

ConvocationPanel.displayName = 'ConvocationPanel';
