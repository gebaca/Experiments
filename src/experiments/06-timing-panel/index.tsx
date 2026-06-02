import { useRef, useEffect } from 'react';
import { ConvocationPanel } from './ConvocationPanel';
import type { ConvocationPanelHandle } from './ConvocationPanel';
import { SQUAD } from './types';

export default function TimingExperiment() {
  const stdRef = useRef<ConvocationPanelHandle>(null);
  const expRef = useRef<ConvocationPanelHandle>(null);

  function handlePlay() {
    stdRef.current?.reset();
    expRef.current?.reset();

    // Small gap so reset is applied before play
    setTimeout(() => {
      stdRef.current?.play();
      expRef.current?.play();
    }, 50);
  }

  // Autoplay on mount
  useEffect(() => {
    const t = setTimeout(handlePlay, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className='mx-auto max-w-3xl px-6 py-16'>
      {/* Header */}
      <div className='mb-10'>
        <h1 className='text-xl font-medium text-neutral-900'>
          Standard vs Expressive Timing
        </h1>
        <p className='mt-2 text-sm leading-relaxed text-neutral-500'>
          El mismo panel. El mismo contenido. La diferencia está en cómo cada
          elemento decide llegar.
        </p>
      </div>

      {/* Two panels side by side */}
      <div className='mb-8 flex flex-wrap items-start gap-10'>
        <div className='flex flex-col gap-3'>
          <span className='text-xs font-medium uppercase tracking-widest text-neutral-400'>
            Standard
          </span>
          <ConvocationPanel ref={stdRef} mode='standard' players={SQUAD} />
          <p className='max-w-60 text-xs leading-relaxed text-neutral-400'>
            Mismo duration, mismo easing, stagger por defecto. Correcto.
            Invisible.
          </p>
        </div>

        <div className='flex flex-col gap-3'>
          <span className='text-xs font-medium uppercase tracking-widest text-neutral-900'>
            Expressive
          </span>
          <ConvocationPanel ref={expRef} mode='expressive' players={SQUAD} />
          <p className='max-w-60 text-xs leading-relaxed text-neutral-500'>
            Cada elemento con su propio easing semántico. El avatar llega, el
            nombre desliza, la pill confirma.
          </p>
        </div>
      </div>

      {/* Replay */}
      <button
        onClick={handlePlay}
        className='rounded-full border border-neutral-200 px-5 py-2 text-sm text-neutral-500 transition-all duration-150 hover:border-neutral-400 hover:text-neutral-900'
      >
        ↺ Repetir
      </button>

      {/* Token reference */}
      <div className='mt-10 flex flex-wrap gap-2'>
        {[
          {
            name: 'standard',
            value: 'duration 0.35s · ease power1.inOut · stagger uniform',
          },
          {
            name: 'avatar',
            value: 'duration 0.5s · back.out(1.4) · scale 0.82→1',
          },
          { name: 'name', value: 'duration 0.45s · power3.out · x −10→0' },
          { name: 'meta', value: 'duration 0.38s · power1.out · opacity only' },
          {
            name: 'pill',
            value: 'duration 0.4s · back.out(1.2) · delay +140ms',
          },
        ].map((t) => (
          <code
            key={t.name}
            className='rounded-md border border-neutral-100 bg-neutral-50 px-2.5 py-1 font-mono text-xs text-neutral-500'
          >
            {t.name}: {t.value}
          </code>
        ))}
      </div>
    </section>
  );
}
