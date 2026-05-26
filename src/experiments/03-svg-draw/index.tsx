import { useState } from 'react';
import LaDanseSvg from './LaDanseSvg';

export default function App() {
  const [animationKey, setAnimationKey] = useState(0);

  const handleReplay = () => {
    setAnimationKey((prev) => prev + 1);
  };

  return (
    // Contenedor principal que ocupa el 100% real del viewport
    <div className='relative h-screen w-screen overflow-hidden bg-white antialiased'>
      {/* El componente SVG ocupando absolutamente todo el espacio disponible */}
      <LaDanseSvg key={animationKey} className='h-full w-full' />

      {/* Botón flotante minimalista en la esquina inferior para no romper la estética */}
      <button
        onClick={handleReplay}
        className='absolute bottom-6 right-6 z-50 rounded-full bg-zinc-950/80 px-5 py-2 text-xs font-medium tracking-wide text-zinc-200 backdrop-blur-sm transition-all hover:bg-zinc-950 hover:text-white active:scale-95 shadow-lg'
      >
        Reiniciar dibujo
      </button>
    </div>
  );
}
