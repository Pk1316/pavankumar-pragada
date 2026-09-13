import { TONE, VizBoundary, VizCaption, VizEdge, VizFrame, VizNode, VizPulse, VizStore } from "./primitives";

/**
 * One architecture visual per project, drawn in the shared kit's language.
 *
 * Each one diagrams that project's actual data path: the nodes and edges match
 * the architecture described in `src/data/projects.ts`, so the picture is
 * documentation rather than decoration. `animate` is passed down from the card,
 * which turns it on only while the visual is on screen and the visitor's
 * motion tier allows continuous loops.
 */

interface VisualProps {
  animate: boolean;
}

/* ── PacketBridge ─────────────────────────────────────────────────────────
   Packets in on the top band, the Kafka log as the spine across the middle,
   and the two consumer paths, persistence and live delivery, below it.   */
export function PacketBridgeVisual({ animate }: VisualProps) {
  const lanes = [108, 118, 128];

  return (
    <VizFrame label="PacketBridge architecture: packet source and decoder publish structured telemetry onto a Kafka event log, which is consumed by a processing service writing to PostgreSQL and by a WebSocket layer pushing live updates to a React dashboard.">
      <VizCaption x={18} y={22} text="INGEST" tone="cyan" />
      <VizCaption x={44} y={92} text="EVENT LOG" tone="violet" />
      <VizCaption x={140} y={153} text="CONSUMERS" />
      <VizCaption x={356} y={92} text="DELIVERY" tone="cyan" />

      {/* the log itself: three partition lanes with segment ticks */}
      <rect
        x={40}
        y={98}
        width={300}
        height={40}
        rx={8}
        fill="rgba(139,92,246,0.05)"
        stroke={TONE.violet.stroke}
        strokeWidth="1"
      />
      {lanes.map((y, i) => (
        <g key={y}>
          <line x1={52} y1={y} x2={328} y2={y} stroke={TONE.violet.dot} strokeOpacity={0.22} strokeWidth="1" />
          {Array.from({ length: 12 }, (_, k) => (
            <rect
              key={k}
              x={54 + k * 23}
              y={y - 2.5}
              width={13}
              height={5}
              rx={1.5}
              fill={TONE.violet.dot}
              opacity={((k + i) % 3 === 0 ? 0.5 : 0.2) as number}
            />
          ))}
        </g>
      ))}

      <VizEdge d="M104 50 H126" tone="cyan" flowing={animate} />
      <VizEdge d="M171 70 V98" tone="cyan" flowing={animate} />
      <VizEdge d="M124 138 V160" tone="blue" flowing={animate} />
      <VizEdge d="M210 180 H232" tone="slate" />
      <VizEdge d="M340 118 H356" tone="cyan" flowing={animate} />
      <VizEdge d="M408 136 V160" tone="cyan" flowing={animate} />

      <VizNode x={18} y={32} w={86} h={36} label="Packets" tone="cyan" live={animate} />
      <VizNode x={126} y={30} w={90} label="Decoder" sub="async pool" tone="cyan" />
      <VizNode x={110} y={160} w={100} label="Processing" sub="asyncio" tone="blue" />
      <VizStore x={236} y={156} w={52} label="PostgreSQL" />
      <VizNode x={356} y={100} w={104} h={36} label="WebSocket" tone="cyan" live={animate} />
      <VizNode x={356} y={160} w={104} label="Dashboard" sub="React" tone="cyan" />

      {animate && (
        <>
          <VizPulse d="M171 70 V98" dur={1.6} />
          <VizPulse d="M52 118 H328" dur={3.4} tone="violet" />
          <VizPulse d="M52 118 H328" dur={3.4} delay={1.7} tone="violet" />
          <VizPulse d="M340 118 H356" dur={1.4} />
          <VizPulse d="M408 136 V160" dur={1.4} delay={1.4} />
          <VizPulse d="M124 138 V160" dur={1.8} delay={0.6} tone="blue" />
        </>
      )}
    </VizFrame>
  );
}

/* ── Defence Surveillance & Threat Monitoring ─────────────────────────────
   A radar plate feeding a role-aware API, which fans out to an SSE alert
   stream and the monitoring dashboard. Abstract by design: rings, bearings
   and blips, no map and no ordnance.                                        */
export function SurveillanceVisual({ animate }: VisualProps) {
  const cx = 86;
  const cy = 120;
  const blips: { r: number; deg: number; tone: "cyan" | "amber" }[] = [
    { r: 30, deg: 212, tone: "cyan" },
    { r: 52, deg: 318, tone: "cyan" },
    { r: 44, deg: 68, tone: "amber" },
  ];

  return (
    <VizFrame label="Defence surveillance architecture: a monitoring feed is processed by a role-based FastAPI service with JWT authentication, persisted to MySQL, and pushed to a React monitoring dashboard through a Server-Sent Events alert stream.">
      <VizCaption x={18} y={26} text="MONITORING FEED" tone="cyan" />

      {/* radar plate */}
      <circle cx={cx} cy={cy} r={68} fill="rgba(34,211,238,0.035)" stroke={TONE.cyan.stroke} strokeWidth="1" />
      {[24, 46, 68].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={TONE.cyan.dot} strokeOpacity={0.16} strokeWidth="1" />
      ))}
      <line x1={cx - 68} y1={cy} x2={cx + 68} y2={cy} stroke={TONE.cyan.dot} strokeOpacity={0.12} strokeWidth="1" />
      <line x1={cx} y1={cy - 68} x2={cx} y2={cy + 68} stroke={TONE.cyan.dot} strokeOpacity={0.12} strokeWidth="1" />

      {animate && (
        <g className="animate-radar-sweep" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <path
            d={`M${cx} ${cy} L${cx + 68} ${cy} A68 68 0 0 0 ${cx + 68 * Math.cos(-0.6)} ${cy + 68 * Math.sin(-0.6)} Z`}
            fill={TONE.cyan.dot}
            opacity={0.14}
          />
          <line x1={cx} y1={cy} x2={cx + 68} y2={cy} stroke={TONE.cyan.dot} strokeOpacity={0.5} strokeWidth="1.2" />
        </g>
      )}

      {blips.map(({ r, deg, tone }) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <circle
            key={`${r}-${deg}`}
            cx={cx + r * Math.cos(rad)}
            cy={cy + r * Math.sin(rad)}
            r={tone === "amber" ? 3.4 : 2.4}
            fill={TONE[tone].dot}
            className={animate ? "animate-breathe" : undefined}
            opacity={animate ? undefined : 0.8}
            style={animate ? { transformOrigin: "center", animationDelay: `${deg / 240}s` } : undefined}
          />
        );
      })}

      <VizEdge d="M156 120 H196" tone="cyan" flowing={animate} />
      <VizEdge d="M300 112 H318 V64 H340" tone="amber" flowing={animate} />
      <VizEdge d="M300 128 H318 V176 H340" tone="cyan" flowing={animate} />
      <VizEdge d="M399 84 V156" tone="amber" />
      <VizEdge d="M240 140 V166" tone="slate" />

      <VizNode x={196} y={100} w={104} label="FastAPI" sub="JWT · 4 roles" tone="blue" live={animate} />
      <VizStore x={210} y={166} w={54} label="MySQL" />
      <VizNode x={340} y={44} w={118} label="SSE stream" sub="live alerts" tone="amber" live={animate} />
      <VizNode x={340} y={156} w={118} label="Dashboard" sub="React · Redux" tone="cyan" />

      {animate && (
        <>
          <VizPulse d="M156 120 H196" dur={1.8} />
          <VizPulse d="M300 112 H318 V64 H340" dur={2.4} tone="amber" />
          <VizPulse d="M399 84 V156" dur={1.6} delay={2.4} tone="amber" r={2.2} />
          <VizPulse d="M300 128 H318 V176 H340" dur={2.6} delay={0.8} />
        </>
      )}
    </VizFrame>
  );
}

/* ── Slot Swapper ─────────────────────────────────────────────────────────
   Two people holding slots on a shared grid, the swap arc between the two
   contested cells, and the workflow that has to approve and record it.     */
export function SlotSwapperVisual({ animate }: VisualProps) {
  const gridX = 126;
  const gridY = 62;
  const cellW = 28;
  const cellH = 30;
  const gap = 3;

  const held = { col: 1, row: 0 };
  const wanted = { col: 3, row: 2 };
  const centre = (c: number, r: number) => ({
    x: gridX + c * (cellW + gap) + cellW / 2,
    y: gridY + r * (cellH + gap) + cellH / 2,
  });
  const a = centre(held.col, held.row);
  const b = centre(wanted.col, wanted.row);
  const swapPath = `M${a.x} ${a.y} C${a.x + 46} ${a.y + 8} ${b.x + 14} ${b.y - 46} ${b.x} ${b.y}`;

  return (
    <VizFrame label="Slot Swapper architecture: two users hold slots on a shared schedule grid; a swap request between two cells passes through conflict detection and approval, and every transition is written to an audit log.">
      <VizCaption x={18} y={40} text="USERS" />
      <VizCaption x={126} y={52} text="SLOT GRID" tone="cyan" />
      <VizCaption x={310} y={44} text="SWAP WORKFLOW" tone="blue" />

      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 5 }, (_, c) => {
          const isHeld = c === held.col && r === held.row;
          const isWanted = c === wanted.col && r === wanted.row;
          const tone = isHeld ? "cyan" : isWanted ? "violet" : null;
          return (
            <rect
              key={`${r}-${c}`}
              x={gridX + c * (cellW + gap)}
              y={gridY + r * (cellH + gap)}
              width={cellW}
              height={cellH}
              rx={4}
              fill={tone ? TONE[tone].fill : "rgba(255,255,255,0.022)"}
              stroke={tone ? TONE[tone].dot : "rgba(255,255,255,0.07)"}
              strokeWidth={tone ? 1.3 : 1}
            />
          );
        }),
      )}

      {/* the contested swap */}
      <path
        d={swapPath}
        fill="none"
        stroke={TONE.violet.dot}
        strokeOpacity={0.7}
        strokeWidth="1.4"
        strokeDasharray="4 6"
        className={animate ? "animate-dash-flow" : undefined}
      />

      <VizEdge d="M102 66 H126 V76" tone="cyan" />
      <VizEdge d="M102 166 H112 V143 H126" tone="violet" />
      <VizEdge d="M284 110 H310 V72" tone="blue" flowing={animate} />
      <VizEdge d="M372 92 V120" tone="blue" />
      <VizEdge d="M372 156 V180" tone="slate" />

      <VizNode x={18} y={50} w={84} h={32} label="User A" tone="cyan" />
      <VizNode x={18} y={150} w={84} h={32} label="User B" tone="violet" />
      <VizNode x={310} y={52} w={124} h={40} label="Swap request" sub="conflict check" tone="blue" live={animate} />
      <VizNode x={310} y={120} w={124} h={36} label="Approval" tone="cyan" />
      <VizNode x={310} y={180} w={124} h={36} label="Audit log" tone="slate" />

      {animate && (
        <>
          <VizPulse d={swapPath} dur={2.8} tone="violet" r={2.4} />
          <VizPulse d="M284 110 H310 V72" dur={2} tone="blue" />
          <VizPulse d="M372 92 V120" dur={1.5} delay={1} tone="cyan" r={2.2} />
          <VizPulse d="M372 156 V180" dur={1.5} delay={2.5} tone="cyan" r={2.2} />
        </>
      )}
    </VizFrame>
  );
}

/* ── E-Commerce Backend ───────────────────────────────────────────────────
   The token exchange first, then the router, then the three resource groups
   that share one product/category schema. Backend shapes only, no storefront. */
export function EcommerceVisual({ animate }: VisualProps) {
  return (
    <VizFrame label="E-commerce backend architecture: a client exchanges credentials for access and refresh tokens, then reaches a versioned API router that serves product, cart and seller resources backed by a shared database.">
      <VizCaption x={8} y={86} text="CLIENT" />
      <VizCaption x={90} y={86} text="TOKEN EXCHANGE" tone="blue" />

      <VizBoundary x={318} y={32} w={144} h={134} label="RESOURCES" tone="cyan" />

      <VizEdge d="M78 117 H90" tone="blue" flowing={animate} />
      <VizEdge d="M206 118 H218" tone="blue" flowing={animate} />
      <VizEdge d="M304 118 H316 V63 H330" tone="cyan" flowing={animate} />
      <VizEdge d="M304 118 H330" tone="cyan" flowing={animate} />
      <VizEdge d="M304 118 H316 V141 H330" tone="cyan" flowing={animate} />
      <VizEdge d="M390 166 V176" tone="slate" />

      <VizNode x={8} y={100} w={70} h={34} label="Client" tone="slate" />
      <VizNode x={90} y={98} w={116} label="Auth" sub="access + refresh" tone="blue" live={animate} />
      <VizNode x={218} y={98} w={86} label="Router" sub="/api" tone="blue" />
      <VizNode x={330} y={48} w={120} h={30} label="Products" tone="cyan" />
      <VizNode x={330} y={88} w={120} h={30} label="Cart" tone="cyan" />
      <VizNode x={330} y={128} w={120} h={30} label="Seller" tone="cyan" />
      <VizStore x={360} y={176} w={60} label="Database" />

      {animate && (
        <>
          <VizPulse d="M78 117 H90" dur={1.3} tone="blue" />
          <VizPulse d="M206 118 H218" dur={1.3} delay={1.3} tone="blue" />
          <VizPulse d="M304 118 H316 V63 H330" dur={2.2} delay={0.7} />
          <VizPulse d="M304 118 H330" dur={2.2} delay={1.2} />
          <VizPulse d="M304 118 H316 V141 H330" dur={2.2} delay={1.7} />
        </>
      )}
    </VizFrame>
  );
}

/* ── Document Summarization API ───────────────────────────────────────────
   Many input encodings collapse into one endpoint, the model call sits off
   the main path, and the output is visibly shorter than the input.          */
export function DocSummarizerVisual({ animate }: VisualProps) {
  const pages = [
    { x: 36, y: 84 },
    { x: 30, y: 78 },
    { x: 24, y: 72 },
  ];

  return (
    <VizFrame label="Document summarization API architecture: documents arriving as multipart uploads or base64 payloads pass through MIME detection into a Go summarize endpoint, which calls the Gemini model and returns a condensed summary.">
      <VizCaption x={24} y={54} text="DOCUMENT" />
      <VizCaption x={116} y={86} text="MULTIPART · BASE64" />
      <VizCaption x={350} y={62} text="SUMMARY" tone="cyan" />

      {/* stacked input pages: the front one carries full-length text lines */}
      {pages.map(({ x, y }, i) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={64}
          height={86}
          rx={5}
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          opacity={0.5 + i * 0.25}
        />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <rect
          key={i}
          x={32}
          y={82 + i * 10}
          width={i === 6 ? 28 : 48}
          height={2.5}
          rx={1.25}
          fill="#8A8A93"
          opacity={0.5}
        />
      ))}

      {/* output: fewer, shorter lines than the input */}
      <rect
        x={350}
        y={72}
        width={112}
        height={96}
        rx={7}
        fill={TONE.cyan.fill}
        stroke={TONE.cyan.stroke}
        strokeWidth="1"
      />
      {Array.from({ length: 3 }, (_, i) => (
        <rect
          key={i}
          x={362}
          y={92 + i * 18}
          width={i === 2 ? 44 : 82}
          height={3}
          rx={1.5}
          fill={TONE.cyan.dot}
          opacity={0.65}
        >
          {animate && (
            <animate
              attributeName="opacity"
              values="0.15;0.75;0.15"
              dur="3.2s"
              begin={`${i * 0.4}s`}
              repeatCount="indefinite"
            />
          )}
        </rect>
      ))}

      <VizEdge d="M100 118 H116" tone="slate" flowing={animate} />
      <VizEdge d="M192 118 H196" tone="blue" flowing={animate} />
      <VizEdge d="M266 138 V170" tone="violet" flowing={animate} />
      <VizEdge d="M336 188 H343 V122 H350" tone="cyan" flowing={animate} />
      <VizEdge d="M336 118 H350" tone="cyan" />

      <VizNode x={116} y={100} w={76} h={36} label="MIME" sub="detect" tone="slate" />
      <VizNode x={196} y={98} w={140} label="POST /summarize" sub="Go" tone="blue" live={animate} />
      <VizNode x={196} y={170} w={140} h={36} label="Gemini 1.5 Flash" tone="violet" live={animate} />

      {animate && (
        <>
          <VizPulse d="M100 118 H116" dur={1.5} tone="slate" r={2.2} />
          <VizPulse d="M192 118 H196" dur={1.5} delay={1.5} tone="blue" r={2.2} />
          <VizPulse d="M266 138 V170" dur={1.6} delay={1} tone="violet" />
          <VizPulse d="M336 188 H343 V122 H350" dur={2} delay={1.8} />
        </>
      )}
    </VizFrame>
  );
}

/** Slug → visual. Projects without an entry fall back to no visual. */
export const PROJECT_VISUALS: Record<string, (props: VisualProps) => React.ReactElement> = {
  packetbridge: PacketBridgeVisual,
  "surveillance-monitoring": SurveillanceVisual,
  "slot-swapper": SlotSwapperVisual,
  "ecommerce-backend": EcommerceVisual,
  "doc-summarizer-api": DocSummarizerVisual,
};
