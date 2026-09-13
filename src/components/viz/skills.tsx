import { TONE } from "./primitives";

/**
 * A small diagram per skill group, in place of an icon.
 *
 * Deliberately wordless: the tag list underneath already names the
 * technologies, so a second set of labels here would just be noise at 10px.
 * Each strip states the *shape* of the work instead: components feeding a
 * view, requests entering a service, a partitioned log fanning out to clients.
 *
 * Drawn at 300 × 56 and stretched to the card width. Continuous motion is
 * gated by the caller on viewport and motion tier.
 */

interface Props {
  animate: boolean;
}

function Strip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 300 56" className="block h-auto w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

/** Components composing into a rendered view. */
function FrontendStrip({ animate }: Props) {
  return (
    <Strip label="Diagram: independent components composing into a rendered interface.">
      {[6, 24, 42].map((y, i) => (
        <rect
          key={y}
          x={8}
          y={y}
          width={14}
          height={12}
          rx={3}
          fill={TONE.cyan.fill}
          stroke={TONE.cyan.dot}
          strokeOpacity={0.55}
          strokeWidth="1"
        >
          {animate && (
            <animate
              attributeName="opacity"
              values="0.35;1;0.35"
              dur="2.8s"
              begin={`${i * 0.35}s`}
              repeatCount="indefinite"
            />
          )}
        </rect>
      ))}

      {[12, 30, 48].map((y) => (
        <path
          key={y}
          d={`M24 ${y} C46 ${y} 52 28 74 28`}
          fill="none"
          stroke={TONE.cyan.dot}
          strokeOpacity={0.28}
          strokeWidth="1"
          strokeDasharray="3 5"
          className={animate ? "animate-dash-flow" : undefined}
        />
      ))}

      {/* rendered view */}
      <rect x={78} y={6} width={214} height={44} rx={5} fill="rgba(255,255,255,0.028)" stroke={TONE.cyan.stroke} strokeWidth="1" />
      <line x1={78} y1={17} x2={292} y2={17} stroke={TONE.cyan.dot} strokeOpacity={0.22} strokeWidth="1" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={86 + i * 7} cy={11.5} r={1.6} fill={TONE.cyan.dot} opacity={0.45} />
      ))}
      <rect x={88} y={26} width={72} height={16} rx={3} fill={TONE.cyan.dot} opacity={0.16} />
      <rect x={168} y={26} width={50} height={16} rx={3} fill={TONE.cyan.dot} opacity={0.11} />
      <rect x={226} y={26} width={56} height={16} rx={3} fill={TONE.cyan.dot} opacity={0.11} />
    </Strip>
  );
}

/** Concurrent requests entering a layered service. */
function BackendStrip({ animate }: Props) {
  const path = "M8 28 H104";
  return (
    <Strip label="Diagram: concurrent requests entering a layered backend service and returning responses.">
      {[16, 28, 40].map((y, i) => (
        <rect key={y} x={8} y={y - 1.5} width={44} height={3} rx={1.5} fill={TONE.blue.dot} opacity={0.3 + i * 0.15} />
      ))}
      <path
        d="M54 16 C78 16 80 28 104 28 M54 28 H104 M54 40 C78 40 80 28 104 28"
        fill="none"
        stroke={TONE.blue.dot}
        strokeOpacity={0.3}
        strokeWidth="1"
        strokeDasharray="3 5"
        className={animate ? "animate-dash-flow" : undefined}
      />

      {/* layered service */}
      {[8, 18, 28].map((offset, i) => (
        <rect
          key={offset}
          x={110 + i * 4}
          y={offset}
          width={104}
          height={14}
          rx={4}
          fill={TONE.blue.fill}
          stroke={TONE.blue.dot}
          strokeOpacity={0.5}
          strokeWidth="1"
        />
      ))}

      <path
        d="M222 28 H292"
        fill="none"
        stroke={TONE.cyan.dot}
        strokeOpacity={0.35}
        strokeWidth="1"
        strokeDasharray="3 5"
        className={animate ? "animate-dash-flow" : undefined}
      />
      <circle cx={292} cy={28} r={3} fill={TONE.cyan.dot} opacity={0.7} />

      {animate && (
        <circle r={2.4} fill={TONE.blue.dot}>
          <animateMotion dur="2.2s" repeatCount="indefinite" path={path} />
        </circle>
      )}
    </Strip>
  );
}

/** Several stores holding related data, queried together. */
function DatabasesStrip({ animate }: Props) {
  const stores = [40, 150, 260];
  return (
    <Strip label="Diagram: three connected data stores holding related records behind one query layer.">
      <path
        d="M40 20 H260"
        fill="none"
        stroke={TONE.slate.dot}
        strokeOpacity={0.22}
        strokeWidth="1"
        strokeDasharray="3 5"
        className={animate ? "animate-dash-flow" : undefined}
      />
      {stores.map((x, i) => (
        <g key={x}>
          <path
            d={`M${x - 22} 26 v14 a22 5 0 0 0 44 0 v-14`}
            fill="rgba(255,255,255,0.03)"
            stroke={TONE.slate.stroke}
            strokeWidth="1"
          />
          <ellipse cx={x} cy={26} rx={22} ry={5} fill="rgba(255,255,255,0.055)" stroke={TONE.slate.stroke} strokeWidth="1" />
          <ellipse cx={x} cy={20} rx={22} ry={5} fill="rgba(255,255,255,0.04)" stroke={TONE.slate.stroke} strokeWidth="1" />
          <circle cx={x} cy={20} r={2} fill={TONE.cyan.dot} opacity={0.6}>
            {animate && (
              <animate
                attributeName="opacity"
                values="0.15;0.85;0.15"
                dur="3s"
                begin={`${i * 0.5}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>
      ))}
    </Strip>
  );
}

/** A partitioned log fanning out to live subscribers. */
function StreamingStrip({ animate }: Props) {
  const lanes = [16, 28, 40];
  return (
    <Strip label="Diagram: events written to a partitioned log and fanned out over live connections to subscribed clients.">
      <rect x={6} y={8} width={196} height={40} rx={6} fill="rgba(139,92,246,0.05)" stroke={TONE.violet.stroke} strokeWidth="1" />
      {lanes.map((y, i) => (
        <g key={y}>
          <line x1={14} y1={y} x2={194} y2={y} stroke={TONE.violet.dot} strokeOpacity={0.18} strokeWidth="1" />
          {Array.from({ length: 9 }, (_, k) => (
            <rect
              key={k}
              x={16 + k * 20}
              y={y - 2}
              width={11}
              height={4}
              rx={1.5}
              fill={TONE.violet.dot}
              opacity={(k + i) % 3 === 0 ? 0.55 : 0.2}
            />
          ))}
        </g>
      ))}

      {/* live fan-out */}
      {[12, 28, 44].map((y) => (
        <path
          key={y}
          d={`M202 28 C226 28 236 ${y} 268 ${y}`}
          fill="none"
          stroke={TONE.cyan.dot}
          strokeOpacity={0.35}
          strokeWidth="1"
          strokeDasharray="3 5"
          className={animate ? "animate-dash-flow" : undefined}
        />
      ))}
      {[12, 28, 44].map((y, i) => (
        <rect key={y} x={272} y={y - 5} width={20} height={10} rx={3} fill={TONE.cyan.fill} stroke={TONE.cyan.dot} strokeOpacity={0.55} strokeWidth="1">
          {animate && (
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          )}
        </rect>
      ))}

      {animate && (
        <>
          <circle r={2.4} fill={TONE.violet.dot}>
            <animateMotion dur="2.6s" repeatCount="indefinite" path="M14 28 H194" />
          </circle>
          <circle r={2.2} fill={TONE.cyan.dot}>
            <animateMotion dur="1.8s" begin="0.9s" repeatCount="indefinite" path="M202 28 C226 28 236 44 268 44" />
          </circle>
        </>
      )}
    </Strip>
  );
}

/** Containerised services running side by side. */
function DevOpsStrip({ animate }: Props) {
  const cells = Array.from({ length: 8 }, (_, i) => ({
    x: 8 + (i % 4) * 74,
    y: i < 4 ? 6 : 32,
    i,
  }));

  return (
    <Strip label="Diagram: containerised services running side by side and linked into one composed environment.">
      <path
        d="M45 19 H267 M45 45 H267 M45 19 V45 M119 19 V45 M193 19 V45 M267 19 V45"
        fill="none"
        stroke={TONE.slate.dot}
        strokeOpacity={0.12}
        strokeWidth="1"
      />
      {cells.map(({ x, y, i }) => {
        const lit = i === 1 || i === 6;
        const tone = lit ? TONE.cyan : TONE.slate;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={66}
              height={18}
              rx={4}
              fill={lit ? tone.fill : "rgba(255,255,255,0.025)"}
              stroke={tone.stroke}
              strokeWidth="1"
            />
            {[0, 1, 2].map((k) => (
              <rect key={k} x={x + 8 + k * 9} y={y + 7} width={5} height={4} rx={1} fill={tone.dot} opacity={0.45} />
            ))}
            <circle cx={x + 58} cy={y + 9} r={2} fill={tone.dot} opacity={lit ? 0.9 : 0.35}>
              {animate && lit && (
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              )}
            </circle>
          </g>
        );
      })}
    </Strip>
  );
}

/** A document reduced to a shorter structured result by a model call. */
function AIStrip({ animate }: Props) {
  return (
    <Strip label="Diagram: a document passed through a model call and returned as a shorter structured summary.">
      <rect x={8} y={8} width={44} height={40} rx={4} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={14} y={15 + i * 7} width={i === 4 ? 18 : 32} height={2} rx={1} fill="#8A8A93" opacity={0.5} />
      ))}

      <path
        d="M52 28 H108"
        fill="none"
        stroke={TONE.violet.dot}
        strokeOpacity={0.3}
        strokeWidth="1"
        strokeDasharray="3 5"
        className={animate ? "animate-dash-flow" : undefined}
      />

      {/* model call */}
      <path
        d="M140 10 L170 28 L140 46 L110 28 Z"
        fill={TONE.violet.fill}
        stroke={TONE.violet.dot}
        strokeOpacity={0.6}
        strokeWidth="1"
      />
      <circle cx={140} cy={28} r={3.2} fill={TONE.violet.dot} className={animate ? "animate-breathe" : undefined} style={{ transformOrigin: "center" }} />

      <path
        d="M170 28 H210"
        fill="none"
        stroke={TONE.cyan.dot}
        strokeOpacity={0.35}
        strokeWidth="1"
        strokeDasharray="3 5"
        className={animate ? "animate-dash-flow" : undefined}
      />

      <rect x={212} y={12} width={80} height={32} rx={4} fill={TONE.cyan.fill} stroke={TONE.cyan.stroke} strokeWidth="1" />
      {Array.from({ length: 2 }, (_, i) => (
        <rect key={i} x={220} y={22 + i * 10} width={i === 1 ? 34 : 62} height={2.5} rx={1.25} fill={TONE.cyan.dot} opacity={0.6} />
      ))}

      {animate && (
        <circle r={2.4} fill={TONE.violet.dot}>
          <animateMotion dur="2.4s" repeatCount="indefinite" path="M52 28 H110" />
        </circle>
      )}
    </Strip>
  );
}

/** Skill group title → diagram. Groups without one render no strip. */
export const SKILL_STRIPS: Record<string, (props: Props) => React.ReactElement> = {
  Frontend: FrontendStrip,
  Backend: BackendStrip,
  Databases: DatabasesStrip,
  "Streaming / Distributed Systems": StreamingStrip,
  "DevOps / Tooling": DevOpsStrip,
  "AI / Other": AIStrip,
};
