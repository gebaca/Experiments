import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const COLORS = ['#0074e4', '#ff2a24', '#ffcc00', '#ff6600'];

interface Point {
  x: number;
  y: number;
}

export default function BrushTrail() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const currentPathRef = useRef<SVGPathElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Crea curvas suaves basadas en los movimientos del ratón
    const createSvgPath = (points: Point[]): string => {
      if (points.length < 2) return '';
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2;
        const yc = (points[i].y + points[i - 1].y) / 2;
        d += ` Q ${points[i - 1].x} ${points[i - 1].y}, ${xc} ${yc}`;
      }
      return d;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const points = pointsRef.current;

      if (points.length > 0) {
        const lastPoint = points[points.length - 1];
        // Control de densidad: mayor distancia obligatoria para espaciar los trazos
        if (Math.hypot(x - lastPoint.x, y - lastPoint.y) < 30) return;
      }

      points.push({ x, y });
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

      if (!isDrawingRef.current || !currentPathRef.current) {
        isDrawingRef.current = true;

        const path = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );

        path.setAttribute('stroke', randomColor);
        path.setAttribute('stroke-width', '10'); // REDUCIDO: Mucho más fino y estilizado
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('fill', 'none');

        // APLICAMOS LA MÁSCARA TEXTURIZADA CON RUIDO
        path.setAttribute('mask', 'url(#canvas-brush-mask)');
        path.style.mixBlendMode = 'multiply';
        path.style.opacity = '0.85'; // Permite leer la información que hay detrás

        svg.appendChild(path);
        currentPathRef.current = path;
      }

      currentPathRef.current.setAttribute('d', createSvgPath(points));

      // Desvanecimiento rápido para mantener la pantalla limpia
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        const pathToAnimate = currentPathRef.current;
        if (pathToAnimate) {
          gsap.to(pathToAnimate, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
              if (pathToAnimate.parentNode === svg) pathToAnimate.remove();
            },
          });
        }
        pointsRef.current = [];
        currentPathRef.current = null;
        isDrawingRef.current = false;
      }, 100); // Se limpia rápido para no estorbar la lectura
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (svg) svg.innerHTML = '';
    };
  }, []);

  return (
    <div className='pointer-events-none fixed inset-0 z-50 h-screen w-screen bg-transparent'>
      <svg ref={svgRef} className='h-full w-full overflow-visible'>
        <defs>
          {/* MÁSCARA QUE GENERA EL RASPADO DE PINCEL SECO */}
          <mask id='canvas-brush-mask' maskUnits='userSpaceOnUse'>
            {/* El filtro de ruido se aplica aquí dentro para calar el trazo */}
            <filter id='brush-noise'>
              {/* Generamos un ruido fractal muy denso y rugoso */}
              <feTurbulence
                type='fractalNoise'
                baseFrequency='0.8'
                numOctaves='3'
                result='noise'
              />

              {/* Cambiamos los niveles del ruido para crear "huecos" blancos y negros puros */}
              <feComponentTransfer in='noise' result='sharp-noise'>
                <feFuncR type='linear' slope='2' intercept='-0.5' />
                <feFuncG type='linear' slope='2' intercept='-0.5' />
                <feFuncB type='linear' slope='2' intercept='-0.5' />
              </feComponentTransfer>

              {/* Usamos el ruido contrastado para desgastar la silueta del trazo (SourceGraphic) */}
              <feComposite operator='in' in='SourceGraphic' in2='sharp-noise' />
            </filter>

            {/* Un rectángulo blanco de fondo que procesa el filtro sobre toda la pantalla */}
            <rect
              width='100%'
              height='100%'
              fill='#ffffff'
              filter='url(#brush-noise)'
            />
          </mask>
        </defs>
      </svg>
    </div>
  );
}
