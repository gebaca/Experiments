// SkyPanels.tsx
// Dependencias: gsap, react, typescript, tailwind
// Coloca el componente donde quieras en tu portfolio.
// Asegúrate de que GSAP está instalado: npm install gsap

import { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useStaticDepth } from '../01-depth-color/useStaticDepth';

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────

interface CloudConfig {
  width: number; // px
  height: number; // px
  top: string; // %, ej: '20%'
  color: string; // rgba
  duration: number; // segundos para cruzar la escena
  delay: number; // delay negativo = ya en movimiento al montar
  zDepth: number; // -1 para nubes de fondo, 0 para primer plano
}

interface SkyConfig {
  id: string;
  name: string;
  // Gradiente CSS: de arriba (zenith) a abajo (horizonte)
  gradient: string;
  clouds: CloudConfig[];
  stars?: number; // número de estrellas (solo cielo noche)
}

// ─────────────────────────────────────────────
// DATOS DE LOS 4 CIELOS
// Edita los gradientes y nubes para personalizar.
// ─────────────────────────────────────────────

const SKIES: SkyConfig[] = [
  {
    id: 'dawn',
    name: 'amanecer',
    gradient: 'linear-gradient(to bottom, #1a0a2e, #c04a10, #f8c060)',
    clouds: [
      {
        width: 80,
        height: 18,
        top: '20%',
        color: 'rgba(255,160,80,0.7)',
        duration: 28,
        delay: -10,
        zDepth: -1,
      },
      {
        width: 55,
        height: 12,
        top: '55%',
        color: 'rgba(255,120,50,0.5)',
        duration: 38,
        delay: -5,
        zDepth: -1,
      },
      {
        width: 100,
        height: 20,
        top: '70%',
        color: 'rgba(255,200,100,0.4)',
        duration: 45,
        delay: -20,
        zDepth: 0,
      },
    ],
  },
  {
    id: 'day',
    name: 'mediodía',
    gradient: 'linear-gradient(to bottom, #0a3a7a, #2a70c0, #c0ddf8)',
    clouds: [
      {
        width: 90,
        height: 22,
        top: '25%',
        color: 'rgba(255,255,255,0.88)',
        duration: 32,
        delay: -8,
        zDepth: -1,
      },
      {
        width: 60,
        height: 14,
        top: '55%',
        color: 'rgba(240,248,255,0.70)',
        duration: 42,
        delay: -15,
        zDepth: -1,
      },
      {
        width: 75,
        height: 18,
        top: '10%',
        color: 'rgba(255,255,255,0.65)',
        duration: 25,
        delay: -3,
        zDepth: 0,
      },
    ],
  },
  {
    id: 'dusk',
    name: 'atardecer',
    gradient: 'linear-gradient(to bottom, #050510, #6a2050, #e8a0a0)',
    clouds: [
      {
        width: 70,
        height: 16,
        top: '30%',
        color: 'rgba(200,120,180,0.7)',
        duration: 40,
        delay: -12,
        zDepth: -1,
      },
      {
        width: 90,
        height: 14,
        top: '60%',
        color: 'rgba(180,80,140,0.5)',
        duration: 30,
        delay: -6,
        zDepth: 0,
      },
    ],
  },
  {
    id: 'night',
    name: 'noche',
    gradient: 'linear-gradient(to bottom, #000008, #020218, #0a0a30)',
    clouds: [
      {
        width: 40,
        height: 8,
        top: '25%',
        color: 'rgba(60,60,100,0.5)',
        duration: 60,
        delay: -20,
        zDepth: -1,
      },
      {
        width: 60,
        height: 10,
        top: '65%',
        color: 'rgba(40,40,80,0.4)',
        duration: 80,
        delay: -35,
        zDepth: -1,
      },
    ],
    stars: 60,
  },
];

// Cuántos px ocupa cada panel en la escena (alto total 420px / 4 paneles)
const PANEL_HEIGHT = 105;
const SCENE_WIDTH = 560;
const SCENE_HEIGHT = PANEL_HEIGHT * SKIES.length; // 420

// ─────────────────────────────────────────────
// SUBCOMPONENTE: Nube individual
// ─────────────────────────────────────────────

interface CloudProps {
  config: CloudConfig;
}

function Cloud({ config }: CloudProps) {
  const cloudRef = useRef<HTMLDivElement>(null);
  // useStaticDepth aplica blur/opacity/scale según la profundidad z
  const depthStyle = useStaticDepth(config.zDepth);

  useEffect(() => {
    const el = cloudRef.current;
    if (!el) return;

    // GSAP: animación de movimiento horizontal en loop infinito.
    // fromX empieza fuera de la escena por la izquierda (-100px extra).
    // toX sale por la derecha (SCENE_WIDTH + el ancho de la nube).
    const anim = gsap.fromTo(
      el,
      { x: -config.width - 100 },
      {
        x: SCENE_WIDTH + config.width,
        duration: config.duration,
        delay: config.delay, // delay negativo = ya en marcha
        ease: 'none', // velocidad constante (sin aceleración)
        repeat: -1, // infinito
      }
    );

    // Limpieza al desmontar el componente
    return () => {
      anim.kill();
    };
  }, [config]);

  return (
    <div
      ref={cloudRef}
      className='absolute rounded-full'
      style={{
        width: config.width,
        height: config.height,
        top: config.top,
        left: 0,
        background: config.color,
        ...depthStyle, // aplica filter blur + opacity + scale del hook
      }}
    />
  );
}

// ─────────────────────────────────────────────
// SUBCOMPONENTE: Estrellas (solo cielo noche)
// ─────────────────────────────────────────────
// CORREGIDO: Inicialización perezosa con useState.
// No usa useEffect, evita la advertencia de setState síncrono.
// Las estrellas se generan una sola vez al montar el componente.

function Stars({ count }: { count: number }) {
  const [stars] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 3 + 1.5,
      delay: Math.random() * -4,
    }))
  );

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className='absolute rounded-full bg-white'
          style={{
            width: star.size,
            height: star.size,
            left: `${star.left}%`,
            top: `${star.top}%`,
            animation: `twinkle ${star.duration}s ${star.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────
// SUBCOMPONENTE: Panel de cielo
// ─────────────────────────────────────────────

interface SkyPanelProps {
  sky: SkyConfig;
  index: number; // posición vertical (0-3)
  onClick: (id: string) => void;
  isHidden: boolean; // true cuando otro cielo está seleccionado
}

function SkyPanel({ sky, index, onClick, isHidden }: SkyPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Animar la salida/entrada del panel con GSAP
  useEffect(() => {
    if (!panelRef.current) return;
    gsap.to(panelRef.current, {
      opacity: isHidden ? 0 : 1,
      y: isHidden ? -8 : 0, // ligero desplazamiento al salir
      duration: 0.5,
      ease: 'power2.inOut',
      // Desactivar pointer-events cuando está oculto
      onComplete: () => {
        if (panelRef.current) {
          panelRef.current.style.pointerEvents = isHidden ? 'none' : 'auto';
        }
      },
    });
  }, [isHidden]);

  return (
    <div
      ref={panelRef}
      className='absolute left-0 right-0 overflow-hidden cursor-pointer group'
      style={{
        top: index * PANEL_HEIGHT,
        height: PANEL_HEIGHT,
      }}
      onClick={() => onClick(sky.id)}
    >
      {/* Gradiente de fondo del cielo */}
      <div className='absolute inset-0' style={{ background: sky.gradient }} />

      {/* Nubes animadas con GSAP */}
      {sky.clouds.map((cloud, i) => (
        <Cloud key={i} config={cloud} />
      ))}

      {/* Estrellas (solo noche) */}
      {sky.stars && <Stars count={sky.stars} />}

      {/* Label del cielo — visible solo en hover */}
      <div
        className='
        absolute bottom-2 right-3
        text-white/40 text-[10px] tracking-widest uppercase
        font-mono select-none
        transition-opacity duration-300
        opacity-0 group-hover:opacity-100
      '
      >
        {sky.name}
      </div>

      {/* Overlay de hover muy sutil */}
      <div
        className='
        absolute inset-0
        bg-white/0 group-hover:bg-white/5
        transition-colors duration-300
      '
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// SUBCOMPONENTE: Poste eléctrico (SVG)
// El poste usa useStaticDepth con z positivo
// para estar siempre por encima de los paneles.
// ─────────────────────────────────────────────

function ElectricPole() {
  // z:5 → encima de todo, sin blur (zIndex >= 0 no aplica blur en el hook)
  const depthStyle = useStaticDepth(5);

  return (
    <svg
      viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
      className='absolute inset-0 w-full h-full pointer-events-none'
      style={{ ...depthStyle, zIndex: 10 }}
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* Poste vertical */}
      <rect
        x='272'
        y='0'
        width='16'
        height={SCENE_HEIGHT}
        fill='#5a4e43'
        rx='2'
      />
      {/* Reflejos del poste (volumen) */}
      <rect
        x='272'
        y='0'
        width='4'
        height={SCENE_HEIGHT}
        fill='rgba(255,255,255,0.07)'
        rx='1'
      />
      <rect
        x='282'
        y='0'
        width='6'
        height={SCENE_HEIGHT}
        fill='rgba(0,0,0,0.3)'
        rx='1'
      />

      {/* Brazo + aisladores + cables — franja 1→2 (y=105) */}
      <rect x='140' y='102' width='280' height='5' fill='#6b5c4d' rx='1' />
      <ellipse cx='170' cy='105' rx='7' ry='10' fill='#8aaa80' />
      <ellipse cx='230' cy='105' rx='7' ry='10' fill='#8aaa80' />
      <ellipse cx='330' cy='105' rx='7' ry='10' fill='#8aaa80' />
      <ellipse cx='390' cy='105' rx='7' ry='10' fill='#8aaa80' />
      <line
        x1='0'
        y1='107'
        x2='170'
        y2='107'
        stroke='#1a1a1a'
        strokeWidth='1.5'
      />
      <line
        x1='0'
        y1='109'
        x2='230'
        y2='109'
        stroke='#1a1a1a'
        strokeWidth='1.5'
      />
      <line
        x1='330'
        y1='107'
        x2='560'
        y2='107'
        stroke='#1a1a1a'
        strokeWidth='1.5'
      />
      <line
        x1='390'
        y1='109'
        x2='560'
        y2='109'
        stroke='#1a1a1a'
        strokeWidth='1.5'
      />

      {/* Franja 2→3 (y=210) */}
      <rect x='155' y='207' width='250' height='5' fill='#6b5c4d' rx='1' />
      <ellipse cx='185' cy='210' rx='7' ry='10' fill='#8aaa80' />
      <ellipse cx='245' cy='210' rx='7' ry='10' fill='#8aaa80' />
      <ellipse cx='315' cy='210' rx='7' ry='10' fill='#8aaa80' />
      <ellipse cx='375' cy='210' rx='7' ry='10' fill='#8aaa80' />
      <line
        x1='0'
        y1='212'
        x2='185'
        y2='212'
        stroke='#1a1a1a'
        strokeWidth='1.5'
      />
      <line
        x1='0'
        y1='214'
        x2='245'
        y2='214'
        stroke='#1a1a1a'
        strokeWidth='1.5'
      />
      <line
        x1='315'
        y1='212'
        x2='560'
        y2='212'
        stroke='#1a1a1a'
        strokeWidth='1.5'
      />
      <line
        x1='375'
        y1='214'
        x2='560'
        y2='214'
        stroke='#1a1a1a'
        strokeWidth='1.5'
      />

      {/* Franja 3→4 (y=315) */}
      <rect x='160' y='312' width='240' height='5' fill='#6b5c4d' rx='1' />
      <ellipse cx='190' cy='315' rx='7' ry='10' fill='#8aaa80' />
      <ellipse cx='250' cy='315' rx='7' ry='10' fill='#8aaa80' />
      <ellipse cx='310' cy='315' rx='7' ry='10' fill='#8aaa80' />
      <ellipse cx='370' cy='315' rx='7' ry='10' fill='#8aaa80' />
      <line
        x1='0'
        y1='317'
        x2='190'
        y2='317'
        stroke='#1a1a1a'
        strokeWidth='1.5'
      />
      <line
        x1='0'
        y1='319'
        x2='250'
        y2='319'
        stroke='#1a1a1a'
        strokeWidth='1.5'
      />
      <line
        x1='310'
        y1='317'
        x2='560'
        y2='317'
        stroke='#1a1a1a'
        strokeWidth='1.5'
      />
      <line
        x1='370'
        y1='319'
        x2='560'
        y2='319'
        stroke='#1a1a1a'
        strokeWidth='1.5'
      />
    </svg>
  );
}

// ─────────────────────────────────────────────
// SUBCOMPONENTE: Fondo seleccionado
// Cuando el usuario hace clic, este div se
// expande con el cielo elegido como fondo completo.
// ─────────────────────────────────────────────

interface SelectedBgProps {
  sky: SkyConfig | null;
}

function SelectedBackground({ sky }: SelectedBgProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bgRef.current) return;

    if (sky) {
      // Fade in con GSAP
      gsap.fromTo(
        bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
      );
    } else {
      gsap.to(bgRef.current, { opacity: 0, duration: 0.5 });
    }
  }, [sky]);

  if (!sky) return null;

  return (
    <div ref={bgRef} className='absolute inset-0' style={{ zIndex: 1 }}>
      {/* Gradiente completo del cielo seleccionado */}
      <div className='absolute inset-0' style={{ background: sky.gradient }} />

      {/* Sus nubes, ahora ocupando toda la escena */}
      {sky.clouds.map((cloud, i) => (
        <Cloud key={i} config={cloud} />
      ))}

      {sky.stars && <Stars count={sky.stars} />}
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL: SkyPanels
// ─────────────────────────────────────────────

export default function SkyPanels() {
  // null = ningún cielo seleccionado (vista de 4 paneles)
  const [selectedSky, setSelectedSky] = useState<SkyConfig | null>(null);

  const handlePanelClick = useCallback((id: string) => {
    const sky = SKIES.find((s) => s.id === id) ?? null;
    setSelectedSky(sky);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedSky(null);
  }, []);

  return (
    <>
      {/*
        Keyframes para el parpadeo de estrellas.
        Tailwind no tiene esta animación built-in,
        así que la añadimos como estilo global inline.
        En producción, mueve esto a tu globals.css.
      */}
      <style>{`
        @keyframes twinkle {
          from { opacity: 0.1; }
          to   { opacity: 0.9; }
        }
      `}</style>

      <div
        className='relative overflow-hidden border border-white/10'
        style={{ width: SCENE_WIDTH, height: SCENE_HEIGHT }}
      >
        {/* 1. Fondo cuando hay un cielo seleccionado (z:1) */}
        <SelectedBackground sky={selectedSky} />

        {/* 2. Los 4 paneles de cielo (z:2 por defecto via CSS) */}
        {SKIES.map((sky, index) => (
          <SkyPanel
            key={sky.id}
            sky={sky}
            index={index}
            onClick={handlePanelClick}
            isHidden={selectedSky !== null}
          />
        ))}

        {/* 3. Poste eléctrico SVG (z:10, pointer-events:none) */}
        <ElectricPole />

        {/* 4. Botón de reset — solo visible cuando hay selección */}
        {selectedSky && (
          <button
            onClick={handleReset}
            className='
              absolute bottom-5 left-1/2 -translate-x-1/2
              z-20
              px-5 py-2
              bg-black/50 text-white/80
              border border-white/20
              font-mono text-xs tracking-widest uppercase
              rounded-sm
              hover:bg-white/10 hover:text-white
              transition-colors duration-200
              backdrop-blur-sm
            '
          >
            ← volver
          </button>
        )}

        {/* 5. Hint de interacción — desaparece al seleccionar */}
        {!selectedSky && (
          <p
            className='
            absolute bottom-3 left-1/2 -translate-x-1/2
            text-white/30 text-[10px] tracking-widest uppercase
            font-mono select-none pointer-events-none whitespace-nowrap
          '
          >
            clic sobre un cielo
          </p>
        )}
      </div>
    </>
  );
}
