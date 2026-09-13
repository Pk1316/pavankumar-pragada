import { motion } from "framer-motion";
import { useMotion } from "../hooks/useMotionTier";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * Section header: a title and at most one supporting line.
 *
 * There is deliberately no eyebrow label. Every section's eyebrow used to
 * restate its own heading ("Projects" above "Featured Projects"), which cost a
 * line of vertical space per section and told the reader nothing. Subtitles are
 * capped at `max-w-prose` so no line runs past ~80 characters.
 *
 * The entrance is a horizontal wipe rather than the fade-and-rise every other
 * element uses, and a short rule draws out ahead of it with a highlight
 * travelling its length. That gives the page one reveal that belongs to
 * headings alone, so a new section announces itself as a new section instead of
 * looking like one more card arriving.
 */
export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  const { transitions } = useMotion();

  if (!transitions) {
    return (
      <div className="max-w-prose">
        <span className="mb-st-3 block h-px w-10 bg-accent/70" aria-hidden="true" />
        <h2 className="text-h2 text-primary">{title}</h2>
        {subtitle && <p className="mt-st-2 text-body-lg text-secondary">{subtitle}</p>}
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-prose"
      initial="rest"
      whileInView="live"
      viewport={{ once: true, amount: 0.6 }}
    >
      <motion.span
        className="relative mb-st-3 block h-px overflow-hidden bg-border"
        variants={{ rest: { width: 0 }, live: { width: "3.5rem" } }}
        transition={{ duration: 0.5, ease: EASE }}
        aria-hidden="true"
      >
        <motion.span
          className="absolute inset-y-0 left-0 w-full bg-accent"
          variants={{ rest: { scaleX: 0 }, live: { scaleX: 1 } }}
          style={{ originX: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
        />
      </motion.span>

      <motion.h2
        className="text-h2 text-primary"
        variants={{
          // All four sides in the same unit. An `inset()` mixing `%` with
          // `em` does not interpolate reliably and could leave the wipe
          // stalled part-way, truncating the heading for good.
          rest: { clipPath: "inset(-20% 100% -20% 0%)", y: 6, opacity: 0.4 },
          live: { clipPath: "inset(-20% 0% -20% 0%)", y: 0, opacity: 1 },
        }}
        transition={{ duration: 0.62, delay: 0.06, ease: EASE }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className="mt-st-2 text-body-lg text-secondary"
          variants={{ rest: { opacity: 0, y: 8 }, live: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.45, delay: 0.3, ease: EASE }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
