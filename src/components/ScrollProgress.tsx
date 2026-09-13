import { motion, useScroll, useSpring } from "framer-motion";
import { useMotion } from "../hooks/useMotionTier";

/**
 * Thin gradient bar across the top of the viewport tracking read progress.
 * Under reduced motion it still reports position, just without spring easing.
 * It is a position indicator, not an animation.
 */
export function ScrollProgress() {
  const { transitions } = useMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent-gradient"
      style={{ scaleX: transitions ? smooth : scrollYProgress }}
      aria-hidden="true"
    />
  );
}
