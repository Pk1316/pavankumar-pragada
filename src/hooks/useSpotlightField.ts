import { useEffect } from "react";
import { useFinePointer } from "./useFinePointer";
import { useMotion } from "./useMotionTier";

/**
 * Feeds every `.card-glow` on the page the pointer position, as the `--px` and
 * `--py` custom properties its highlight reads.
 *
 * Deliberately one delegated listener for the whole document rather than a
 * handler per card: the page carries upwards of twenty cards, and twenty React
 * `pointermove` subscriptions doing their own `getBoundingClientRect` is real
 * work on every frame of every mouse move. Here the cost is one listener, one
 * `closest` call and one rAF, no matter how many cards exist.
 *
 * Writes are batched into a frame and skipped entirely when the pointer is not
 * over a card, so idle movement across the page costs a hit-test and nothing
 * else. Inert on touch devices and under `prefers-reduced-motion`, where the
 * highlight is not rendered at all.
 */
export function useSpotlightField() {
  const fine = useFinePointer();
  const { transitions } = useMotion();
  const active = fine && transitions;

  useEffect(() => {
    if (!active) return;

    let frame: number | null = null;
    let pending: { card: HTMLElement; x: number; y: number } | null = null;

    function onMove(event: PointerEvent) {
      const target = event.target as Element | null;
      const card = target?.closest?.(".card-glow") as HTMLElement | null;
      if (!card) return;

      pending = { card, x: event.clientX, y: event.clientY };
      if (frame !== null) return;

      frame = requestAnimationFrame(() => {
        frame = null;
        if (!pending) return;

        const { card: el, x, y } = pending;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        el.style.setProperty("--px", `${(((x - rect.left) / rect.width) * 100).toFixed(2)}%`);
        el.style.setProperty("--py", `${(((y - rect.top) / rect.height) * 100).toFixed(2)}%`);
      });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [active]);
}
