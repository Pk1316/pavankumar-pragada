import { ArrowUp, Github, Instagram, Linkedin, Mail } from "lucide-react";
import { links, profile } from "../data/profile";
import { useMotion } from "../hooks/useMotionTier";

const SOCIALS = [
  { label: `Email ${links.email}`, url: links.mailto, icon: Mail, external: false },
  { label: "GitHub", url: links.github, icon: Github, external: true },
  { label: "LinkedIn", url: links.linkedin, icon: Linkedin, external: true },
  { label: "Instagram", url: links.instagram, icon: Instagram, external: true },
];

export function Footer({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { still } = useMotion();

  return (
    <footer className="relative border-t border-border">
      {/* A last pulse of the accent along the top edge, closing the page with
          the same line that opens it under the navigation. */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        aria-hidden="true"
      />

      <div className="shell flex flex-col items-center gap-st-3 py-st-4 sm:flex-row sm:justify-between sm:gap-st-2">
        <p className="order-3 font-mono text-micro text-secondary sm:order-1">
          © {new Date().getFullYear()} {profile.name}
        </p>

        <div className="order-1 flex items-center gap-st-3 sm:order-2">
          {SOCIALS.map(({ label, url, icon: Icon, external }) => (
            <a
              key={label}
              href={url}
              {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              aria-label={label}
              className="text-secondary transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-accent motion-reduce:hover:translate-y-0"
            >
              <Icon size={17} />
            </a>
          ))}

          <span className="h-4 w-px bg-border" aria-hidden="true" />

          <button
            type="button"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" })
            }
            aria-label="Back to top"
            className="group text-secondary transition-colors duration-300 hover:text-accent"
          >
            <ArrowUp
              size={17}
              className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none"
            />
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenPalette}
          className="link-underline order-2 font-mono text-micro text-secondary transition-colors duration-200 hover:text-accent sm:order-3"
        >
          press ctrl K to jump anywhere
        </button>
      </div>
    </footer>
  );
}
