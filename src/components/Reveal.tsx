import { motion } from "framer-motion";
import { useMotion } from "../hooks/useMotionTier";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger position. Each step adds 60ms, capped so long lists stay snappy. */
  index?: number;
  /** Travel distance in px. 0 fades only. */
  y?: number;
  /** Slide in from the side instead. Used by the timelines. */
  x?: number;
  duration?: number;
  /** Fraction visible before the reveal fires. */
  amount?: number;
  as?: "div" | "li" | "section" | "article" | "p";
}

const STAGGER_MS = 60;
const MAX_STAGGER_MS = 300;

/**
 * The page's one entrance animation.
 *
 * Everything that reveals on scroll goes through this, so the whole site shares
 * a single duration, easing and travel distance instead of each section
 * inventing its own. Under `prefers-reduced-motion` it renders a plain
 * element with no transform and no opacity ramp.
 */
export function Reveal({
  children,
  className,
  index = 0,
  y = 14,
  x = 0,
  duration = 0.5,
  amount = 0.2,
  as = "div",
}: RevealProps) {
  const { transitions } = useMotion();
  const Tag = motion[as];

  if (!transitions) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration,
        delay: Math.min(index * STAGGER_MS, MAX_STAGGER_MS) / 1000,
        ease: [0.22, 0.61, 0.36, 1],
      }}
    >
      {children}
    </Tag>
  );
}
