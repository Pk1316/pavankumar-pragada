import { useId } from "react";
import { cn } from "../../utils/cn";

/**
 * Shared drawing kit for every diagram on the site.
 *
 * One coordinate space (480 × 240), one node shape, one edge weight and one
 * colour meaning, so the project visuals, skill diagrams and hero backdrop all
 * read as parts of the same system rather than five separate illustrations.
 *
 * Colour carries meaning, it is not decoration:
 *   cyan:   live data in motion (packets, telemetry, socket pushes)
 *   blue:   request/response and API surfaces
 *   violet: event streaming and the message layer
 *   slate:  storage and structure at rest
 *   amber:  an alert condition, used only where the domain has one
 */

export const VIZ_W = 480;
export const VIZ_H = 240;

export type Tone = "cyan" | "blue" | "violet" | "slate" | "amber";

export const TONE: Record<Tone, { stroke: string; fill: string; dot: string; text: string }> = {
  cyan: { stroke: "rgba(34,211,238,0.45)", fill: "rgba(34,211,238,0.07)", dot: "#22D3EE", text: "#E8FAFE" },
  blue: { stroke: "rgba(59,130,246,0.45)", fill: "rgba(59,130,246,0.07)", dot: "#3B82F6", text: "#E7F0FE" },
  violet: { stroke: "rgba(139,92,246,0.45)", fill: "rgba(139,92,246,0.07)", dot: "#8B5CF6", text: "#F0EAFE" },
  slate: { stroke: "rgba(161,161,170,0.28)", fill: "rgba(255,255,255,0.028)", dot: "#A1A1AA", text: "#D4D4D8" },
  amber: { stroke: "rgba(245,158,11,0.45)", fill: "rgba(245,158,11,0.07)", dot: "#F59E0B", text: "#FEF2DC" },
};

/** Ids must be unique per mounted SVG or defs collide across diagrams. */
export function useVizIds(names: readonly string[]): Record<string, string> {
  const base = useId().replace(/:/g, "");
  return Object.fromEntries(names.map((n) => [n, `${base}-${n}`]));
}

interface FrameProps {
  /** Accessible description of what the diagram shows. */
  label: string;
  children: React.ReactNode;
  className?: string;
  /** Draw the background plate and grid. Off for overlay use (hero backdrop). */
  plate?: boolean;
  viewBox?: string;
}

/** SVG wrapper: background plate, grid, edge vignette and the shared defs. */
export function VizFrame({ label, children, className, plate = true, viewBox }: FrameProps) {
  const id = useVizIds(["grid", "plate", "vignette"]);

  return (
    <svg
      viewBox={viewBox ?? `0 0 ${VIZ_W} ${VIZ_H}`}
      className={cn("block h-auto w-full", className)}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id={id.grid} width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0H0v30" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
        </pattern>

        <radialGradient id={id.plate} cx="50%" cy="42%" r="72%">
          <stop offset="0%" stopColor="#0E1219" />
          <stop offset="100%" stopColor="#080A0E" />
        </radialGradient>

        <radialGradient id={id.vignette} cx="50%" cy="45%" r="70%">
          <stop offset="64%" stopColor="rgba(8,10,14,0)" />
          <stop offset="100%" stopColor="rgba(8,10,14,0.55)" />
        </radialGradient>
      </defs>

      {plate && (
        <>
          <rect width={VIZ_W} height={VIZ_H} fill={`url(#${id.plate})`} />
          <rect width={VIZ_W} height={VIZ_H} fill={`url(#${id.grid})`} />
        </>
      )}

      {children}

      {plate && <rect width={VIZ_W} height={VIZ_H} fill={`url(#${id.vignette})`} pointerEvents="none" />}
    </svg>
  );
}

interface NodeProps {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  /** Second line, one or two words. */
  sub?: string;
  tone?: Tone;
  /** Raises the border and lights the status dot. */
  active?: boolean;
  /** Drops the whole node back so a highlighted path reads first. */
  dim?: boolean;
  /** Pulse the status dot. Callers gate this on viewport + motion tier. */
  live?: boolean;
}

/** The one node shape used everywhere: soft rect, status dot, mono label. */
export function VizNode({
  x,
  y,
  w = 100,
  h = 38,
  label,
  sub,
  tone = "slate",
  active = false,
  dim = false,
  live = false,
}: NodeProps) {
  const t = TONE[tone];
  const cx = x + w / 2;

  return (
    <g opacity={dim ? 0.32 : 1} style={{ transition: "opacity 260ms cubic-bezier(0.22,0.61,0.36,1)" }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={7}
        fill={active ? "#161D26" : "#10141B"}
        stroke={active ? t.dot : t.stroke}
        strokeWidth={active ? 1.4 : 1}
        style={{ transition: "stroke 220ms ease, fill 220ms ease" }}
      />
      <circle cx={x + 11} cy={y + h / 2} r={2.6} fill={t.dot} opacity={active ? 1 : 0.6}>
        {live && (
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.2s" repeatCount="indefinite" />
        )}
      </circle>
      <text
        x={cx + 6}
        y={sub ? y + h / 2 - 1 : y + h / 2 + 4}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        className="viz-label"
        fill={active ? t.text : "#D4D4D8"}
      >
        {label}
      </text>
      {sub && (
        <text
          x={cx + 6}
          y={y + h / 2 + 11}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          className="viz-sub"
          fill="#8A8A93"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

interface EdgeProps {
  d: string;
  tone?: Tone;
  /** Highlights the edge as part of the active path. */
  active?: boolean;
  dim?: boolean;
  /** Crawling dashes. Gate on viewport + motion tier. */
  flowing?: boolean;
}

/** Connector between nodes. Dashes crawl toward the target when `flowing`. */
export function VizEdge({ d, tone = "slate", active = false, dim = false, flowing = false }: EdgeProps) {
  const t = TONE[tone];

  return (
    <g opacity={dim ? 0.2 : 1} style={{ transition: "opacity 260ms cubic-bezier(0.22,0.61,0.36,1)" }}>
      <path d={d} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.25" strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke={t.dot}
        strokeOpacity={active ? 0.75 : 0.3}
        strokeWidth={active ? 1.6 : 1.1}
        strokeLinecap="round"
        strokeDasharray="4 8"
        className={flowing ? "animate-dash-flow" : undefined}
        style={{ transition: "stroke-opacity 220ms ease, stroke-width 220ms ease" }}
      />
    </g>
  );
}

interface PulseProps {
  /** Path the packet travels, in the same coordinate space. */
  d: string;
  tone?: Tone;
  dur?: number;
  delay?: number;
  r?: number;
}

/**
 * A single datum travelling an edge. Mount these only while the diagram is on
 * screen and the motion tier allows ambient loops. They are the only
 * continuously running part of a diagram.
 */
export function VizPulse({ d, tone = "cyan", dur = 3, delay = 0, r = 2.6 }: PulseProps) {
  const t = TONE[tone];

  return (
    <circle r={r} fill={t.dot}>
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={d} />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.12;0.88;1"
        dur={`${dur}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  );
}

/** Small mono caption for labelling a region of a diagram. */
export function VizCaption({
  x,
  y,
  text,
  anchor = "start",
  tone,
}: {
  x: number;
  y: number;
  text: string;
  anchor?: "start" | "middle" | "end";
  tone?: Tone;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily="JetBrains Mono, monospace"
      className="viz-caption"
      letterSpacing="0.09em"
      fill={tone ? TONE[tone].dot : "#71717A"}
      opacity={tone ? 0.85 : 1}
    >
      {text}
    </text>
  );
}

/** Dashed enclosure grouping nodes that belong to one service or boundary. */
export function VizBoundary({
  x,
  y,
  w,
  h,
  label,
  tone = "slate",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  tone?: Tone;
}) {
  const t = TONE[tone];
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill="rgba(255,255,255,0.012)"
        stroke={t.stroke}
        strokeOpacity={0.5}
        strokeWidth="1"
        strokeDasharray="3 5"
      />
      {label && <VizCaption x={x + 10} y={y + 14} text={label} tone={tone} />}
    </g>
  );
}

/** Stacked-cylinder datastore glyph. */
export function VizStore({
  x,
  y,
  w = 58,
  label,
  tone = "slate",
  active = false,
}: {
  x: number;
  y: number;
  w?: number;
  label: string;
  tone?: Tone;
  active?: boolean;
}) {
  const t = TONE[tone];
  const ry = 6;
  const body = 26;

  return (
    <g>
      <path
        d={`M${x} ${y + ry} v${body} a${w / 2} ${ry} 0 0 0 ${w} 0 v-${body}`}
        fill={active ? t.fill : "rgba(255,255,255,0.022)"}
        stroke={active ? t.dot : t.stroke}
        strokeWidth="1"
      />
      <ellipse
        cx={x + w / 2}
        cy={y + ry}
        rx={w / 2}
        ry={ry}
        fill="rgba(255,255,255,0.045)"
        stroke={active ? t.dot : t.stroke}
        strokeWidth="1"
      />
      <text
        x={x + w / 2}
        y={y + ry + body + 18}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        className="viz-store-label"
        fill="#A1A1AA"
      >
        {label}
      </text>
    </g>
  );
}
