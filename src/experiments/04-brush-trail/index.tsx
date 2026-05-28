import BrushTrail from './BrushTrail';

export default function ExperimentoBerliozTextura() {
  return (
    <main className='relative min-h-screen w-full bg-white overflow-hidden'>
      {/* Rastro de pincel seco con baja densidad */}
      <BrushTrail />

      {/* Contenido mínimo de referencia */}
      <div className='absolute bottom-10 right-10 flex flex-col items-end pointer-events-none select-none opacity-20'>
        <h1 className='text-xl font-bold text-zinc-900'>la danse / berlioz</h1>
        <p className='text-xs text-zinc-600'>textura de pincel seco</p>
      </div>
    </main>
  );
}
