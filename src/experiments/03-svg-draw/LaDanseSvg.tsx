import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LaDanseSvgProps {
  /** Path to the SVG file inside /public. Default: "/berlioz.svg" */
  src?: string;
  /** Optional className forwarded to the inner SVG container div */
  className?: string;
  /**
   * Total duration in seconds for the full sequential reveal.
   * Each path gets an equal share. Default: 8
   */
  totalDuration?: number;
  /**
   * Seconds of overlap between consecutive path reveals (0 = fully
   * sequential, one starts exactly when the previous ends). Default: 0
   */
  stagger?: number;
  /** Reveal direction for each path's clip rectangle. Default: "left" */
  direction?: 'left' | 'right' | 'top' | 'bottom';
  /** Called once the full timeline completes */
  onComplete?: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the axis-aligned bounding box of a path element in SVG user-space
 * coordinates (i.e. after the SVG's own transform, before any CSS scaling).
 * We add a small margin so the clip never clips anti-aliased edges.
 */
function getPathBBox(path: SVGPathElement): DOMRect {
  const raw = path.getBBox();
  const margin = 2;
  return new DOMRect(
    raw.x - margin,
    raw.y - margin,
    raw.width + margin * 2,
    raw.height + margin * 2
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LaDanseSvg({
  src = '/berlioz.svg',
  className = '',
  totalDuration = 8,
  stagger = 0,
  direction = 'left',
  onComplete,
}: LaDanseSvgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Start as "loading" — avoids a synchronous setState inside the effect body.
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  );

  const handleFetchError = useCallback((err: unknown) => {
    console.error('[LaDanseSvg] Failed to load SVG:', err);
    setStatus('error');
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // Effect 1 — Fetch & inject the SVG
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Reset state when src changes (setState inside an effect is allowed here
    // because it is a deliberate reset tied to a dependency change, not a
    // side-effect of the render itself).
    setStatus('loading');

    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.url}`);
        const svgText = await res.text();

        if (cancelled || !containerRef.current) return;

        // Parse and make fully responsive
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        if (!svgEl) throw new Error('No <svg> element found.');

        svgEl.setAttribute('width', '100%');
        svgEl.setAttribute('height', '100%');
        svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        // viewBox is intentionally left untouched.

        containerRef.current.innerHTML = svgEl.outerHTML;

        if (!cancelled) setStatus('ready');
      } catch (err) {
        if (!cancelled) handleFetchError(err);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [src, handleFetchError]);

  // ──────────────────────────────────────────────────────────────────────────
  // Effect 2 — Build the GSAP clip-reveal timeline once the SVG is in the DOM
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status !== 'ready' || !containerRef.current) return;

    const container = containerRef.current;
    const svgEl = container.querySelector<SVGSVGElement>('svg');
    if (!svgEl) return;

    // Kill any previous timeline before rebuilding
    timelineRef.current?.kill();

    // ── Collect fill paths (skip fill="none" — those are invisible helpers)
    const paths = Array.from(
      svgEl.querySelectorAll<SVGPathElement>('path')
    ).filter((p) => {
      const fill = p.getAttribute('fill');
      return fill && fill !== 'none';
    });

    if (paths.length === 0) return;

    // ── Create a <defs> element to hold all our clipPaths
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svgEl.prepend(defs);

    // ── For each path: create a uniquely-id'd clipPath containing a <rect>
    //    sized to the path's bounding box, then link it to the path.
    const clipRects: SVGRectElement[] = [];

    paths.forEach((path, i) => {
      const bbox = getPathBBox(path);
      const id = `__ldsvg_clip_${i}_${Date.now()}`;

      // <clipPath id="..."><rect .../></clipPath>
      const clipPath = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'clipPath'
      );
      clipPath.setAttribute('id', id);

      const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );

      // Position the rect to cover the path's bbox
      rect.setAttribute('x', String(bbox.x));
      rect.setAttribute('y', String(bbox.y));
      rect.setAttribute('width', String(bbox.width));
      rect.setAttribute('height', String(bbox.height));

      // ── Initial state: zero-size rect so the path is invisible ──────────
      // We collapse the rect along the chosen axis so nothing is visible yet.
      if (direction === 'left' || direction === 'right') {
        rect.setAttribute('width', '0');
      } else {
        rect.setAttribute('height', '0');
      }

      // For "right" or "bottom" we also need to offset the rect's origin
      if (direction === 'right') {
        rect.setAttribute('x', String(bbox.x + bbox.width));
      }
      if (direction === 'bottom') {
        rect.setAttribute('y', String(bbox.y + bbox.height));
      }

      clipPath.appendChild(rect);
      defs.appendChild(clipPath);

      // Apply the clipPath to the path element
      path.setAttribute('clip-path', `url(#${id})`);

      clipRects.push(rect);
    });

    // ── Build the sequential GSAP timeline ─────────────────────────────────
    const perPath = totalDuration / paths.length;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: onComplete,
    });

    paths.forEach((path, i) => {
      const bbox = getPathBBox(path);
      const rect = clipRects[i];

      let tweenVars: gsap.TweenVars;

      if (direction === 'left') {
        tweenVars = {
          attr: { width: bbox.width },
          duration: perPath,
        };
      } else if (direction === 'right') {
        tweenVars = {
          attr: { x: bbox.x, width: bbox.width },
          duration: perPath,
        };
      } else if (direction === 'top') {
        tweenVars = {
          attr: { height: bbox.height },
          duration: perPath,
        };
      } else {
        // bottom
        tweenVars = {
          attr: { y: bbox.y, height: bbox.height },
          duration: perPath,
        };
      }

      tl.to(rect, tweenVars, i === 0 ? 0 : `>-${stagger}`);
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [status, totalDuration, stagger, direction, onComplete]);

  // ──────────────────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'transparent',
      }}
      aria-label='Animated SVG illustration'
      role='img'
    >
      {status === 'loading' && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.35,
            fontSize: '0.75rem',
            pointerEvents: 'none',
          }}
        >
          Loading…
        </span>
      )}
      {status === 'error' && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'crimson',
            fontSize: '0.75rem',
          }}
        >
          Failed to load SVG — check the <code>src</code> prop and that the file
          lives in <code>/public</code>.
        </span>
      )}
      {/* SVG is injected imperatively into this div */}
      <div
        ref={containerRef}
        className={className}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
