import { useMemo } from "react";
import { skillGroups } from "../data/skills";
import { useInViewOnce } from "../hooks/useInViewOnce";
import { useMotion } from "../hooks/useMotionTier";

/**
 * A band of the stack, drifting left the way the diagrams drift.
 *
 * It earns its place by being the page's only continuous horizontal movement,
 * which makes the seam between the hero's pipeline and the sections below it
 * read as the same system still running rather than two separate pages. The
 * professional stack is marked with a lit dot; project-only tools sit dim, the
 * same distinction the skills section makes with its tag borders.
 *
 * Motion is paused when the band is off screen and dropped entirely below the
 * full motion tier, where the list simply sits still and stays readable.
 */
export function SignalTicker() {
  const { ambient } = useMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ amount: 0.1, repeat: true });
  const running = ambient && inView;

  const items = useMemo(
    () =>
      skillGroups.flatMap((group) =>
        group.skills.map((skill) => ({
          name: skill.name,
          key: `${group.title}-${skill.name}`,
          pro: skill.badge === "professional",
        })),
      ),
    [],
  );

  const row = (copy: number) => (
    <div className="marquee-track items-center">
      {items.map((item) => (
        <span key={`${copy}-${item.key}`} className="inline-flex items-center gap-st-2 px-st-3">
          <span
            className={`h-1 w-1 shrink-0 rounded-full ${item.pro ? "bg-accent" : "bg-border-strong"}`}
            aria-hidden="true"
          />
          <span
            className={`whitespace-nowrap font-mono text-micro ${item.pro ? "text-primary" : "text-secondary"}`}
          >
            {item.name}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    // Hidden from assistive tech on purpose: every name here is already listed,
    // grouped and labelled in the skills section. Reading the band would mean
    // hearing the whole stack twice, once with no structure at all.
    <div ref={ref} className="relative border-y border-border bg-surface/30 py-st-2" aria-hidden="true">
      <div className="edge-fade-x overflow-hidden">
        <div className={`flex w-max ${running ? "animate-marquee" : ""}`}>
          {row(0)}
          {row(1)}
        </div>
      </div>
    </div>
  );
}
