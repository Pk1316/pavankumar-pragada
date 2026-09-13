import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Award, Check, Code2, Copy, Github, Instagram, Linkedin, Mail, Trophy } from "lucide-react";
import { links, profile } from "../data/profile";
import { useMotion } from "../hooks/useMotionTier";
import { cn } from "../utils/cn";
import { Reveal } from "./Reveal";

interface ContactLink {
  label: string;
  url: string;
  icon: typeof Mail;
  /** mailto: links open in the mail client, so they skip target/rel. */
  external?: boolean;
  /** Highlights the primary way to get in touch. */
  primary?: boolean;
}

const CONTACT_LINKS: ContactLink[] = [
  { label: "Email", url: links.mailto, icon: Mail, primary: true },
  { label: "GitHub", url: links.github, icon: Github, external: true },
  { label: "LinkedIn", url: links.linkedin, icon: Linkedin, external: true },
  { label: "Instagram", url: links.instagram, icon: Instagram, external: true },
  { label: "LeetCode", url: links.leetcode, icon: Code2, external: true },
  { label: "CodeChef", url: links.codechef, icon: Trophy, external: true },
  { label: "HackerRank", url: links.hackerrank, icon: Award, external: true },
];

/**
 * Closing panel.
 *
 * The address is the point of this section, so it gets a copy control rather
 * than only a `mailto:` link: plenty of people read a portfolio on a machine
 * where the mail client is not the one they would answer from, and making them
 * select the text by hand is a worse ending than a button that just works.
 */
export function ContactSection() {
  const { transitions } = useMotion();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure origin, or permission denied). The address
      // is on screen as selectable text and the mail link still works, so
      // there is nothing useful to say here.
    }
  }

  return (
    <Reveal className="relative overflow-hidden rounded-2xl border border-border bg-surface px-st-3 py-st-6 text-center sm:px-st-6 sm:py-st-7">
      <div
        className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        aria-hidden="true"
      />
      {/* A readout line crossing the panel, the same idea as the packets moving
          through the diagrams. It is the only ambient motion in this section. */}
      {transitions && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-x-0 top-0 h-full animate-scan-line">
            <span className="block h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          </div>
        </div>
      )}

      <div className="relative">
        <h2 className="text-signal animate-shimmer-text text-h2">{profile.contact.headline}</h2>
        <p className="mx-auto mt-st-2 max-w-prose text-body text-secondary">{profile.contact.description}</p>

        <div className="mt-st-4 inline-flex max-w-full items-center gap-st-1 rounded-lg border border-border bg-bg/60 py-1 pl-st-2 pr-1">
          <a
            href={links.mailto}
            className="link-underline min-w-0 truncate font-mono text-meta text-secondary transition-colors duration-200 hover:text-accent"
            aria-label={`Email ${profile.name} at ${links.email}`}
          >
            {links.email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            aria-label={copied ? "Email address copied" : "Copy email address"}
            className={cn(
              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors duration-200",
              copied
                ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-400"
                : "border-border text-secondary hover:border-accent/50 hover:text-accent",
            )}
          >
            <motion.span
              key={copied ? "done" : "idle"}
              initial={transitions ? { scale: 0.6, opacity: 0 } : undefined}
              animate={transitions ? { scale: 1, opacity: 1 } : undefined}
              transition={{ type: "spring", stiffness: 500, damping: 26 }}
              className="flex"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </motion.span>
          </button>
        </div>

        <p aria-live="polite" className="mt-st-1 h-4 font-mono text-nano text-emerald-400">
          {copied ? "copied to clipboard" : ""}
        </p>

        <ul className="mt-st-3 flex flex-wrap items-center justify-center gap-st-1">
          {CONTACT_LINKS.map(({ label, url, icon: Icon, external, primary }, i) => (
            <motion.li
              key={label}
              initial={transitions ? { opacity: 0, y: 10 } : undefined}
              whileInView={transitions ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.38, delay: i * 0.05, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <a
                href={url}
                {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-st-2 py-1.5 text-meta transition-all duration-300 ease-out hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
                  primary
                    ? "border-accent/60 bg-accent/10 text-accent hover:border-accent hover:bg-accent/15"
                    : "border-border bg-bg/60 text-primary hover:border-accent/50 hover:text-accent",
                )}
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
