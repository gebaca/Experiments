import { useMemo } from 'react';

interface DepthStyles {
  filter: string;
  zIndex: number;
  transform: string; // Opcional: para dar sensación de tamaño por distancia
}

/**
 * @param zIndex El nivel de profundidad real.
 * Valores negativos = Lejos (atrás).
 * Valor 0 = Plano focal (nítido).
 * Valores positivos = Cerca (adelante).
 */
export const useStaticDepth = (zIndex: number): DepthStyles => {
  return useMemo(() => {
    // 1. Calcular Oscuridad (Brightness)
    // Si está atrás (zIndex < 0), se oscurece proporcionalmente.
    // Si está al frente (zIndex >= 0), mantiene brillo total (1).
    const brightness =
      zIndex < 0
        ? Math.max(0.1, 1 + zIndex * 0.15) // Resta 15% de brillo por cada nivel negativo
        : 1;

    // 2. Calcular Difuminado (Blur)
    // El desenfoque aumenta si el objeto se aleja (valores negativos)
    const blur =
      zIndex < 0
        ? Math.abs(zIndex) * 1.5 // 1.5px de blur por cada nivel de profundidad hacia atrás
        : 0;

    // 3. Calcular Escala (Transform) - Opcional para reforzar el efecto óptico
    // Los objetos lejanos se ven ligeramente más pequeños
    const scale = zIndex < 0 ? Math.max(0.5, 1 + zIndex * 0.1) : 1;

    return {
      filter: `blur(${blur}px) brightness(${brightness})`,
      transform: `scale(${scale})`,
      zIndex: zIndex,
    };
  }, [zIndex]);
};
