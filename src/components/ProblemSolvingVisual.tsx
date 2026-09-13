import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { problemSolvingCentralMessage, problemSolvingFlow } from "../data/codingProfiles";
import { useInViewOnce } from "../hooks/useInViewOnce";
import { useMotion } from "../hooks/useMotionTier";
import { Reveal } from "./Reveal";

const STEP_MS = 1600;

/**
 * The four practice tracks and the loop they feed.
 *
 * The loop is drawn as a loop rather than written as a list with separators,
 * because it genuinely is one: the last stage feeds the first. A marker walks
 * the four stages on a timer, and the connector behind it fills, so the
 * direction of travel is shown instead of asserted with glyphs.
 *
 * The walk runs only while the panel is on screen at the full motion tier.
 * Everywhere else the four stages sit still and read as a plain sequence,
 * which is all they need to do.
 */
export function ProblemSolvingVisual() {
  const { ambient, transitions } = useMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ amount: 0.4, repeat: true });
  const stages = problemSolvingCentralMessage.split(" / ");
  const running = ambient && inView;

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % stages.length), STEP_MS);
    return () => clearInterval(id);
  }, [running, stages.length]);

  return (
    <Reveal className="card">
      <div ref={ref}>
        <div className="grid grid-cols-2 gap-st-2 sm:grid-cols-4">
          {problemSolvingFlow.map((item, i) => (
            <Reveal key={item.source} index={i}>
              <div className="panel h-full text-center transition-colors duration-300 hover:border-accent/30">
                <p className="font-mono text-meta text-primary">{item.source}</p>
                <p className="mt-0.5 text-nano text-accent">{item.action}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* The loop.
            It runs as a column on a phone and a row from `sm`. Wrapping a
            single row was the obvious thing and the wrong one: four chips and
            their connectors do not fit a 360px line, and every wrap left a
            connector pointing off the end of a line at nothing. Turning the
            axis keeps every connector between the two stages it joins. */}
        <ol className="mt-st-4 flex flex-col items-start gap-st-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-st-2">
          {stages.map((stage, i) => {
            const lit = running && i === active;
            const last = i === stages.length - 1;

            return (
              <li key={stage} className="flex flex-col items-start gap-st-1 sm:flex-row sm:items-center sm:gap-st-2">
                <span
                  className={`relative rounded-full border px-st-3 py-1 font-mono text-meta transition-colors duration-500 ${
                    lit ? "border-accent/60 text-primary" : "border-border text-secondary"
                  }`}
                >
                  {lit && transitions && (
                    <motion.span
                      layoutId="cycle-marker"
                      className="absolute inset-0 -z-10 rounded-full bg-accent/10"
                      transition={{ type: "spring", stiffness: 260, damping: 30 }}
                      aria-hidden="true"
                    />
                  )}
                  {stage}
                </span>

                <span className="flex items-center gap-st-2">
                  {/* Vertical on a phone, horizontal from `sm`. The fill tracks
                      the marker, so the direction of travel is drawn. */}
                  <span
                    className="relative ml-st-4 h-4 w-px bg-border sm:ml-0 sm:h-px sm:w-7"
                    aria-hidden="true"
                  >
                    <motion.span
                      className="absolute inset-x-0 top-0 bg-accent sm:hidden"
                      animate={{ height: lit ? "100%" : "0%" }}
                      transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                    />
                    <motion.span
                      className="absolute inset-y-0 left-0 hidden bg-accent sm:block"
                      animate={{ width: lit ? "100%" : "0%" }}
                      transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                    />
                  </span>

                  {/* The return edge is what makes this a cycle rather than a
                      pipeline, so it is labelled rather than implied. */}
                  {last && (
                    <span className="font-mono text-nano text-secondary/70">
                      back to {stages[0].toLowerCase()}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Reveal>
  );
}
