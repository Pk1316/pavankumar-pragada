import { useCallback, useEffect, useRef } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useFinePointer } from "./useFinePointer";

interface MagneticOptions {
  /** Fraction of the cursor's offset from centre that the element follows. */
  strength?: number;
  /** Hard cap on travel, in pixels, so the element never detaches from its slot. */
  max?: number;
}

/**
 * Makes an element lean toward the cursor while hovered, then spring back.
 * Disabled under `prefers-reduced-motion` and on coarse pointers.
 */
export function useMagnetic({ strength = 0.28, max = 8 }: MagneticOptions = {}) {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const enabled = !reduce && fine;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 260, damping: 20 });
  const y = useSpring(rawY, { stiffness: 260, damping: 20 });

  const frame = useRef<number | null>(null);
  const pending = useRef<{ dx: number; dy: number } | null>(null);

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
      pending.current = {
        dx: (event.clientX - (rect.left + rect.width / 2)) * strength,
        dy: (event.clientY - (rect.top + rect.height / 2)) * strength,
      };

      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const next = pending.current;
        if (!next) return;

        const clamp = (value: number) => Math.max(-max, Math.min(max, value));
        rawX.set(clamp(next.dx));
        rawY.set(clamp(next.dy));
      });
    },
    [enabled, strength, max, rawX, rawY],
  );

  const onPointerLeave = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    pending.current = null;
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { enabled, x, y, onPointerMove, onPointerLeave };
}
