import { ArrowUpRight } from "lucide-react";
import type { CodingProfile } from "../data/codingProfiles";
import { parseStat, useCountUp } from "../hooks/useCountUp";
import { useInViewOnce } from "../hooks/useInViewOnce";
import { useMotion } from "../hooks/useMotionTier";
import { cn } from "../utils/cn";
import { Reveal } from "./Reveal";

interface Props {
  profile: CodingProfile;
  index: number;
}

/**
 * One statistic. The leading number counts up; everything else in the string,
 * such as rank qualifiers, star ratings or "provisional", is printed exactly as
 * authored. Stats with no leading number (and every stat under reduced motion)
 * render as static text, because the value is information and must be readable
 * whether or not it animated.
 */
function Stat({ label, value, active }: { label: string; value: string; active: boolean }) {
  const parsed = parseStat(value);
  const count = useCountUp(parsed?.value ?? 0, active && parsed !== null);

  const rendered = parsed
    ? `${parsed.prefix}${parsed.grouped ? count.toLocaleString("en-US") : count}${parsed.suffix}`
    : value;

  // A qualified value ("1679 (3★, Div 2, provisional)") wraps to three lines in
  // half a card and drags the whole row taller, so it takes the full width.
  const wide = value.length > 18;

  return (
    <div className={cn("panel px-st-2 py-st-1", wide && "col-span-2")}>
      <dt className="text-nano text-secondary">{label}</dt>
      <dd className="tabular mt-0.5 font-mono text-meta text-primary">{rendered}</dd>
    </div>
  );
}

export function CodingProfileCard({ profile, index }: Props) {
  const { transitions } = useMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ amount: 0.35 });

  return (
    <Reveal index={index} className="h-full">
      <div
        ref={ref}
        className="card-glow group flex h-full flex-col rounded-2xl border border-border bg-surface p-st-4 transition-transform duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:bg-surface-hover motion-reduce:hover:translate-y-0"
      >
        <div className="flex items-baseline justify-between gap-st-1">
          <h3 className="text-h3 text-primary">{profile.name}</h3>
          <span className="font-mono text-nano text-secondary">{profile.username}</span>
        </div>

        <p className="mt-st-1 text-meta text-secondary">{profile.description}</p>

        {profile.stats.length > 0 && (
          <dl className="mt-st-3 grid grid-cols-2 gap-st-1">
            {profile.stats.map((stat) => (
              <Stat
                key={stat.label}
                label={stat.label}
                value={stat.value}
                active={inView && transitions}
              />
            ))}
          </dl>
        )}

        <a
          href={profile.url}
          target="_blank"
          rel="noreferrer noopener"
          className="link-underline mt-auto inline-flex items-center gap-1.5 self-start pt-st-3 text-meta font-medium text-accent"
        >
          {profile.buttonLabel.replace(/\s*→\s*$/, "")}
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </a>
      </div>
    </Reveal>
  );
}
