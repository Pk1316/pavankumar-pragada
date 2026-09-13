import { useCallback, useSyncExternalStore } from "react";

export type MotionTier = "none" | "lite" | "full";

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const SMALL_QUERY = "(max-width: 767px)";
const COARSE_QUERY = "(pointer: coarse)";

/** Rough proxy for a low-power device: few cores or little memory. */
function isLowPower(): boolean {
  const cores = navigator.hardwareConcurrency;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof cores === "number" && cores > 0 && cores <= 4) return true;
  if (typeof memory === "number" && memory > 0 && memory <= 4) return true;
  return false;
}

function snapshot(): MotionTier {
  if (window.matchMedia(REDUCE_QUERY).matches) return "none";
  const small = window.matchMedia(SMALL_QUERY).matches;
  const coarse = window.matchMedia(COARSE_QUERY).matches;
  if (small || (coarse && isLowPower())) return "lite";
  return "full";
}

/**
 * How much motion this visitor should get.
 *
 * - `none`:  `prefers-reduced-motion: reduce`. Nothing decorative animates.
 * - `lite`:  phones, and low-power touch devices. Scroll reveals and hovers
 *             stay, but continuous background loops (canvas network, diagram
 *             particles, radar sweeps) are dropped.
 * - `full`:  desktop. Everything runs.
 *
 * Read through `useSyncExternalStore` so the value is right on first paint
 * rather than flipping in after an effect, and so rotating a phone or
 * toggling the OS motion setting re-tiers the page live.
 */
export function useMotionTier(): MotionTier {
  const subscribe = useCallback((onChange: () => void) => {
    const queries = [REDUCE_QUERY, SMALL_QUERY, COARSE_QUERY].map((q) => window.matchMedia(q));
    queries.forEach((mq) => mq.addEventListener("change", onChange));
    return () => queries.forEach((mq) => mq.removeEventListener("change", onChange));
  }, []);

  return useSyncExternalStore(
    subscribe,
    snapshot,
    // Server/prerender fallback: assume the quietest tier.
    useCallback(() => "none" as MotionTier, []),
  );
}

/** Convenience flags for the common checks. */
export function useMotion() {
  const tier = useMotionTier();
  return {
    tier,
    /** No decorative motion at all. */
    still: tier === "none",
    /** Continuous background loops are allowed. */
    ambient: tier === "full",
    /** Entrance/hover motion is allowed. */
    transitions: tier !== "none",
  };
}
