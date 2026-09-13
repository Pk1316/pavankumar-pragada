import { useRef } from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import type { ExperienceEntry } from "../data/experience";
import { useMotion } from "../hooks/useMotionTier";
import { Reveal } from "./Reveal";
import { ScrollRail } from "./ScrollRail";

interface Props {
  entries: ExperienceEntry[];
}

export function ExperienceTimeline({ entries }: Props) {
  const ref = useRef<HTMLOListElement>(null);

  return (
    // The marker shrinks from 40px to 32px below `sm` to buy the card back 12px
    // of width on a phone, and `--rail-left` follows it so the rail stays
    // centred through the markers at both sizes.
    <div className="relative [--rail-left:15px] sm:[--rail-left:19px]">
      <ScrollRail targetRef={ref} left={19} />

      <ol ref={ref} className="space-y-st-4">
        {entries.map((entry, i) => (
          <Reveal
            as="li"
            key={`${entry.role}-${entry.dates}`}
            index={i}
            x={-10}
            y={0}
            className="relative pl-[2.75rem] sm:pl-st-6"
          >
            <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-accent/40 bg-surface text-accent sm:h-10 sm:w-10">
              <Briefcase size={14} strokeWidth={1.75} aria-hidden="true" className="sm:h-[15px] sm:w-[15px]" />
            </span>

            <div className="card">
              <div className="flex flex-wrap items-baseline justify-between gap-st-1">
                <h3 className="text-h3 text-primary">{entry.role}</h3>
                <span className="font-mono text-micro text-accent">{entry.dates}</span>
              </div>
              <p className="mt-0.5 text-meta text-secondary">
                {entry.company}
                {entry.industry ? ` · ${entry.industry}` : ""}
              </p>
              <p className="mt-st-2 max-w-prose text-meta text-secondary">{entry.description}</p>

              {entry.responsibilities && (
                <ul className="mt-st-3 grid grid-cols-1 gap-x-st-4 gap-y-st-1 sm:grid-cols-2">
                  {entry.responsibilities.map((r) => (
                    <li key={r} className="flex items-start gap-st-1 text-meta text-secondary">
                      <span
                        className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent/70"
                        aria-hidden="true"
                      />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

/**
 * Intern to full-time, as a track that fills when it scrolls into view.
 *
 * The bar is the promotion: it starts empty at the intern end and completes at
 * the current role, so the progression is the animation rather than an
 * ornament on top of it.
 */
export function InternToFullTimeIndicator() {
  const { transitions } = useMotion();

  return (
    <Reveal className="card">
      <p className="font-mono text-micro uppercase text-secondary">Career progression</p>

      {/* Three equal columns needed ~150px each to keep the role names on two
          lines; on a 360px phone they were squeezed to 90px and broke mid-word.
          Below `sm` the track runs vertically instead, which also puts the two
          roles in reading order rather than side by side. */}
      <div className="mt-st-4 flex flex-col gap-st-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-st-2 sm:flex-1 sm:flex-col sm:items-center sm:gap-st-1 sm:text-center">
          <span className="rounded-full border border-border bg-bg px-st-2 py-1.5 font-mono text-micro text-secondary">
            Software Developer Intern
          </span>
          <span className="text-nano text-secondary">Feb 2026</span>
        </div>

        {/* Vertical rail on a phone, horizontal track from `sm`. Two elements
            rather than one, because the fill grows along a different axis in
            each case and only one of them is ever mounted. */}
        <div
          className="relative ml-st-2 h-8 w-1 overflow-hidden rounded-full bg-border sm:ml-0 sm:h-1 sm:w-auto sm:flex-1"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-x-0 top-0 rounded-full bg-accent-gradient sm:hidden"
            initial={transitions ? { height: "0%" } : { height: "100%" }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 left-0 hidden rounded-full bg-accent-gradient sm:block"
            initial={transitions ? { width: "0%" } : { width: "100%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
          />
        </div>

        <div className="flex items-center gap-st-2 sm:flex-1 sm:flex-col sm:items-center sm:gap-st-1 sm:text-center">
          <span className="rounded-full border border-accent/50 bg-accent/10 px-st-2 py-1.5 font-mono text-micro text-primary">
            Full-Stack Developer
          </span>
          <span className="text-nano text-accent">Sep 2026 to Present</span>
        </div>
      </div>
    </Reveal>
  );
}
