import { useMotion } from "../hooks/useMotionTier";
import { cn } from "../utils/cn";

const STAGES = ["React", "API", "FastAPI", "Kafka", "Processing", "PostgreSQL", "WebSocket", "Dashboard"];

/**
 * Condensed pipeline read-out for the hero portrait overlay.
 *
 * This is where the stages are actually *named*. The hero backdrop behind the
 * headline draws the same topology without labels, so the two layers
 * complement each other rather than repeat.
 */
export function PipelineStrip() {
  const { ambient } = useMotion();

  return (
    <div>
      <p className="mb-st-1 font-mono text-nano uppercase text-secondary">Data flow, end to end</p>

      <ul
        className="flex flex-wrap items-center gap-1"
        aria-label="Data pipeline: React to API to FastAPI to Kafka to Processing to PostgreSQL to WebSocket to Dashboard"
      >
        {STAGES.map((stage, i) => (
          // The arrow rides inside the same item as its chip, so a wrap can
          // never leave a separator orphaned at the start of a line.
          <li key={stage} className="inline-flex items-center gap-1">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg/70 px-1.5 py-1 font-mono text-nano leading-none text-primary">
              <span
                className={cn("h-1 w-1 shrink-0 rounded-full bg-accent", ambient && "animate-pulse-slow")}
                style={ambient ? { animationDelay: `${i * 0.18}s` } : undefined}
                aria-hidden="true"
              />
              {stage}
            </span>
            {/* A drawn connector rather than an arrow glyph: at this size the
                glyph rendered as a smudge, and a hairline reads as the wire
                between two stages, which is what it is. */}
            {i < STAGES.length - 1 && (
              <span className="h-px w-1.5 shrink-0 bg-border-strong" aria-hidden="true" />
            )}
          </li>
        ))}
      </ul>

      {/* flow line: a highlight sweeps left to right, standing in for throughput */}
      <div className="relative mt-st-2 h-px w-full overflow-hidden bg-border" aria-hidden="true">
        {ambient && (
          <div className="absolute inset-y-0 -left-1/3 w-1/3 animate-flow bg-gradient-to-r from-transparent via-accent to-transparent" />
        )}
      </div>
    </div>
  );
}
