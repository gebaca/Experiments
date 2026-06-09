import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Tipado para los datos de los bloques (con gatitos estables)
interface MotionBlock {
  id: number;
  title: string;
  category: string;
  image: string;
  previews: string[];
}

const SLIDES_DATA: MotionBlock[] = [
  {
    id: 1,
    title: 'FELINE FORCE',
    category: 'CONCEPT / 01',
    image:
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1200', // Gato blanco elegante
    previews: [
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=400',
      'https://images.unsplash.com/photo-1514888286974-8c23e18dadd6?q=80&w=400',
    ],
  },
  {
    id: 2,
    title: 'PURR PERSPECTIVE',
    category: 'DESIGN / 02',
    image:
      'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=1200', // Gato atigrado sobrio
    previews: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=400',
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=400',
    ],
  },
  {
    id: 3,
    title: 'MEOW MOMENTUM',
    category: 'DEVELOP / 03',
    image:
      'https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=1200', // Gato naranja de estudio
    previews: [
      'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?q=80&w=400',
      'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=400',
    ],
  },
];

export default function MotionShowcaseKittens() {
  const containerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  // 1. Inicializar Scroll Suave (Lenis) [00:07:11]
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Sincronizar Lenis con ScrollTrigger [00:07:19]
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  // 2. Animaciones Principales con GSAP
  useGSAP(
    () => {
      if (!showcaseRef.current) return;

      const blocks = gsap.utils.toArray<HTMLElement>('.motion-block');

      // Crear la línea de tiempo maestra [00:06:44]
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: 'top top',
          end: '+=6000', // Un scroll largo para fluidez [00:06:57]
          pin: true, // Fijar pantalla
          scrub: 1, // Suavizado de respuesta [00:06:21]
        },
      });

      // Configuración inicial de los elementos que se revelarán al final [00:07:35]
      gsap.set('.preview-col', { yPercent: 30, opacity: 1 }); // Estado base visible
      gsap.set('.manifesto-line span', { yPercent: 100 });

      // Animación en bucle para cada slide [00:07:56]
      blocks.forEach((block, index) => {
        const isLast = index === blocks.length - 1;

        const mediaWrapper = block.querySelector('.motion-media');
        const img = block.querySelector('.motion-img');
        const text = block.querySelector('.motion-text');
        const previews = block.querySelector('.preview-col');

        // --- ANIMACIÓN CUANDO EL SLIDE ESTÁ ACTIVO ---

        // Parallax sutil de las miniaturas hacia arriba [00:08:16]
        tl.to(
          previews,
          {
            yPercent: -30, // Se mueve en oposición al scroll
            ease: 'none',
          },
          index
        )

          // Zoom sutil a la imagen de fondo de gatito [00:08:23]
          .to(
            img,
            {
              scale: 1.15,
              ease: 'none',
            },
            index
          );

        // --- ANIMACIÓN CUANDO EL SLIDE SE OCULTA (SOLAPADA) ---
        // (Si no es la última capa, la recortamos para revelar la que está abajo) [00:08:33]
        if (!isLast) {
          tl.to(
            mediaWrapper,
            {
              clipPath: 'inset(0% 0% 100% 0%)', // Efecto 'shutter' (persiana)
              ease: 'none',
            },
            index + 0.4
          ) // Comienza un poco antes de que termine el parallax [00:08:47]

            .to(
              text,
              {
                yPercent: -50,
                opacity: 0,
                ease: 'none',
              },
              index + 0.4
            )

            // *** LA CORRECCIÓN CLAVE ***
            // Ocultar las miniaturas de ESTE slide al mismo tiempo que el resto desaparece [00:08:54]
            .to(
              previews,
              {
                yPercent: -150, // Vuelan más rápido hacia arriba [00:09:02]
                opacity: 0,
                scale: 0.8, // Encoger sutilmente
                ease: 'power2.inOut', // Usar un suavizado para la desaparición
              },
              index + 0.4
            ); // Mismo tiempo de inicio que la desaparición del texto
        }
      });

      // 3. Revelado final del Manifiesto [00:09:14]
      tl.to(
        '.manifesto-line span',
        {
          yPercent: 0,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '+=0.2'
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className='bg-neutral-950 text-white font-sans overflow-x-hidden antialiased'
    >
      {/* HEADER FIJO [00:03:42] */}
      <header className='fixed top-0 left-0 w-full z-50 p-8 flex justify-between mix-blend-difference font-mono text-xs tracking-widest pointer-events-none uppercase'>
        <span>FELINE / DESIGN</span>
      </header>

      {/* SECCIÓN INTRO (Estilo editorial) [00:01:07, 00:03:58] */}
      <section className='min-h-screen pt-40 px-8 flex flex-col justify-start gap-2 select-none uppercase'>
        <h1 className='text-5xl md:text-8xl font-black tracking-tighter pl-[0%]'>
          WE MASTER
        </h1>
        <h1 className='text-5xl md:text-8xl font-black tracking-tighter pl-[10%] text-neutral-500'>
          THE OVERLOOKED
        </h1>
        <h1 className='text-5xl md:text-8xl font-black tracking-tighter pl-[5%]'>
          KITTEN EXPERIENCES
        </h1>
        <h1 className='text-5xl md:text-8xl font-black tracking-tighter pl-[20%] text-neutral-600'>
          THAT FEEL
        </h1>
        <h1 className='text-5xl md:text-8xl font-black tracking-tighter pl-[15%]'>
          CONNECTED.
        </h1>
      </section>

      {/* CONTENEDOR PRINCIPAL DEL SHOWCASE (FIJADO) [00:01:21, 00:04:16] */}
      <section
        ref={showcaseRef}
        className='relative h-screen w-full overflow-hidden bg-neutral-950'
      >
        {SLIDES_DATA.map((slide, index) => (
          <div
            key={slide.id}
            className='motion-block absolute inset-0 w-full h-full flex items-center justify-between px-8 md:px-20 z-10'
            style={{ zIndex: SLIDES_DATA.length - index }} // Orden de apilamiento obligado (3, 2, 1) [00:04:29]
          >
            {/* Capa de Texto (z-30 para estar encima) */}
            <div className='motion-text z-30 relative max-w-xl pointer-events-none mix-blend-difference'>
              <span className='font-mono text-xs md:text-sm text-neutral-300 block mb-3 tracking-widest uppercase'>
                {slide.category}
              </span>
              <h2 className='text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase'>
                {slide.title}
              </h2>
            </div>

            {/* Capa Central: Imagen de Fondo + Máscara (z-10) [00:01:52, 00:04:47] */}
            <div className='motion-media absolute inset-0 w-full h-full overflow-hidden bg-neutral-900 z-10'>
              <img
                className='motion-img absolute inset-0 w-full h-full object-cover opacity-60 select-none pointer-events-none'
                src={slide.image}
                alt={slide.title}
              />
            </div>

            {/* Contenedor Derecha: Miniaturas Flotantes (z-30) [00:01:46, 00:05:08] */}
            <div className='z-30 relative h-full flex items-center ml-auto pointer-events-none'>
              <div className='preview-col hidden md:flex flex-col gap-6 w-44 lg:w-52 transform-gpu'>
                {slide.previews.map((src, idx) => (
                  <div
                    key={idx}
                    className='aspect-3/4 w-full overflow-hidden rounded-xl shadow-2xl border border-white/10 bg-neutral-900'
                  >
                    <img
                      src={src}
                      className='w-full h-full object-cover select-none pointer-events-none'
                      alt='kitten preview'
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* SECCIÓN MANIFESTO (Final del scroll) [00:02:12, 00:05:27] */}
      <section className='min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center px-6'>
        <div className='max-w-4xl space-y-3 uppercase'>
          <h2 className='manifesto-line text-3xl md:text-6xl font-black tracking-tighter overflow-hidden block leading-none'>
            <span className='block transform'>THE MEOW SECRET</span>
          </h2>
          <h2 className='manifesto-line text-3xl md:text-6xl font-black tracking-tighter overflow-hidden block text-neutral-500 leading-none'>
            <span className='block transform'>IS CONTINUITY</span>
          </h2>
          <h2 className='manifesto-line text-3xl md:text-6xl font-black tracking-tighter overflow-hidden block leading-none'>
            <span className='block transform'>INSTEAD OF CHOPPY STEPS.</span>
          </h2>
        </div>
      </section>
    </div>
  );
}
