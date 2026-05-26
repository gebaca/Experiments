import { useState } from 'react';
import { LaDanseSvg } from './LaDanseSvg';

export default function App() {
  const [animationKey, setAnimationKey] = useState(0);

  const handleReplay = () => {
    // Forzamos el desmontaje y remontaje para reiniciar el hook de animación
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-white antialiased'>
      {/* Contenedor de la escena */}
      <div className='relative flex aspect-square w-full max-w-xl items-center justify-center overflow-hidden rounded-2xl bg-white p-8 shadow-2xl shadow-black/40'>
        <LaDanseSvg key={animationKey} animationDuration={3000} size='100%' />
      </div>

      {/* Control de la animación */}
      <button
        onClick={handleReplay}
        className='mt-8 rounded-full bg-zinc-800 px-6 py-2.5 text-sm font-medium tracking-wide text-zinc-200 transition-all hover:bg-zinc-700 hover:text-white active:scale-95'
      >
        Volver a dibujar
      </button>
    </div>
  );
}
