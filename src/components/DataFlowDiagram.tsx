import { useInViewOnce } from "../hooks/useInViewOnce";
import { useMotion } from "../hooks/useMotionTier";
import { VizEdge, VizFrame, VizNode, VizPulse } from "./viz/primitives";

/** Serpentine spine through every node centre, so one path drives everything. */
const SPINE = "M68 57 H396 Q410 57 410 71 V143 Q410 157 396 157 H68";

const STAGES = [
  { x: 16, y: 40, label: "React", tone: "cyan" },
  { x: 130, y: 40, label: "API", tone: "blue" },
  { x: 244, y: 40, label: "FastAPI", tone: "blue" },
  { x: 358, y: 40, label: "Kafka", tone: "violet" },
  { x: 358, y: 140, label: "Processing", tone: "blue" },
  { x: 244, y: 140, label: "PostgreSQL", tone: "slate" },
  { x: 130, y: 140, label: "WebSocket", tone: "cyan" },
  { x: 16, y: 140, label: "Dashboard", tone: "cyan" },
] as const;

/**
 * The end-to-end pipeline as a single loop: requests out along the top row,
 * processed data returning along the bottom row to the dashboard that asked for
 * it. Laid out so one continuous path runs through all eight node centres,
 * which is what the travelling packets follow.
 */
export function DataFlowDiagram() {
  const { ambient } = useMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ amount: 0.25, repeat: true });
  const animate = inView && ambient;

  return (
    <div ref={ref} className="diagram-well w-full">
      <VizFrame
        plate={false}
        label="Data flow, end to end: a React client calls the API and FastAPI services, which publish to Kafka; a processing stage writes to PostgreSQL and pushes results back over WebSockets to the dashboard."
      >
        <VizEdge d={SPINE} tone="cyan" flowing={animate} />

        {animate && (
          <>
            <VizPulse d={SPINE} dur={7} r={3} />
            <VizPulse d={SPINE} dur={7} delay={2.4} r={3} tone="violet" />
            <VizPulse d={SPINE} dur={7} delay={4.8} r={3} />
          </>
        )}

        {STAGES.map(({ x, y, label, tone }, i) => (
          <VizNode
            key={label}
            x={x}
            y={y}
            w={104}
            h={34}
            label={label}
            tone={tone}
            live={animate && (i === 0 || i === 3 || i === 6)}
          />
        ))}

      </VizFrame>
    </div>
  );
}
