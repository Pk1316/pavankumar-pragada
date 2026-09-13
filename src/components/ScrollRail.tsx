import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import { useMotion } from "../hooks/useMotionTier";

interface Props {
  /** The element the rail runs alongside; its scroll position drives the fill. */
  targetRef: React.RefObject<HTMLElement | null>;
  /**
   * Distance from the container's left edge, in px. Used as the fallback for
   * `--rail-left`, which a caller can set per breakpoint when the marker it
   * runs through changes size (the experience markers shrink below `sm`).
   */
  left?: number;
  className?: string;
}

/**
 * A vertical rail that draws itself in as its container scrolls past.
 *
 * The track is always fully visible so the timeline's extent is never in
 * doubt; the accent fill on top is what grows. Under reduced motion the fill
 * is simply complete from the start. The rail is structure, not decoration,
 * so it must never read as broken.
 */
export function ScrollRail({ targetRef, left = 19, className }: Props) {
  const { transitions } = useMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 85%", "end 60%"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const height = useTransform(smooth, [0, 1], ["0%", "100%"]);

  return (
    <div
      className={className ?? "pointer-events-none absolute inset-y-2 w-px"}
      style={{ left: `var(--rail-left, ${left}px)` }}
      aria-hidden="true"
    >
      <div className="h-full w-px bg-border" />
      <motion.div
        className="absolute inset-x-0 top-0 w-px bg-gradient-to-b from-accent via-accent/70 to-accent-violet/60"
        style={{ height: transitions ? height : "100%" }}
      />
    </div>
  );
}
