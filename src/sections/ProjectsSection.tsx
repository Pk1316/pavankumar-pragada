import { useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectCaseStudy } from "../components/ProjectCaseStudy";
import { Reveal } from "../components/Reveal";
import { featuredProjects, filterCategories, type Project, type ProjectCategory } from "../data/projects";
import { links } from "../data/profile";
import { cn } from "../utils/cn";

type Filter = "All" | ProjectCategory;

export function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    if (filter === "All") return featuredProjects;
    return featuredProjects.filter((p) => p.categories.includes(filter as ProjectCategory));
  }, [filter]);

  function handleOpen(project: Project, trigger: HTMLElement) {
    triggerRef.current = trigger;

    // Where the card sat relative to the middle of the screen, as a fraction
    // of the viewport. The panel enters from that direction.
    const rect = trigger.getBoundingClientRect();
    setOrigin({
      x: (rect.left + rect.width / 2) / window.innerWidth - 0.5,
      y: (rect.top + rect.height / 2) / window.innerHeight - 0.5,
    });
    setActiveProject(project);
  }

  return (
    <section id="projects" className="shell section-y">
      <SectionHeading
        title="Featured Projects"
        subtitle="Engineering case studies. The systems, the problems they solve, and how they are built."
      />

      {/* The chips scroll rather than wrap below `sm`: six of them wrapped to
          three rows on a phone and pushed the first card most of a screen down.
          `-mx-4 px-4` lets the row bleed to the page edge so the last chip is
          not clipped mid-word by the shell gutter. */}
      <div
        className="head-gap -mx-4 flex gap-st-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
        role="group"
        aria-label="Filter projects by category"
      >
        {(["All", ...filterCategories] as Filter[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={cn(
              "relative shrink-0 rounded-full border px-st-3 py-1.5 text-meta font-medium transition-colors duration-200",
              filter === cat
                ? "border-accent/60 text-primary"
                : "border-border bg-surface text-secondary hover:border-accent/30 hover:text-primary",
            )}
          >
            {filter === cat && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-accent/10"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                aria-hidden="true"
              />
            )}
            {cat}
          </button>
        ))}
      </div>

      {/* Two columns at most, and only from 1024px. Each card leads with an
          architecture diagram; three-up, or two-up on a tablet, shrinks its
          labels past legible size, so narrower viewports get one wide column
          instead. */}
      <LayoutGroup>
        <motion.div layout className="mt-st-4 grid gap-st-3 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} onOpen={handleOpen} />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {filtered.length === 0 && (
        <p className="mt-st-4 text-meta text-secondary">
          Nothing tagged {filter} yet. Pick another filter to see the rest.
        </p>
      )}

      <Reveal className="mt-st-5 flex justify-center">
        <a
          href={links.githubRepos}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex items-center gap-st-1 rounded-lg border border-border px-st-3 py-st-2 text-meta font-medium text-primary transition-colors duration-300 hover:border-accent/50 hover:text-accent"
        >
          View all GitHub projects
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </a>
      </Reveal>

      <ProjectCaseStudy
        project={activeProject}
        origin={origin}
        onClose={() => setActiveProject(null)}
        returnFocusRef={triggerRef}
      />
    </section>
  );
}
