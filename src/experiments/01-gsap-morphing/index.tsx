import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GsapMorphing() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(boxRef.current, {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: 'linear',
    });
  }, []);

  return (
    <div className='w-full h-screen bg-black flex items-center justify-center'>
      <div ref={boxRef} className='w-24 h-24 bg-white rounded-lg' />
    </div>
  );
}
