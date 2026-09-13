import { useMotion } from "../../hooks/useMotionTier";
import { useInViewOnce } from "../../hooks/useInViewOnce";
import { cn } from "../../utils/cn";
import { PROJECT_VISUALS } from "./projects";

interface Props {
  slug: string;
  /** Tighter framing for the card grid; roomier for the case-study header. */
  size?: "card" | "hero";
  className?: string;
}

/**
 * Frames a project's architecture visual.
 *
 * The diagram's continuous animation is mounted only while the frame is on
 * screen (`repeat: true`, so it also unmounts when scrolled past) and only at
 * the `full` motion tier, so a phone, a reduced-motion visitor, or a visual
 * three screens down costs nothing at all.
 *
 * On hover the plate lifts toward the viewer: a slow scale, a gradient wash
 * that recedes, and the top edge line brightening. The diagram's own flowing
 * dashes do the rest.
 */
export function ProjectVisual({ slug, size = "card", className }: Props) {
  const { ambient } = useMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ amount: 0.15, repeat: true });

  const Visual = PROJECT_VISUALS[slug];
  if (!Visual) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden border-b border-border bg-[#0A0C11]",
        size === "hero" ? "rounded-t-2xl" : "",
        className,
      )}
    >
      {/* In the case study the diagram is the thing being read, so below `sm`
          the well holds it at a floor width and scrolls sideways rather than
          shrinking its labels past legible size. On a card it is a miniature
          introducing the project, and a miniature that has to be dragged
          sideways is worse than one that simply fits. */}
      <div className={size === "hero" ? "diagram-well" : undefined}>
        <div className="transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          <Visual animate={inView && ambient} />
        </div>
      </div>

      {/* wash that recedes on hover, so the diagram reads brighter under the cursor */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-bg/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-40"
        aria-hidden="true"
      />
      {/* hairline that catches the accent on hover */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>
  );
}
