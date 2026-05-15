import { useMemo } from 'react';

export const useStaticDepth = (zIndex: number) => {
  return useMemo(() => {
    // 1. Opacidad sutil: Solo baja un 8% por nivel. Mínimo 60% para mantener legibilidad.
    const opacity = zIndex < 0 ? Math.max(0.6, 1 + zIndex * 0.08) : 1;

    // 2. Blur muy suave: Solo 0.4px por nivel. En Z: -4 el blur total será de solo 1.6px.
    const blur = zIndex < 0 ? Math.abs(zIndex) * 0.4 : 0;

    // 3. Escala realista: Solo reduce un 3% por nivel. Mínimo 88% de su tamaño original.
    const scale = zIndex < 0 ? Math.max(0.88, 1 + zIndex * 0.03) : 1;

    return {
      filter: blur > 0 ? `blur(${blur}px)` : 'none',
      opacity: opacity,
      transform: `scale(${scale})`,
      zIndex: zIndex,
      transition: 'filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease', // Suaviza cambios si el Z cambia dinámicamente
    };
  }, [zIndex]);
};
