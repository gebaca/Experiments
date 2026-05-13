import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { experiments } from '../experiments/registry';
import { NotFound } from './NotFound';

export function ExperimentCanvas() {
  // Lee el :id de la URL — ej: /experiment/01-gsap-morphing → id = "01-gsap-morphing"
  const { id } = useParams<{ id: string }>();

  // Busca ese id en el registro
  const experiment = experiments.find((e) => e.id === id);

  // Si no existe, muestra 404
  if (!experiment) return <NotFound />;

  // Si existe, renderiza el componente
  const { component: Component } = experiment;

  return (
    // Suspense muestra el fallback mientras el chunk de JS se descarga
    <Suspense
      fallback={
        <div className='w-full h-screen bg-black flex items-center justify-center'>
          <p className='text-white'>Cargando...</p>
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}
