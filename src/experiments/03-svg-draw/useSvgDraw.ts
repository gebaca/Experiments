import { useEffect } from 'react';

export const useSvgDraw = (
  ref: React.RefObject<SVGSVGElement | null>,
  duration: number = 2000
) => {
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    // Seleccionamos todos los paths del dibujo
    const paths = svg.querySelectorAll('path');

    paths.forEach((path) => {
      const length = path.getTotalLength();

      // Configuramos el estado inicial (oculto)
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      // Aplicamos la transición para la animación
      path.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;

      // Forzamos un reflow para que el navegador registre el estado inicial
      path.getBoundingClientRect();

      // Animamos hacia el estado final (completamente dibujado)
      path.style.strokeDashoffset = '0';
    });
  }, [ref, duration]);
};
