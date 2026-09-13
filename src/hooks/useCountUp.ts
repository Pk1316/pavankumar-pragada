import { useEffect, useRef, useState } from "react";

/** `"1679 (3★, Div 2, provisional)"` → `{ prefix: "", value: 1679, suffix: " (3★, …)" }` */
export interface ParsedStat {
  prefix: string;
  value: number;
  /** Digit grouping in the source string, e.g. `112,131` → true. */
  grouped: boolean;
  suffix: string;
}

/**
 * Pulls the leading number out of a stat string so it can be counted up while
 * the rest of the string is left exactly as authored.
 *
 * Returns `null` when there is no leading number. Those stats render as plain
 * text. Nothing is ever rounded, scaled or invented: the target is the number
 * that was already in the data.
 */
export function parseStat(raw: string): ParsedStat | null {
  const match = /^(\D*?)(\d[\d,]*)(.*)$/s.exec(raw);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const value = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(value)) return null;

  return { prefix, value, grouped: digits.includes(","), suffix };
}

/**
 * Counts from 0 to `target` once `active` turns true.
 *
 * Eased with a cubic ease-out and driven by `requestAnimationFrame`, so a whole
 * grid of stats costs one frame loop each for well under a second. When
 * `active` is false the hook returns the final value immediately, which is what
 * the reduced-motion path wants: the number is information, not decoration,
 * so it must always be readable.
 */
export function useCountUp(target: number, active: boolean, duration = 900): number {
  const [value, setValue] = useState(active ? 0 : target);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setValue(target);
      return;
    }

    const start = performance.now();

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    }

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [target, active, duration]);

  return value;
}
