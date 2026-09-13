import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer } from "../hooks/useFinePointer";
import { useMotion } from "../hooks/useMotionTier";

/** Anything that responds to a click, plus anything opting in by attribute. */
const INTERACTIVE = 'a[href], button, [role="button"], input, select, textarea, [data-cursor]';

type Target = { label: string | null; wide: boolean } | null;

/**
 * A pointer probe: a ring that trails the cursor on a spring and reports what
 * is under it.
 *
 * Over plain page it rests small and dim. Over anything clickable it opens up
 * and takes the accent. Over an element carrying `data-cursor` it opens
 * further and prints that element's label, so a project card can say what
 * clicking it does before it is clicked.
 *
 * The system cursor is deliberately left visible underneath. Hiding it is the
 * usual way this effect is done and it costs more than it gives: the arrow and
 * the I-beam are how a visitor knows text can be selected, and this page has an
 * email address on it that people are meant to select. The ring is an addition
 * to the cursor, not a replacement for it.
 *
 * Mounted only for a fine pointer at the full motion tier, and hidden the
 * moment the pointer leaves the window or the tab loses focus.
 */
export function CursorProbe() {
  const fine = useFinePointer();
  const { ambient } = useMotion();
  const enabled = fine && ambient;

  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [target, setTarget] = useState<Target>(null);

  // Read inside the pointermove handler to avoid re-subscribing on every hover.
  const targetRef = useRef<Target>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 34, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 380, damping: 34, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;

    function onMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const el = (event.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
      const next: Target = el ? { label: el.dataset.cursor || null, wide: Boolean(el.dataset.cursor) } : null;

      const prev = targetRef.current;
      if (prev?.label === next?.label && prev?.wide === next?.wide && Boolean(prev) === Boolean(next)) return;
      targetRef.current = next;
      setTarget(next);
    }

    function hide() {
      setVisible(false);
      setPressed(false);
    }
    const press = () => setPressed(true);
    const release = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("pointerleave", hide);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("blur", hide);
      document.removeEventListener("pointerleave", hide);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = target?.wide ? 66 : target ? 42 : 26;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] hidden md:block" aria-hidden="true">
      {/* trailing ring */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
        transition={{ opacity: { duration: 0.2 } }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full border"
          animate={{
            width: size,
            height: size,
            x: -size / 2,
            y: -size / 2,
            scale: pressed ? 0.82 : 1,
            borderColor: target ? "rgba(34,211,238,0.85)" : "rgba(255,255,255,0.32)",
            // A labelled ring sits over the card's own text, so it takes a
            // near-solid ground. An unlabelled one stays a ring and lets what
            // is underneath read through it.
            backgroundColor: target?.wide
              ? "rgba(8,9,10,0.9)"
              : target
                ? "rgba(34,211,238,0.08)"
                : "rgba(34,211,238,0)",
          }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        >
          {target?.label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] text-accent"
            >
              {target.label}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

    </div>
  );
}
