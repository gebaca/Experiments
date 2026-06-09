import React from 'react';

interface DibujoPruebaProps {
  pincelRef: React.RefObject<SVGPathElement | null>;
}

export const DibujoPrueba: React.FC<DibujoPruebaProps> = ({ pincelRef }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='400'
      height='400'
      viewBox='0 0 400 400'
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        {/* El molde de recorte: Aquí va el path que se va a medir y estirar */}
        <clipPath id='clip-lineal'>
          <path
            ref={pincelRef}
            fill='none'
            stroke='black'
            strokeWidth={12} // Un poco más grueso que el original para asegurar cobertura
            strokeLinecap='round'
            strokeLinejoin='round'
            // Una ruta simple en espiral/onda continua de prueba
            d='M 50 200 Q 125 50 200 200 T 350 200'
          />
        </clipPath>
      </defs>

      {/* El trazo visible de color rojo, recortado por el pincel animado */}
      <path
        fill='none'
        stroke='red'
        strokeWidth={8}
        strokeLinecap='round'
        strokeLinejoin='round'
        clipPath='url(#clip-lineal)'
        d='M 50 200 Q 125 50 200 200 T 350 200'
      />
    </svg>
  );
};
