import { useMotion } from "../hooks/useMotionTier";

interface StatusDotProps {
  label: string;
  color?: "cyan" | "green";
}

export function StatusDot({ label, color = "cyan" }: StatusDotProps) {
  const { transitions } = useMotion();
  const dotColor = color === "green" ? "bg-emerald-400" : "bg-accent";

  return (
    // `items-start` with the dot nudged down: the label wraps to two lines on a
    // phone, and centring put the dot in the gap between them.
    <span className="inline-flex items-start gap-st-1 font-mono text-micro text-secondary">
      <span className="relative mt-[5px] flex h-2 w-2 shrink-0">
        {transitions && (
          // `ring-out` rather than Tailwind's `ping`: it travels further and
          // fades on a curve, so it reads as a signal leaving the dot instead
          // of the dot flashing.
          <span className={`absolute inline-flex h-full w-full animate-ring-out rounded-full ${dotColor}`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`} />
      </span>
      {label}
    </span>
  );
}
