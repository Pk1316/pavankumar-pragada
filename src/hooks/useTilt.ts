import { useCallback, useEffect, useRef } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useFinePointer } from "./useFinePointer";

interface TiltOptions {
  /** Maximum rotation on each axis, in degrees. */
  max?: number;
  stiffness?: number;
  damping?: number;
}

/**
 * Pointer-driven 3D tilt.
 *
 * Returns spring-smoothed `rotateX`/`rotateY` for the element itself plus the
 * normalised pointer position (`px`/`py`, 0..1) so a child can track the cursor
 * for a sheen highlight. Pointer maths is throttled to one rAF per frame.
 *
 * `enabled` is false under `prefers-reduced-motion` or on coarse pointers; the
 * handlers become no-ops so the element renders completely static.
 */
export function useTilt({ max = 8, stiffness = 220, damping = 22 }: TiltOptions = {}) {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const enabled = !reduce && fine;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness, damping });
  const rotateY = useSpring(rawY, { stiffness, damping });

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const frame = useRef<number | null>(null);
  const pending = useRef<{ nx: number; ny: number } | null>(null);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return;

      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      pending.current = {
        nx: (event.clientX - rect.left) / rect.width,
        ny: (event.clientY - rect.top) / rect.height,
      };

      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const next = pending.current;
        if (!next) return;

        px.set(next.nx);
        py.set(next.ny);
        rawY.set((next.nx - 0.5) * 2 * max);
        rawX.set(-(next.ny - 0.5) * 2 * max);
      });
    },
    [enabled, max, px, py, rawX, rawY],
  );

  const onPointerLeave = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    pending.current = null;

    rawX.set(0);
    rawY.set(0);
    px.set(0.5);
    py.set(0.5);
  }, [px, py, rawX, rawY]);

  return { enabled, rotateX, rotateY, px, py, onPointerMove, onPointerLeave };
}
