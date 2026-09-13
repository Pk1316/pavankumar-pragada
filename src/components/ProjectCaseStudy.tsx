import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import type { Project } from "../data/projects";
import { useMotion } from "../hooks/useMotionTier";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { ProjectVisual } from "./viz/ProjectVisual";

interface Props {
  project: Project | null;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLElement | null>;
  /**
   * Where on screen the card that opened this sat, as a fraction of the
   * viewport from its centre. The panel enters from that direction, so the
   * dialog reads as an expansion of the thing that was clicked rather than as
   * an unrelated overlay arriving from nowhere.
   */
  origin?: { x: number; y: number } | null;
}

export function ProjectCaseStudy({ project, onClose, returnFocusRef, origin }: Props) {
  const { transitions } = useMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [scroller, setScroller] = useState<HTMLElement | null>(null);

  // The dialog is its own scroll container, so the sticky title bar sticks to
  // the dialog's top edge. Scrolling the overlay instead left a band of the
  // overlay's padding above the bar, through which the case-study text slid in
  // and out of view. One callback ref feeds both the focus logic and the read
  // progress.
  const attachDialog = useCallback((node: HTMLDivElement | null) => {
    dialogRef.current = node;
    setScroller(node);
  }, []);

  // Read progress through the case study, shown as a hairline under the title
  // bar. These panels run well past a screen, and the bar is the only cue that
  // there is more below.
  const { scrollYProgress } = useScroll({ container: { current: scroller } as React.RefObject<HTMLElement> });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    if (!project) return;

    const dialog = dialogRef.current;
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusable()[0]?.focus();
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const items = focusable();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      returnFocusRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const diagramNodes = project?.architecture?.map((n) => ({
    id: n.id,
    label: n.label,
    detail: n.description,
  }));

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-st-2 sm:p-st-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Fade plus a short rise, enough to show where the panel came from
              without throwing the page around. */}
          <motion.div
            ref={attachDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            initial={
              transitions
                ? { opacity: 0, x: (origin?.x ?? 0) * 90, y: (origin?.y ?? 0) * 70 + 18, scale: 0.94 }
                : { opacity: 0 }
            }
            animate={transitions ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 1 }}
            exit={
              transitions
                ? { opacity: 0, x: (origin?.x ?? 0) * 50, y: (origin?.y ?? 0) * 40 + 12, scale: 0.97 }
                : { opacity: 0 }
            }
            transition={{ duration: 0.36, ease: [0.22, 0.61, 0.36, 1] }}
            // `overflow-y-auto`, never `overflow-hidden`: the panel has to
            // scroll for the sticky title bar to have anything to stick to, and
            // `hidden` would strand the lower half of a long case study off the
            // bottom of the screen with no way to reach it.
            className="relative z-10 max-h-full w-full max-w-3xl overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface shadow-2xl"
          >
            {/* The architecture, at the size it was drawn for. */}
            <ProjectVisual slug={project.slug} size="hero" />

            <div className="sticky top-0 z-10 flex items-start justify-between gap-st-3 border-b border-border bg-surface/95 px-st-3 py-st-3 backdrop-blur sm:px-st-4">
              <motion.div
                className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent-gradient"
                style={{ scaleX: transitions ? progress : scrollYProgress }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <h2 id="case-study-title" className="text-h2 text-primary">
                  {project.name}
                </h2>
                <p className="mt-0.5 font-mono text-micro text-accent">{project.tagline}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="shrink-0 rounded-full border border-border p-2 text-secondary transition-colors duration-200 hover:border-accent/40 hover:text-primary"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-st-5 px-st-3 py-st-4 sm:px-st-4">
              <div className="flex flex-wrap gap-st-1">
                {project.categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-md border border-accent/30 bg-accent/5 px-2 py-0.5 font-mono text-nano text-accent"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <Section title="Overview">
                <p className="max-w-prose text-meta text-secondary">{project.overview}</p>
              </Section>

              <Section title="Problem">
                <p className="max-w-prose text-meta text-secondary">{project.problem}</p>
              </Section>

              <Section title="Solution">
                <p className="max-w-prose text-meta text-secondary">{project.solution}</p>
              </Section>

              {diagramNodes && diagramNodes.length > 0 && (
                <Section title="Architecture">
                  <ArchitectureDiagram nodes={diagramNodes} layout="split" />
                </Section>
              )}

              <Section title="My contribution">
                <div className="grid gap-st-2 sm:grid-cols-2">
                  {project.contribution.frontend && (
                    <ContributionBlock label="Frontend" text={project.contribution.frontend} />
                  )}
                  {project.contribution.backend && (
                    <ContributionBlock label="Backend" text={project.contribution.backend} />
                  )}
                  {project.contribution.database && (
                    <ContributionBlock label="Database" text={project.contribution.database} />
                  )}
                  {project.contribution.realtime && (
                    <ContributionBlock label="Real-time" text={project.contribution.realtime} />
                  )}
                </div>
              </Section>

              <Section title="Engineering challenges">
                <ul className="space-y-st-1">
                  {project.challenges.map((c) => (
                    <li key={c} className="flex items-start gap-st-1 text-meta text-secondary">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent/70" aria-hidden="true" />
                      <span className="max-w-prose">{c}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              {project.conceptTags && (
                <Section title="Engineering concepts">
                  <div className="flex flex-wrap gap-st-1">
                    {project.conceptTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-bg/60 px-st-2 py-1 text-nano text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              <Section title="Technology">
                <div className="flex flex-wrap gap-st-1">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border bg-white/[0.03] px-2 py-1 font-mono text-nano text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Section>

              <Section title="Repository">
                <div className="flex flex-wrap gap-st-2">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-st-3 py-st-1 text-meta font-medium text-bg transition-transform duration-200 hover:-translate-y-px motion-reduce:hover:translate-y-0"
                  >
                    View on GitHub <ExternalLink size={13} aria-hidden="true" />
                  </a>
                  {project.extraLinks?.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-st-3 py-st-1 text-meta text-secondary transition-colors duration-200 hover:border-accent/40 hover:text-primary"
                    >
                      {link.label} <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </Section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-st-2 font-mono text-micro uppercase text-secondary">{title}</h3>
      {children}
    </section>
  );
}

function ContributionBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="panel">
      <p className="font-mono text-nano uppercase text-accent">{label}</p>
      <p className="mt-1 text-meta text-secondary">{text}</p>
    </div>
  );
}
