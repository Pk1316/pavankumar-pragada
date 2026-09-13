import { motion } from "framer-motion";
import { SECTIONS, SECTION_IDS } from "../data/sections";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { useMotion } from "../hooks/useMotionTier";

/**
 * Edge navigator: one tick per section, running down the right margin.
 *
 * It reports position first and navigates second, so the ticks stay small and
 * quiet and only the current one extends. Labels appear on hover or focus, so
 * the resting state adds no chrome to the page. Hidden below `xl`, where there
 * is no free margin to put it in and the top navigation already covers the job.
 */
export function SectionNav() {
  const activeId = useScrollSpy(SECTION_IDS);
  const { still, transitions } = useMotion();

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="flex flex-col items-end gap-st-1">
        {SECTIONS.map((section) => {
          const active = activeId === section.id;

          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => go(section.id)}
                aria-current={active ? "true" : undefined}
                aria-label={`Go to ${section.label}`}
                className="group flex items-center justify-end gap-st-2 py-1 pl-st-3"
              >
                <span
                  className={`whitespace-nowrap font-mono text-nano transition-all duration-300 ease-out ${
                    active
                      ? "text-primary opacity-100"
                      : "text-secondary opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  }`}
                >
                  {section.label}
                </span>

                <span className="relative flex h-2.5 w-8 items-center justify-end">
                  <motion.span
                    className={`block h-px rounded-full ${active ? "bg-accent" : "bg-border-strong group-hover:bg-secondary"}`}
                    animate={{ width: active ? 28 : 12 }}
                    transition={transitions ? { type: "spring", stiffness: 380, damping: 30 } : { duration: 0 }}
                  />
                  {active && transitions && (
                    <span
                      className="absolute right-0 h-1 w-1 rounded-full bg-accent shadow-[0_0_6px_1px_rgba(34,211,238,0.6)]"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
