import { useMotion } from "../../hooks/useMotionTier";
import { TONE } from "./primitives";

/**
 * The pipeline the whole site is about, drawn at full-bleed scale behind the
 * hero copy: frontend, API, service, event log, processing,
 * storage, socket, dashboard.
 *
 * It has no labels. The `PipelineStrip` in the portrait names the stages
 * legibly; repeating those names underneath the headline would compete with it.
 * What this layer contributes is the *shape* of the system and the fact that
 * something is moving through it.
 *
 * Kept subordinate to the text three ways: overall opacity sits low, a radial
 * mask punches a hole exactly where the headline sits, and the travelling
 * packets only mount at the `full` motion tier.
 */

const STAGES = [
  { x: 70, y: 150 },
  { x: 250, y: 250 },
  { x: 430, y: 165 },
  { x: 610, y: 300 },
  { x: 790, y: 190 },
  { x: 960, y: 330 },
  { x: 1090, y: 215 },
  { x: 1210, y: 380 },
];

/** Smooth cubic spine through the stage positions. */
const SPINE = STAGES.reduce((d, p, i) => {
  if (i === 0) return `M${p.x} ${p.y}`;
  const prev = STAGES[i - 1];
  const mx = (prev.x + p.x) / 2;
  return `${d} C${mx} ${prev.y} ${mx} ${p.y} ${p.x} ${p.y}`;
}, "");

/** Fan-out stubs: real pipelines branch, a single line would read as a wire. */
const BRANCHES = [
  "M430 165 C500 165 520 90 600 88",
  "M610 300 C660 300 690 396 760 400",
  "M960 330 C1000 330 1020 452 1096 456",
  "M250 250 C300 250 316 356 392 360",
];

export function HeroBackdrop() {
  const { ambient, still } = useMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.55] [mask-image:radial-gradient(ellipse_58%_54%_at_36%_48%,transparent_12%,black_78%)]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1280 520"
        className="absolute left-1/2 top-1/2 h-[125%] w-[135%] -translate-x-1/2 -translate-y-1/2"
        preserveAspectRatio="xMidYMid slice"
      >
        {BRANCHES.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={TONE.violet.dot}
            strokeOpacity={0.16}
            strokeWidth="1"
            strokeDasharray="3 7"
          />
        ))}

        {/* the spine, drawn twice: a soft base and a dashed accent on top */}
        <path d={SPINE} fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d={SPINE}
          fill="none"
          stroke={TONE.cyan.dot}
          strokeOpacity={0.22}
          strokeWidth="1.2"
          strokeDasharray="5 9"
          className={ambient ? "animate-dash-flow" : undefined}
        />

        {STAGES.map(({ x, y }, i) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={16} fill="none" stroke={TONE.cyan.dot} strokeOpacity={0.1} strokeWidth="1" />
            <circle cx={x} cy={y} r={8} fill="none" stroke={TONE.cyan.dot} strokeOpacity={0.18} strokeWidth="1" />
            <circle
              cx={x}
              cy={y}
              r={2.6}
              fill={i % 3 === 1 ? TONE.violet.dot : TONE.cyan.dot}
              opacity={0.65}
              className={ambient ? "animate-pulse-slow" : undefined}
              style={ambient ? { animationDelay: `${i * 0.28}s` } : undefined}
            />
          </g>
        ))}

        {ambient && !still && (
          <>
            {[0, 3.6, 7.2].map((delay) => (
              <circle key={delay} r={3.2} fill={TONE.cyan.dot} opacity={0.85}>
                <animateMotion dur="10.8s" begin={`${delay}s`} repeatCount="indefinite" path={SPINE} />
              </circle>
            ))}
            {BRANCHES.slice(0, 2).map((d, i) => (
              <circle key={d} r={2.4} fill={TONE.violet.dot} opacity={0.7}>
                <animateMotion dur="4.4s" begin={`${1.2 + i * 1.6}s`} repeatCount="indefinite" path={d} />
              </circle>
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
