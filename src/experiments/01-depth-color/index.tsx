import { useStaticDepth } from './useStaticDepth';

export const StaticDepthExperiment = () => {
  // 1. Pasamos los valores Z. El hook calculará el blur y el brightness automáticamente.
  const capaLejana = useStaticDepth(-4); // Debería verse muy oscuro y borroso
  const capaMedia = useStaticDepth(-2); // Debería verse intermedio
  const planoFocal = useStaticDepth(0); // Debería verse con el color original y nítido

  return (
    // Contenedor principal con fondo blanco
    <div className='relative w-full h-screen bg-white flex flex-col items-center justify-center gap-8 overflow-hidden'>
      {/* RECTÁNGULO 1: LEJANO (Z: -4) */}
      {/* Usamos exactamente el mismo color base (bg-slate-500) */}
      <div
        style={capaLejana}
        className='w-64 h-32 bg-slate-500 rounded-lg shadow-md'
      />

      {/* RECTÁNGULO 2: INTERMEDIO (Z: -2) */}
      <div
        style={capaMedia}
        className='w-64 h-32 bg-slate-500 rounded-lg shadow-md'
      />

      {/* RECTÁNGULO 3: PLANO FOCAL (Z: 0) */}
      <div
        style={planoFocal}
        className='w-64 h-32 bg-slate-500 rounded-lg shadow-md'
      />
    </div>
  );
};

export default StaticDepthExperiment;
