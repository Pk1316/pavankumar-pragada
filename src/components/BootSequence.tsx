import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KEY = "pp-boot-done";
const STAGES = ["react", "api", "fastapi", "kafka", "processing", "postgres", "websocket", "dashboard"];

const FILL_MS = 1050;
const HOLD_MS = 140;
const WIPE_MS = 520;

/**
 * How long the hero holds before it sets, when the intro is playing. The hero
 * reads this as a plain delay and never waits on a signal from the panel, so
 * the two cannot get out of step and no failure in here can leave the hero
 * invisible.
 */
export const BOOT_HANDOFF_S = (FILL_MS + HOLD_MS) / 1000 + 0.08;

/**
 * Whether the intro should play for this visit.
 *
 * Once per tab, never under `prefers-reduced-motion`, and never on a deep link
 * to a section: arriving at `#projects` means the visitor asked for that
 * content, not for a title card. Read synchronously during the first render so
 * the page never paints the hero and then covers it back up.
 *
 * `?noboot` skips it as well. That is for working on the page: an intro is a
 * pleasant thing to meet once and a tax to sit through on every reload while
 * editing the hero underneath it.
 */
export function bootShouldRun(): boolean {
  if (typeof window === "undefined") return false;
  if (window.location.search.includes("noboot")) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.location.hash && window.location.hash !== "#home") return false;
  try {
    return sessionStorage.getItem(KEY) !== "1";
  } catch {
    // Private mode with storage blocked: play it, just do not try to remember.
    return true;
  }
}

/**
 * The site's page-load moment: the pipeline coming online, then getting out of
 * the way.
 *
 * It is deliberately the same idea as the rest of the page rather than a
 * generic splash. Stage names tick past in the order data actually moves
 * through the system, a rule fills as they land, and the panel then wipes
 * upward to hand the hero its own entrance. The whole thing is under 1.6s and
 * any key, click or scroll cuts it short.
 */
export function BootSequence({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    const timers: number[] = [];

    function finish(immediate = false) {
      if (finished.current) return;
      finished.current = true;
      timers.forEach(clearTimeout);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* storage blocked; the intro simply plays again next tab */
      }
      setLeaving(true);
      // Released here rather than in the effect cleanup: the panel stops
      // covering the page the moment it starts lifting, and the page has to be
      // scrollable again from that point whether or not this unmounts.
      document.body.style.overflow = "";
      timers.push(window.setTimeout(onDone, immediate ? 60 : 180));
      timers.push(window.setTimeout(() => setGone(true), (immediate ? 260 : WIPE_MS) + 120));
    }

    const step = FILL_MS / STAGES.length;
    STAGES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStage(i), i * step));
    });
    timers.push(window.setTimeout(() => finish(), FILL_MS + HOLD_MS));

    const skip = () => finish(true);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("wheel", skip, { passive: true });

    document.body.style.overflow = "hidden";

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-bg"
          initial={{ y: 0 }}
          animate={leaving ? { y: "-100%" } : { y: 0 }}
          transition={{ duration: WIPE_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading"
        >
          <div className="absolute inset-0 bg-grid opacity-[0.35]" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(34,211,238,0.07),transparent_70%)]"
            aria-hidden="true"
          />

          <motion.div
            className="relative w-[min(22rem,78vw)]"
            animate={leaving ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="flex items-baseline justify-between font-mono text-micro">
              <span className="text-secondary">
                {STAGES[stage]}
                <span className="ml-0.5 inline-block animate-caret-blink text-accent">_</span>
              </span>
              <span className="tabular text-secondary/70">
                {String(Math.round(((stage + 1) / STAGES.length) * 100)).padStart(3, "0")}
              </span>
            </div>

            <div className="relative mt-st-2 h-px w-full overflow-hidden bg-border">
              <motion.div
                className="absolute inset-y-0 left-0 bg-accent-gradient"
                initial={{ width: "0%" }}
                animate={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
                transition={{ duration: FILL_MS / STAGES.length / 1000, ease: "linear" }}
              />
            </div>

            {/* Eight ticks, one per stage, landing as its name comes up. */}
            <div className="mt-st-2 flex gap-1">
              {STAGES.map((name, i) => (
                <span
                  key={name}
                  className={`h-[3px] flex-1 rounded-full transition-colors duration-200 ${
                    i <= stage ? "bg-accent/70" : "bg-border"
                  }`}
                />
              ))}
            </div>

            <p className="mt-st-3 font-mono text-nano text-secondary/60">
              pavan kumar pragada / full-stack developer
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
