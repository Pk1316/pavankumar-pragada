import { useCallback, useSyncExternalStore } from "react";

const QUERY = "(pointer: fine)";

/**
 * True when the visitor has a precise pointing device (mouse/trackpad).
 *
 * Pointer-driven effects (tilt, magnetic buttons, spotlight) are gated on this
 * so they never fire, or jitter, on touch devices. Read through
 * `useSyncExternalStore` so the value is correct on first paint rather than
 * flipping in after an effect.
 */
export function useFinePointer(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const mq = window.matchMedia(QUERY);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const getSnapshot = useCallback(() => window.matchMedia(QUERY).matches, []);

  // Server/prerender fallback: assume coarse, so effects stay off until hydrated.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
