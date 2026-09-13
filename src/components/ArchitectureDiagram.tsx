import { useState } from "react";
import { motion } from "framer-motion";
import { useMotion } from "../hooks/useMotionTier";
import { useInViewOnce } from "../hooks/useInViewOnce";
import { cn } from "../utils/cn";

export interface DiagramNode {
  id: string;
  label: string;
  caption?: string;
  detail: string;
}

interface ArchitectureDiagramProps {
  nodes: DiagramNode[];
  /**
   * `single`: one rail, used inside a case study.
   * `split`:  two rails side by side on `lg`, so an eight-stage pipeline stays
   *            compact instead of running 500px down the page.
   */
  layout?: "single" | "split";
  /** Column headings for `split`. */
  columnLabels?: [string, string];
}

/**
 * The end-to-end pipeline, as a rail of stages.
 *
 * Vertical on purpose: a wrapping horizontal row leaves arrows pointing at
 * nothing at the end of each line, and stage names are too long to survive
 * eight columns. A rail keeps the connector geometry honest at every width and
 * keeps the labels as real, selectable, screen-reader-visible text.
 *
 * Interaction (this is the point of the section): hovering or focusing a stage
 * lights that stage and its rail segment, shows what it is responsible for,
 * and drops every unrelated stage back so the active path reads first. Stages
 * light in sequence as the diagram scrolls in, and a packet runs the rail while
 * nothing is hovered.
 */
export function ArchitectureDiagram({ nodes, layout = "single", columnLabels }: ArchitectureDiagramProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { ambient, transitions } = useMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ amount: 0.2 });

  const active = nodes.find((n) => n.id === activeId) ?? null;
  const activeIndex = active ? nodes.findIndex((n) => n.id === active.id) : -1;

  const columns: DiagramNode[][] =
    layout === "split"
      ? [nodes.slice(0, Math.ceil(nodes.length / 2)), nodes.slice(Math.ceil(nodes.length / 2))]
      : [nodes];

  let offset = 0;

  return (
    <div ref={ref} className="w-full">
      <div className={cn("grid gap-st-4", layout === "split" && "lg:grid-cols-2 lg:gap-st-6")}>
        {columns.map((column, col) => {
          const start = offset;
          offset += column.length;

          return (
            <div key={col} className="relative">
              {columnLabels && (
                <p className="mb-st-3 font-mono text-micro uppercase text-secondary">{columnLabels[col]}</p>
              )}

              {/* the rail */}
              <div className="pointer-events-none absolute bottom-3 left-[7px] top-3 w-px" aria-hidden="true">
                <div className="h-full w-px bg-gradient-to-b from-accent/45 via-border to-border" />
                {ambient && !activeId && (
                  <div className="absolute inset-y-0 left-0 h-full w-px animate-rail-travel">
                    <span className="absolute -left-[2.5px] top-0 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(34,211,238,0.55)]" />
                  </div>
                )}
              </div>

              <ol className="space-y-st-1">
                {column.map((node, i) => {
                  const globalIndex = start + i;
                  const isActive = activeId === node.id;
                  // The segment leading into the active stage, and the one
                  // leading out of it, belong to the highlighted path.
                  const onActivePath =
                    activeIndex >= 0 && (globalIndex === activeIndex || globalIndex === activeIndex - 1);
                  const dimmed = activeIndex >= 0 && !isActive;

                  return (
                    <li
                      key={node.id}
                      className="relative pl-st-5"
                      style={
                        transitions
                          ? {
                              opacity: inView ? 1 : 0,
                              transform: inView ? "none" : "translateX(-6px)",
                              transition: `opacity 420ms cubic-bezier(0.22,0.61,0.36,1) ${globalIndex * 70}ms, transform 420ms cubic-bezier(0.22,0.61,0.36,1) ${globalIndex * 70}ms`,
                            }
                          : undefined
                      }
                    >
                      {/* rail node */}
                      <span
                        className={cn(
                          "absolute left-0 top-[13px] z-10 h-[15px] w-[15px] rounded-full border-2 border-bg transition-all duration-300 ease-out",
                          isActive
                            ? "scale-125 bg-accent shadow-[0_0_0_3px_rgba(34,211,238,0.2)]"
                            : dimmed
                              ? "bg-border-strong"
                              : "bg-accent/55",
                        )}
                        aria-hidden="true"
                      />

                      <button
                        type="button"
                        onMouseEnter={() => setActiveId(node.id)}
                        onFocus={() => setActiveId(node.id)}
                        onMouseLeave={() => setActiveId((cur) => (cur === node.id ? null : cur))}
                        onBlur={() => setActiveId((cur) => (cur === node.id ? null : cur))}
                        onClick={() => setActiveId((cur) => (cur === node.id ? null : node.id))}
                        aria-expanded={isActive}
                        aria-describedby={isActive ? "diagram-detail" : undefined}
                        className={cn(
                          "w-full rounded-xl border px-st-3 py-st-2 text-left transition-all duration-300 ease-out",
                          isActive
                            ? "border-accent/60 bg-surface-hover"
                            : onActivePath
                              ? "border-accent/25 bg-surface"
                              : dimmed
                                ? "border-border/60 bg-surface/40 opacity-45"
                                : "border-border bg-surface hover:border-accent/40 hover:bg-surface-hover",
                        )}
                      >
                        <span className="block font-mono text-meta font-medium text-primary">{node.label}</span>
                        {node.caption && (
                          <span className="mt-0.5 block font-mono text-nano text-secondary">{node.caption}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>

      {/* One detail line for the whole diagram, so the rails never reflow. */}
      <motion.div
        key={active?.id ?? "idle"}
        initial={transitions ? { opacity: 0, y: 4 } : undefined}
        animate={transitions ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.2 }}
        id="diagram-detail"
        role="status"
        className="mt-st-4 min-h-[72px] rounded-xl border border-border bg-bg/40 px-st-3 py-st-2 text-meta text-secondary sm:min-h-[64px]"
      >
        {active ? (
          // Stacked rather than run together on one line: the detail strings
          // reach three lines on a phone, and a stage name buried at the start
          // of that block is much harder to find than one on its own line.
          <>
            <span className="block font-mono text-nano uppercase tracking-[0.08em] text-accent">
              {active.label}
            </span>
            <span className="mt-0.5 block">{active.detail}</span>
          </>
        ) : (
          <span className="text-secondary/60">
            Hover, focus or tap a stage to see what it is responsible for.
          </span>
        )}
      </motion.div>
    </div>
  );
}
