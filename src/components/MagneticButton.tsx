import { motion } from "framer-motion";
import { useMagnetic } from "../hooks/useMagnetic";
import { useMotion } from "../hooks/useMotionTier";

interface Props {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  /** Label the cursor probe prints while hovering this button. */
  "data-cursor"?: string;
  "aria-label"?: string;
}

/**
 * Button that leans toward the cursor while hovered and springs back on leave.
 * Falls back to a plain button (no transform) under `prefers-reduced-motion`
 * or on touch devices.
 */
export function MagneticButton({ onClick, className, children, ...rest }: Props) {
  const { transitions } = useMotion();
  const { enabled, x, y, onPointerMove, onPointerLeave } = useMagnetic({ strength: 0.2, max: 6 });

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={className}
      style={enabled ? { x, y } : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      whileHover={transitions ? { scale: 1.025 } : undefined}
      whileTap={transitions ? { scale: 0.975 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
