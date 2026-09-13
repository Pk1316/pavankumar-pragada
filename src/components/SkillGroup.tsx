import type { SkillGroupData } from "../data/skills";
import { useInViewOnce } from "../hooks/useInViewOnce";
import { useMotion } from "../hooks/useMotionTier";
import { cn } from "../utils/cn";
import { Reveal } from "./Reveal";
import { SKILL_STRIPS } from "./viz/skills";

interface Props {
  group: SkillGroupData;
  index: number;
}

/**
 * A skill group led by a diagram of the shape of that work, with the tag list
 * underneath naming the specifics. The diagram animates only while on screen
 * at the full motion tier.
 */
export function SkillGroup({ group, index }: Props) {
  const { ambient } = useMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ amount: 0.2, repeat: true });
  const Strip = SKILL_STRIPS[group.title];

  return (
    <Reveal index={index} className="h-full">
      <div
        ref={ref}
        className="card-glow flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface hover:border-accent/30"
      >
        {Strip && (
          <div className="border-b border-border bg-bg/40 px-st-3 py-st-2">
            <Strip animate={inView && ambient} />
          </div>
        )}

        <div className="p-st-4">
          <h3 className="font-mono text-micro uppercase text-secondary">{group.title}</h3>
          <div className="mt-st-2 flex flex-wrap gap-st-1">
            {group.skills.map((skill) => (
              <span
                key={skill.name}
                className={cn(
                  "inline-flex items-center rounded-full border px-st-2 py-1 text-nano font-medium transition-colors duration-200",
                  skill.badge === "professional"
                    ? "border-accent/30 bg-accent/5 text-primary"
                    : "border-border bg-bg/60 text-secondary",
                )}
                title={
                  skill.badge === "professional"
                    ? "Used in professional experience"
                    : "Used in project experience"
                }
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
