import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../data/projects";
import { useTilt } from "../hooks/useTilt";
import { useMotion } from "../hooks/useMotionTier";
import { ProjectVisual } from "./viz/ProjectVisual";

interface Props {
  project: Project;
  index: number;
  onOpen: (project: Project, trigger: HTMLElement) => void;
}

/**
 * A project as its architecture plus the shortest description that explains it.
 *
 * The visual is the card's subject, so it sits above the text at full bleed and
 * carries the hover treatment (slow scale, wash receding, flowing edges). The
 * card itself only lifts and takes an accent border; the badges shift a hair.
 * Everything runs on transform and opacity.
 */
export function ProjectCard({ project, index, onOpen }: Props) {
  const { transitions } = useMotion();
  const { enabled, rotateX, rotateY, onPointerMove, onPointerLeave } = useTilt({ max: 4 });

  const extraTech = project.technologies.length - 3;

  return (
    <motion.button
      type="button"
      layout
      initial={transitions ? { opacity: 0, y: 14 } : undefined}
      animate={transitions ? { opacity: 1, y: 0 } : undefined}
      exit={transitions ? { opacity: 0, y: -10 } : undefined}
      whileHover={transitions ? { y: -5 } : undefined}
      transition={{ duration: 0.42, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 0.61, 0.36, 1] }}
      onClick={(e) => onOpen(project, e.currentTarget)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={enabled ? { rotateX, rotateY, transformPerspective: 1100 } : undefined}
      data-cursor="Case study"
      className="card-glow group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface text-left hover:border-accent/40 hover:bg-surface-hover focus-visible:border-accent/60"
      aria-label={`${project.name}. ${project.tagline}. Open case study.`}
    >
      <ProjectVisual slug={project.slug} />

      <div className="flex flex-1 flex-col p-st-4">
        <div className="flex items-start justify-between gap-st-2">
          <h3 className="text-h3 text-primary">{project.name}</h3>
          <ArrowUpRight
            size={17}
            className="mt-0.5 shrink-0 text-secondary transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
            aria-hidden="true"
          />
        </div>

        <p className="mt-1 font-mono text-micro text-accent">{project.tagline}</p>
        <p className="mt-st-2 line-clamp-2 text-meta text-secondary">{project.overview}</p>

        <div className="mt-st-3 flex flex-wrap items-center gap-st-1">
          {project.technologies.slice(0, 3).map((t, i) => (
            <span
              key={t}
              className="rounded-md border border-border bg-bg/60 px-2 py-0.5 font-mono text-nano text-secondary transition-transform duration-300 ease-out group-hover:-translate-y-px group-hover:border-accent/25 motion-reduce:transition-none"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {t}
            </span>
          ))}
          {extraTech > 0 && (
            <span className="rounded-md bg-white/[0.03] px-2 py-0.5 font-mono text-nano text-secondary">
              +{extraTech}
            </span>
          )}

          {/* Says what a click does. Hidden from assistive tech because the
              button's own label already ends with "Open case study", and
              hidden on touch, where there is no hover to reveal it. */}
          <span
            className="ml-auto hidden items-center font-mono text-nano text-accent opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100 sm:inline-flex sm:translate-x-1 motion-reduce:transition-none"
            aria-hidden="true"
          >
            read case study
          </span>
        </div>
      </div>
    </motion.button>
  );
}
