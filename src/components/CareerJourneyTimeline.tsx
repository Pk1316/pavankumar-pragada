import { useRef } from "react";
import { careerJourney } from "../data/experience";
import { Reveal } from "./Reveal";
import { ScrollRail } from "./ScrollRail";

/**
 * The career sequence, drawn as a rail that fills as the reader scrolls it.
 *
 * This content genuinely is a sequence, so the dated markers earn their place
 * here. The final entry is the live one and keeps the accent ring.
 */
export function CareerJourneyTimeline() {
  const ref = useRef<HTMLOListElement>(null);

  return (
    <div className="relative">
      <ScrollRail targetRef={ref} left={5} className="pointer-events-none absolute inset-y-1.5 w-px" />

      <ol ref={ref} className="space-y-st-4">
        {careerJourney.map((step, i) => {
          const isCurrent = i === careerJourney.length - 1;

          return (
            <Reveal as="li" key={step.date} index={i} x={-8} y={0} className="relative pl-st-4">
              <span
                className={
                  isCurrent
                    ? "absolute left-0 top-[7px] h-[11px] w-[11px] rounded-full border-2 border-bg bg-accent shadow-[0_0_0_3px_rgba(34,211,238,0.18)]"
                    : "absolute left-[1.5px] top-[8px] h-2 w-2 rounded-full border-2 border-bg bg-accent/70"
                }
                aria-hidden="true"
              />
              <p className="font-mono text-micro text-accent">{step.date}</p>
              <p className="mt-0.5 text-meta text-secondary">{step.label}</p>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}
