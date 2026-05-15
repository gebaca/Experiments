import { useStaticDepth } from './useStaticDepth';

export const StaticDepthExperiment = () => {
  const capaLejana = useStaticDepth(-4);
  const capaMedia = useStaticDepth(-2);
  const planoFocal = useStaticDepth(0);

  return (
    <div className='w-full h-screen bg-white flex flex-col items-center justify-center gap-12'>
      {/* Targeta 1: Lejana */}
      <div className='text-center'>
        <span className='text-xs text-gray-400 font-mono'>Z-INDEX: -4</span>
        <div
          style={capaLejana}
          className='w-64 h-24 bg-slate-500 rounded-lg shadow-sm'
        />
      </div>

      {/* Targeta 2: Media */}
      <div className='text-center'>
        <span className='text-xs text-gray-400 font-mono'>Z-INDEX: -2</span>
        <div
          style={capaMedia}
          className='w-64 h-24 bg-slate-500 rounded-lg shadow-md'
        />
      </div>

      {/* Targeta 3: Frente */}
      <div className='text-center'>
        <span className='text-xs text-gray-400 font-mono'>Z-INDEX: 0</span>
        <div
          style={planoFocal}
          className='w-64 h-24 bg-slate-500 rounded-lg shadow-xl'
        />
      </div>
    </div>
  );
};

export default StaticDepthExperiment;
