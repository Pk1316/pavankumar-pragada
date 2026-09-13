import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  Code2,
  CornerDownLeft,
  Github,
  Linkedin,
  Mail,
  Search,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SECTIONS } from "../data/sections";
import { links } from "../data/profile";
import { useMotion } from "../hooks/useMotionTier";
import { cn } from "../utils/cn";

interface Command {
  id: string;
  label: string;
  hint: string;
  group: "Jump to" | "Open";
  icon?: LucideIcon;
  /** Set for external destinations; sections scroll instead. */
  url?: string;
}

const COMMANDS: Command[] = [
  ...SECTIONS.map<Command>((s) => ({ id: s.id, label: s.label, hint: s.hint, group: "Jump to" })),
  { id: "email", label: "Email Pavan", hint: links.email, group: "Open", icon: Mail, url: links.mailto },
  { id: "github", label: "GitHub", hint: "Repositories and source", group: "Open", icon: Github, url: links.github },
  { id: "linkedin", label: "LinkedIn", hint: "Professional profile", group: "Open", icon: Linkedin, url: links.linkedin },
  { id: "leetcode", label: "LeetCode", hint: "Problem-solving profile", group: "Open", icon: Code2, url: links.leetcode },
  { id: "codechef", label: "CodeChef", hint: "Contest rating", group: "Open", icon: Trophy, url: links.codechef },
  {
    id: "hackerrank",
    label: "HackerRank",
    hint: "SQL (Advanced) certificate",
    group: "Open",
    icon: Award,
    url: links.hackerrank,
  },
];

/**
 * Keyboard-first navigation for the page.
 *
 * A single-page portfolio is a long scroll, and someone reading it with a
 * keyboard should not have to tab through it to reach the one section they
 * came for. Ctrl/Cmd+K or `/` opens this; typing filters; Enter either scrolls
 * to a section or opens a profile.
 */
export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { still, transitions } = useMotion();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(q));
  }, [query]);

  // Global shortcut. Registered whether or not the palette is open, so the same
  // listener both opens and closes it.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const inField =
        event.target instanceof HTMLElement &&
        ["input", "textarea", "select"].includes(event.target.tagName.toLowerCase());

      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        onOpenChange(!open);
        return;
      }
      if (key === "/" && !open && !inField) {
        event.preventDefault();
        onOpenChange(true);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setCursor(0);
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
      restoreRef.current?.focus();
    };
  }, [open]);

  // Keep the highlighted row in view as the cursor moves through a long list.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [cursor, results]);

  function run(command: Command) {
    onOpenChange(false);
    if (command.url) {
      const external = !command.url.startsWith("mailto:");
      window.open(command.url, external ? "_blank" : "_self", external ? "noopener,noreferrer" : "");
      return;
    }
    // Let the dialog unmount and release the scroll lock before scrolling.
    requestAnimationFrame(() => {
      document
        .getElementById(command.id)
        ?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
    });
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      onOpenChange(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
      return;
    }
    if (event.key === "Enter" && results[cursor]) {
      event.preventDefault();
      run(results[cursor]);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={transitions ? { opacity: 0, y: -10, scale: 0.985 } : { opacity: 0 }}
            animate={transitions ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1 }}
            exit={transitions ? { opacity: 0, y: -8, scale: 0.99 } : { opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            onKeyDown={onKeyDown}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-[0_32px_90px_-30px_rgba(0,0,0,0.95)]"
          >
            <div className="flex items-center gap-st-2 border-b border-border px-st-3">
              <Search size={16} className="shrink-0 text-secondary" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                placeholder="Search sections and profiles"
                aria-label="Search sections and profiles"
                className="w-full bg-transparent py-st-3 text-body text-primary outline-none placeholder:text-secondary/60"
              />
              <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-nano text-secondary sm:block">
                esc
              </kbd>
            </div>

            <ul ref={listRef} className="max-h-[min(22rem,50vh)] overflow-y-auto p-st-1" role="listbox">
              {results.length === 0 && (
                <li className="px-st-2 py-st-3 text-meta text-secondary">
                  Nothing matches that. Try a section name.
                </li>
              )}

              {results.map((command, i) => {
                const Icon = command.icon;
                // Derived from the list rather than carried in a variable that
                // is reassigned as the rows render: with a filter applied the
                // first row of a group can be any index, and the group header
                // belongs wherever the group actually changes.
                const header = results[i - 1]?.group !== command.group ? command.group : null;
                const active = i === cursor;

                return (
                  <li key={command.id}>
                    {header && (
                      <p className="px-st-2 pb-1 pt-st-2 font-mono text-nano text-secondary/70">{header}</p>
                    )}
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      data-active={active}
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => run(command)}
                      className={cn(
                        "flex w-full items-center gap-st-2 rounded-lg px-st-2 py-st-2 text-left transition-colors duration-150",
                        active ? "bg-white/[0.06]" : "hover:bg-white/[0.03]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors duration-150",
                          active ? "border-accent/40 bg-accent/10 text-accent" : "border-border text-secondary",
                        )}
                        aria-hidden="true"
                      >
                        {Icon ? <Icon size={14} /> : <span className="font-mono text-nano">#</span>}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-meta text-primary">{command.label}</span>
                        <span className="block truncate text-nano text-secondary">{command.hint}</span>
                      </span>

                      {command.url ? (
                        <ArrowUpRight size={14} className="shrink-0 text-secondary" aria-hidden="true" />
                      ) : (
                        active && (
                          <CornerDownLeft size={14} className="shrink-0 text-accent" aria-hidden="true" />
                        )
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between border-t border-border px-st-3 py-st-2 font-mono text-nano text-secondary">
              <span>{results.length} result{results.length === 1 ? "" : "s"}</span>
              <span className="hidden sm:inline">up and down to move, enter to go</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
