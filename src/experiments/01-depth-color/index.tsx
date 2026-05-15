import { useStaticDepth } from './useStaticDepth';

export const StaticDepthExperiment = () => {
  // Generamos los estilos basados puramente en el valor Z de cada objeto
  const fondoLejano = useStaticDepth(-4); // Muy atrás, muy borroso y oscuro
  const capaMedia = useStaticDepth(-2); // Intermedio
  const planoFocal = useStaticDepth(0); // Totalmente nítido y brillante
  const objetoCercano = useStaticDepth(2); // Al frente (Z positivo)

  return (
    <div className='relative w-full h-screen bg-slate-950 flex items-center justify-center overflow-hidden'>
      {/* 1. OBJETO MUY LEJANO (Z: -4) */}
      <div style={fondoLejano} className='absolute text-emerald-900'>
        <svg width='300' height='300' viewBox='0 0 100 100' fill='currentColor'>
          <polygon points='50,15 90,85 10,85' />
        </svg>
      </div>

      {/* 2. OBJETO INTERMEDIO (Z: -2) */}
      <div
        style={capaMedia}
        className='absolute text-emerald-700 translate-x-32 -translate-y-20'
      >
        <svg width='200' height='200' viewBox='0 0 100 100' fill='currentColor'>
          <circle cx='50' cy='50' r='40' />
        </svg>
      </div>

      {/* 3. OBJETO EN PLANO FOCAL (Z: 0) */}
      <div
        style={planoFocal}
        className='absolute text-emerald-400 -translate-x-20 translate-y-10'
      >
        <svg width='150' height='150' viewBox='0 0 100 100' fill='currentColor'>
          <rect x='20' y='20' width='60' height='60' />
        </svg>
      </div>

      {/* 4. OBJETO AL FRENTE (Z: 2) */}
      {/* Como el hook no le aplica blur ni oscuridad por ser >= 0, destaca por completo */}
      <div
        style={objetoCercano}
        className='absolute text-white translate-x-10 translate-y-32'
      >
        <h2 className='text-2xl font-bold tracking-wider bg-black/40 px-4 py-2 rounded border border-white/10'>
          PLANO FRONTAL
        </h2>
      </div>
    </div>
  );
};

export default StaticDepthExperiment;
