import React, { useRef } from 'react';
import { useSvgDraw } from './useSvgDraw'; // Asegúrate de importar el hook

interface LaDanseSvgProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  animationDuration?: number; // Duración en ms
}

export const LaDanseSvg: React.FC<LaDanseSvgProps> = ({
  size = '100%',
  className,
  animationDuration = 2500,
  ...props
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Activamos la animación al montar el componente
  useSvgDraw(svgRef, animationDuration);

  return (
    <svg
      ref={svgRef}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 500 500'
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <style>{`
        .blz-bg { fill: #ffffff; }
        .blz-blue { stroke: #0084ff; fill: none; stroke-width: 12; stroke-linecap: round; stroke-linejoin: round; }
        .blz-red { stroke: #ff2d1a; fill: none; stroke-width: 12; stroke-linecap: round; stroke-linejoin: round; }
        .blz-orange { stroke: #ff7300; fill: none; stroke-width: 11; stroke-linecap: round; stroke-linejoin: round; }
        .blz-yellow { stroke: #ffcc00; fill: none; stroke-width: 11; stroke-linecap: round; stroke-linejoin: round; }
        .blz-text { fill: #0084ff; font-family: system-ui, -apple-system, sans-serif; font-weight: 700; font-size: 16px; letter-spacing: -0.5px; }
      `}</style>

      <rect width='100%' height='100%' className='blz-bg' />

      {/* Tipografía fija con className */}
      <g id='typography' transform='translate(0, -5)'>
        <text x='65' y='65' className='blz-text'>
          berlioz
        </text>
        <text x='365' y='65' className='blz-text'>
          la danse
        </text>
      </g>

      {/* Composición de trazos con className */}
      <g id='art-composition'>
        <path
          d='M 45,130 C 110,70 190,140 255,95 C 310,60 395,120 445,85'
          className='blz-blue'
        />
        <path d='M 370,55 C 410,40 435,75 450,115' className='blz-blue' />

        <path
          d='M 55,230 C 35,280 25,350 40,410 C 45,430 35,460 25,490'
          className='blz-red'
        />
        <path
          d='M 85,185 C 60,210 50,250 65,285 C 75,310 110,300 135,320'
          className='blz-yellow'
        />
        <path d='M 105,215 C 135,235 175,245 210,230' className='blz-blue' />
        <path
          d='M 85,340 C 115,350 160,320 185,355 C 210,390 150,440 215,465'
          className='blz-blue'
          strokeWidth={14}
        />
        <path d='M 110,380 C 115,420 145,455 135,495' className='blz-yellow' />
        <path d='M 60,450 C 50,475 70,500 95,510' className='blz-orange' />

        <g strokeWidth={9}>
          <path
            d='M 235,160 Q 255,210 210,250'
            className='blz-blue'
            strokeWidth={13}
          />
          <path
            d='M 245,265 C 270,290 285,330 310,350'
            className='blz-orange'
          />
          <path
            d='M 215,370 Q 240,350 245,410 C 250,460 210,480 205,520'
            className='blz-blue'
          />
        </g>

        <path
          d='M 185,210 C 175,190 190,170 205,185 C 220,200 200,225 185,210 Z'
          className='blz-orange'
          strokeWidth={8}
        />
        <path d='M 145,145 C 120,165 95,200 125,235' className='blz-yellow' />
        <path
          d='M 285,255 C 275,245 280,225 295,235 C 310,245 300,265 285,255 Z'
          className='blz-yellow'
          strokeWidth={8}
        />

        <path
          d='M 290,160 C 330,135 365,185 345,220 C 325,255 280,230 300,190'
          className='blz-yellow'
        />
        <path
          d='M 335,215 C 375,195 420,215 440,260 C 465,310 445,395 415,440'
          className='blz-yellow'
          strokeWidth={13}
        />
        <path d='M 365,240 C 395,230 425,260 410,295' className='blz-orange' />
        <path
          d='M 435,165 C 430,145 450,115 465,100'
          className='blz-yellow'
          strokeWidth={14}
        />

        <path d='M 305,385 C 295,440 335,495 385,505' className='blz-red' />
        <path d='M 360,400 Q 380,440 355,475' className='blz-orange' />
        <path d='M 440,320 C 455,365 425,415 455,465' className='blz-blue' />
        <path
          d='M 285,495 C 330,525 400,515 435,490'
          className='blz-blue'
          strokeWidth={14}
        />
      </g>
    </svg>
  );
};

export default LaDanseSvg;
