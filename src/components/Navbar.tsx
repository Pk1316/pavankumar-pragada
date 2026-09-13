import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { SECTIONS, SECTION_IDS } from "../data/sections";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useMotion } from "../hooks/useMotionTier";
import { cn } from "../utils/cn";
import { ScrollProgress } from "./ScrollProgress";

interface Props {
  onOpenPalette: () => void;
}

export function Navbar({ onOpenPalette }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { still, transitions } = useMotion();

  const activeId = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The open mobile sheet covers the page, so the page behind it must not move.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useFocusTrap(menuRef, open, () => {
    setOpen(false);
    toggleRef.current?.focus();
  });

  function handleNavClick(id: string) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "glass border-b border-border" : "bg-transparent",
      )}
    >
      <nav className="shell flex h-16 items-center justify-between gap-st-2">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("home");
          }}
          className="group shrink-0 font-mono text-meta font-semibold tracking-tight text-primary"
          aria-label="Pavan Kumar Pragada, home"
        >
          <span className="text-accent transition-transform duration-300 ease-out group-hover:-translate-x-0.5 inline-block">
            &lt;
          </span>
          PP
          <span className="text-accent transition-transform duration-300 ease-out group-hover:translate-x-0.5 inline-block">
            /&gt;
          </span>
        </a>

        {/* `lg` rather than `md`: eight items plus the palette trigger overflow
            a 768px bar, which pushed the menu button off the right edge. */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {SECTIONS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                aria-current={activeId === item.id ? "true" : undefined}
                className={cn(
                  "relative block rounded-md px-st-2 py-1.5 text-meta transition-colors duration-200",
                  activeId === item.id ? "text-primary" : "text-secondary hover:text-primary",
                )}
              >
                {/* The indicator slides between sections rather than
                    cross-fading, so the nav shows where you are heading. */}
                {activeId === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-md bg-white/[0.07] ring-1 ring-inset ring-white/10"
                    transition={transitions ? { type: "spring", stiffness: 380, damping: 32 } : { duration: 0 }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-st-1">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open command palette"
            className="group inline-flex h-10 items-center gap-st-2 rounded-lg border border-border px-st-2 text-secondary transition-colors duration-200 hover:border-accent/40 hover:text-primary sm:h-9"
          >
            <Search size={15} aria-hidden="true" />
            <span className="hidden font-mono text-nano text-secondary group-hover:text-primary sm:inline">
              ctrl K
            </span>
          </button>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-primary transition-colors duration-200 hover:bg-white/5 lg:hidden"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <motion.span
              key={open ? "close" : "open"}
              initial={transitions ? { rotate: -90, opacity: 0 } : undefined}
              animate={transitions ? { rotate: 0, opacity: 1 } : undefined}
              transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
              className="flex"
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </motion.span>
          </button>
        </div>
      </nav>

      <ScrollProgress />

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={transitions ? { opacity: 0, height: 0 } : { opacity: 0 }}
            animate={transitions ? { opacity: 1, height: "auto" } : { opacity: 1 }}
            exit={transitions ? { opacity: 0, height: 0 } : { opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            // Opaque, not `.glass`: this sheet covers the hero rather than
            // sitting as a strip over it, and a translucent panel left the
            // headline legible straight through the menu labels. It also has
            // to stay readable where `backdrop-filter` is unavailable.
            className="overflow-hidden border-b border-border bg-[#0B0D12]/[0.97] backdrop-blur-xl lg:hidden"
          >
            <ul className="flex max-h-[calc(100svh-4rem)] flex-col gap-0.5 overflow-y-auto px-4 pb-st-4 pt-st-2">
              {SECTIONS.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={transitions ? { opacity: 0, x: -10 } : undefined}
                  animate={transitions ? { opacity: 1, x: 0 } : undefined}
                  transition={{ duration: 0.3, delay: 0.04 + i * 0.035, ease: [0.22, 0.61, 0.36, 1] }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id);
                    }}
                    aria-current={activeId === item.id ? "true" : undefined}
                    className={cn(
                      "flex items-center justify-between gap-st-2 rounded-lg px-st-2 py-st-2 text-body transition-colors duration-200",
                      activeId === item.id ? "bg-white/5 text-primary" : "text-secondary hover:text-primary",
                    )}
                  >
                    <span>{item.label}</span>
                    <span
                      className={cn(
                        "h-1 w-1 rounded-full transition-colors duration-200",
                        activeId === item.id ? "bg-accent" : "bg-transparent",
                      )}
                      aria-hidden="true"
                    />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
