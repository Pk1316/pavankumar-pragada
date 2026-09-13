import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { profile } from "../data/profile";
import { useMotion } from "../hooks/useMotionTier";
import { DecodeText } from "../components/DecodeText";
import { MagneticButton } from "../components/MagneticButton";
import { PortraitCard } from "../components/PortraitCard";
import { StatusDot } from "../components/StatusDot";
import { HeroBackdrop } from "../components/viz/HeroBackdrop";

function scrollTo(id: string, still: boolean) {
  document.getElementById(id)?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
}

const EASE = [0.22, 0.61, 0.36, 1] as const;

interface Props {
  /**
   * Seconds to hold before the hero sets, so it lands as the intro panel
   * clears. Zero when there is no intro. A plain number rather than a signal
   * from the panel: the hero drives its own entrance and cannot be left
   * invisible by anything that happens elsewhere.
   */
  introDelay: number;
}

/**
 * The site's one orchestrated moment.
 *
 * The headline does not fade in; it is written. Each word wipes in from the
 * left with a block cursor running ahead of it, the role line resolves out of
 * noise beneath it, and the portrait settles in behind while the pipeline
 * topology comes up across the background. That is the whole page's motion
 * budget for anything the visitor did not ask for: everything below this
 * responds to scrolling or pointing.
 *
 * On the way out the hero parallaxes: copy rises faster than the portrait and
 * both fade, so the ticker below arrives over the top of it rather than after
 * it.
 */
export function HeroSection({ introDelay }: Props) {
  const { still, transitions } = useMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const words = profile.hero.headline.split(" ");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const cueFade = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const parallax = transitions ? { y: copyY, opacity: fade } : undefined;

  /** Entrance delay for a step, pushed back by the intro hold. */
  const at = (seconds: number) => introDelay + seconds;

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-st-7 pt-28 sm:pt-32"
    >
      <HeroBackdrop />

      <div className="shell relative grid w-full grid-cols-1 items-center gap-st-5 sm:gap-st-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div style={parallax}>
          <motion.div
            initial={transitions ? { opacity: 0, y: 12 } : undefined}
            animate={transitions ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: at(0), ease: EASE }}
          >
            <StatusDot label="Available for interesting engineering conversations" color="green" />
          </motion.div>

          <h1 className="mt-st-4 text-display text-primary">
            {still ? (
              profile.hero.headline
            ) : (
              <>
                {words.map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    className="inline-block whitespace-pre"
                    initial={{ clipPath: "inset(-20% 100% -20% 0%)", y: 14, opacity: 0 }}
                    animate={{ clipPath: "inset(-20% 0% -20% 0%)", y: 0, opacity: 1 }}
                    transition={{ duration: 0.44, ease: EASE, delay: at(0.12 + i * 0.06) }}
                  >
                    {word}
                    {i < words.length - 1 ? " " : ""}
                  </motion.span>
                ))}

                {/* One caret, arriving when the last word has set. An earlier
                    pass put a caret on every word; with the words 60ms apart
                    and each caret alive for 340ms, five of them were on screen
                    at once and it read as noise rather than as a line being
                    written. */}
                <motion.span
                  className="ml-[0.08em] inline-block h-[0.72em] w-[0.09em] translate-y-[0.02em] bg-accent align-baseline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0.15, 1] }}
                  transition={{
                    duration: 1.8,
                    times: [0, 0.06, 0.5, 0.62, 0.78],
                    delay: at(0.12 + words.length * 0.06),
                    repeat: Infinity,
                    repeatDelay: 0.4,
                  }}
                  aria-hidden="true"
                />
              </>
            )}
          </h1>

          <motion.p
            className="mt-st-4 max-w-prose text-body-lg text-secondary"
            initial={transitions ? { opacity: 0, y: 10 } : undefined}
            animate={transitions ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: at(0.42), ease: EASE }}
          >
            {profile.hero.supporting}
          </motion.p>

          <motion.p
            className="mt-st-2 max-w-prose text-meta text-secondary/90"
            initial={transitions ? { opacity: 0, y: 10 } : undefined}
            animate={transitions ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: at(0.5), ease: EASE }}
          >
            {profile.hero.intro}
          </motion.p>

          <motion.div
            className="mt-st-5 flex flex-wrap items-center gap-st-2"
            initial={transitions ? { opacity: 0, y: 10 } : undefined}
            animate={transitions ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: at(0.58), ease: EASE }}
          >
            <MagneticButton
              onClick={() => scrollTo("projects", still)}
              data-cursor="View work"
              className="group relative overflow-hidden rounded-lg bg-accent-gradient px-st-4 py-st-2 text-meta font-semibold text-bg"
            >
              <span className="relative z-10 inline-flex items-center gap-1.5">
                {profile.hero.primaryCta}
                <ArrowDown
                  size={14}
                  className="transition-transform duration-300 ease-out group-hover:translate-y-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </span>
              <span className="sheen group-hover:animate-sheen" aria-hidden="true" />
            </MagneticButton>

            <MagneticButton
              onClick={() => scrollTo("contact", still)}
              data-cursor="Say hello"
              className="rounded-lg border border-border px-st-4 py-st-2 text-meta font-medium text-primary transition-colors duration-300 hover:border-accent/50 hover:text-accent"
            >
              {profile.hero.secondaryCta}
            </MagneticButton>
          </motion.div>

          <motion.p
            className="mt-st-4 font-mono text-micro text-secondary"
            initial={transitions ? { opacity: 0 } : undefined}
            animate={transitions ? { opacity: 1 } : undefined}
            transition={{ duration: 0.4, delay: at(0.66), ease: EASE }}
          >
            <DecodeText text={`${profile.role} / ${profile.company}`} delay={at(0.72) * 1000} />
          </motion.p>
        </motion.div>

        <motion.div
          style={transitions ? { y: portraitY, opacity: fade } : undefined}
          className="mx-auto w-full max-w-[15rem] sm:max-w-[19rem] lg:ml-auto lg:mr-0 lg:max-w-[22rem]"
        >
          <PortraitCard name={profile.name} role={profile.role} introDelay={introDelay} />
        </motion.div>
      </div>

      {/* Scroll cue. Sits in the hero's bottom margin on tall viewports only,
          where there is room for it below the content. */}
      <motion.div
        style={transitions ? { opacity: cueFade } : undefined}
        className="pointer-events-none absolute inset-x-0 bottom-st-3 hidden justify-center lg:flex"
        aria-hidden="true"
      >
        <span className="relative flex h-8 w-5 items-start justify-center rounded-full border border-border pt-1.5">
          <span className={`h-1 w-1 rounded-full bg-accent ${transitions ? "animate-cue-fall" : ""}`} />
        </span>
      </motion.div>
    </section>
  );
}
