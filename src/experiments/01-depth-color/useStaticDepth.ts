import { useMemo } from 'react';

export const useStaticDepth = (zIndex: number) => {
  return useMemo(() => {
    // Si está atrás (negativo), pierde opacidad mezclándose con el fondo blanco
    const opacity = zIndex < 0 ? Math.max(0.1, 1 + zIndex * 0.18) : 1;

    const blur = zIndex < 0 ? Math.abs(zIndex) * 1.5 : 0;

    // Reducimos el tamaño para dar perspectiva de túnel
    const scale = zIndex < 0 ? Math.max(0.4, 1 + zIndex * 0.15) : 1;

    return {
      filter: `blur(${blur}px)`,
      opacity: opacity,
      transform: `scale(${scale})`,
      zIndex: zIndex,
    };
  }, [zIndex]);
};
