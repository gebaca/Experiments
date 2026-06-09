import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { DibujoPrueba } from './prueba';

export default function App() {
  const pincelRef = useRef<SVGPathElement | null>(null);
  const tlHover = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (pincelRef.current) {
      // 1. Conseguimos la longitud exacta de la onda de prueba
      const longitudReal = pincelRef.current.getTotalLength();

      // 2. Forzamos al trazo a esconderse por completo al inicio
      pincelRef.current.style.strokeDasharray = `${longitudReal}`;
      pincelRef.current.style.strokeDashoffset = `${longitudReal}`;

      // 3. Programamos la Timeline con GSAP Core (Gratis)
      tlHover.current = gsap.timeline({ paused: true });

      tlHover.current.to(pincelRef.current, {
        strokeDashoffset: 0, // Revela el trazo progresivamente
        duration: 1.5,
        ease: 'power2.inOut',
      });
    }

    return () => {
      if (tlHover.current) tlHover.current.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    tlHover.current?.play();
  };

  const handleMouseLeave = () => {
    tlHover.current?.reverse();
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff', // Fondo de pantalla blanco
        margin: 0,
      }}
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '400px',
          height: '400px',
          backgroundColor: '#ffffff', // Contenedor blanco
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px dashed #e0e0e0', // Guía sutil para saber dónde hacer hover
          borderRadius: '8px',
        }}
      >
        <DibujoPrueba pincelRef={pincelRef} />
      </div>
    </div>
  );
}
