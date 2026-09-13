import { motion, useMotionTemplate, useTransform } from "framer-motion";
import { useTilt } from "../hooks/useTilt";
import { useMotion } from "../hooks/useMotionTier";
import { PipelineStrip } from "./PipelineStrip";
import portrait560 from "../assets/portrait-560.webp";
import portrait941 from "../assets/portrait-941.webp";

interface Props {
  name: string;
  role: string;
  /** Seconds to hold before settling in, so the frame lands with the copy. */
  introDelay?: number;
}

/**
 * Hero portrait in a glass frame.
 *
 * Rests cooled and slightly desaturated so the photo's warm tones sit inside
 * the dark theme, then animates to full colour on hover/focus. Tilts toward the
 * pointer, with a highlight that tracks the cursor across the glass.
 *
 * The data-flow diagram overlays the lower edge from `lg` up; on smaller
 * screens it stacks underneath so it never covers the subject.
 */
export function PortraitCard({ name, role, introDelay = 0 }: Props) {
  const { transitions } = useMotion();
  const { enabled, rotateX, rotateY, px, py, onPointerMove, onPointerLeave } = useTilt({ max: 6 });

  const sheenX = useTransform(px, (v) => `${(v * 100).toFixed(2)}%`);
  const sheenY = useTransform(py, (v) => `${(v * 100).toFixed(2)}%`);
  const sheen = useMotionTemplate`radial-gradient(340px circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.13), transparent 65%)`;

  return (
    <div className="relative" style={{ perspective: 1200 }}>
      {/* glow ring behind the frame */}
      <div
        className="absolute -inset-3 rounded-[1.75rem] bg-accent-gradient opacity-20 blur-2xl transition-opacity duration-500 group-hover/portrait:opacity-40"
        aria-hidden="true"
      />

      <motion.div
        className="group/portrait relative"
        style={enabled ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        initial={transitions ? { opacity: 0, scale: 0.97, y: 10 } : undefined}
        animate={transitions ? { opacity: 1, scale: 1, y: 0 } : undefined}
        transition={{ duration: 0.65, ease: [0.22, 0.61, 0.36, 1], delay: introDelay + 0.15 }}
      >
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 p-2 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.9)] backdrop-blur">
          <div className="relative overflow-hidden rounded-[1.25rem]">
            <img
              src={portrait941}
              srcSet={`${portrait560} 560w, ${portrait941} 941w`}
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 88vw"
              width={941}
              height={1672}
              alt={`${name}, ${role}`}
              fetchPriority="high"
              decoding="async"
              className="block w-full saturate-[0.72] brightness-[0.86] contrast-[1.05] transition-[filter,transform] duration-700 ease-out will-change-transform group-hover/portrait:scale-[1.03] group-hover/portrait:saturate-100 group-hover/portrait:brightness-100 motion-reduce:transition-none motion-reduce:group-hover/portrait:scale-100"
            />

            {/* cool wash that lifts on hover, bridging the photo into the dark palette */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-accent-violet/20 opacity-70 transition-opacity duration-700 group-hover/portrait:opacity-0"
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-bg via-bg/50 to-transparent"
              aria-hidden="true"
            />

            {/* cursor-tracked sheen */}
            {enabled && (
              <motion.div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/portrait:opacity-100"
                style={{ background: sheen }}
                aria-hidden="true"
              />
            )}
          </div>

          {/* pipeline: overlays the lower edge on large screens, stacks below otherwise */}
          <div className="mt-2 rounded-xl border border-border bg-surface/80 p-st-2 backdrop-blur-md lg:absolute lg:inset-x-3 lg:bottom-3 lg:mt-0 lg:bg-bg/85 lg:p-st-2">
            <PipelineStrip />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
