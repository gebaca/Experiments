import React, { useEffect, useRef, useState } from 'react';

// Cambiamos a HTMLAttributes de un HTMLDivElement
interface LaDanseSvgProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  animationDuration?: number;
}

export const LaDanseSvg: React.FC<LaDanseSvgProps> = ({
  size = '100%',
  className,
  animationDuration = 3000,
  ...props // Ahora props contiene atributos válidos para un div
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState<string>('');

  // 1. Cargamos el archivo SVG crudo desde la carpeta public
  useEffect(() => {
    fetch('/berlioz_svg.svg')
      .then((res) => res.text())
      .then((data) => {
        setSvgHtml(data);
      })
      .catch((err) => console.error('Error cargando el SVG:', err));
  }, []);

  // 2. Ejecutamos la animación en directo
  useEffect(() => {
    if (!containerRef.current || !svgHtml) return;

    const svgElement = containerRef.current.querySelector('svg');
    if (svgElement) {
      // Forzamos que el SVG interno sea responsivo adaptándose al div contenedor
      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('height', '100%');

      const paths = svgElement.querySelectorAll('path');
      paths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.transition = `stroke-dashoffset ${animationDuration}ms ease-in-out`;

        // Reflow para congelar el estado inicial oculto antes de la transición
        path.getBoundingClientRect();

        path.style.strokeDashoffset = '0';
      });
    }
  }, [svgHtml, animationDuration]);

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size }}
      className={className}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
      {...props} // Ahora se propaga sin conflictos tipados
    />
  );
};

export default LaDanseSvg;
