/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#08090A",
        surface: "#111318",
        "surface-hover": "#161920",
        border: "#1F2229",
        "border-strong": "#2A2E38",
        primary: "#F5F5F5",
        secondary: "#A1A1AA",
        accent: {
          DEFAULT: "#22D3EE",
          blue: "#3B82F6",
          violet: "#8B5CF6",
        },
      },

      /**
       * Spacing system: one stack scale of 8 / 12 / 16 / 24 / 32 / 40 / 48.
       * Everything on the page picks a step from here instead of an ad-hoc
       * value, so vertical rhythm stays consistent across sections. Section
       * padding uses the top of the scale (see `.section-y` in index.css).
       */
      spacing: {
        "st-1": "0.5rem", // 8:  label to value, chip gaps
        "st-2": "0.75rem", // 12: related lines inside a card
        "st-3": "1rem", // 16: standard block gap
        "st-4": "1.5rem", // 24: card padding, group gap
        "st-5": "2rem", // 32: heading to content
        "st-6": "2.5rem", // 40: sub-block within a section
        "st-7": "3rem", // 48: section padding, and gap before a sub-heading
      },

      /**
       * Type scale, largest to smallest:
       * display, h2, body-lg, h3, h4, body, meta, micro, nano.
       * Replaces the earlier mix of text-xs / text-sm / text-[11px].
       */
      fontSize: {
        display: [
          "clamp(2.125rem, 1.1rem + 3.4vw, 3.375rem)",
          { lineHeight: "1.06", letterSpacing: "-0.032em", fontWeight: "700" },
        ],
        h2: [
          "clamp(1.625rem, 1.1rem + 1.5vw, 2.25rem)",
          { lineHeight: "1.14", letterSpacing: "-0.026em", fontWeight: "700" },
        ],
        h3: ["1.0625rem", { lineHeight: "1.35", letterSpacing: "-0.015em", fontWeight: "600" }],
        h4: ["0.9375rem", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.6" }],
        body: ["0.9375rem", { lineHeight: "1.65" }],
        meta: ["0.8125rem", { lineHeight: "1.55" }],
        micro: ["0.6875rem", { lineHeight: "1.45", letterSpacing: "0.04em" }],
        nano: ["0.625rem", { lineHeight: "1.4", letterSpacing: "0.06em" }],
      },

      maxWidth: {
        shell: "72rem", // 1152: the one page container width
        prose: "62ch", // keeps body copy under ~80 characters
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },

      backgroundImage: {
        // No `grid` entry here or in `backgroundSize`: the grid is the
        // `.bg-grid` utility in index.css, which owns both its image and its
        // size. A `grid` backgroundSize would emit a clashing `.bg-grid`.
        "accent-gradient": "linear-gradient(135deg, #22D3EE 0%, #3B82F6 50%, #8B5CF6 100%)",
      },

      transitionTimingFunction: {
        // Deliberately overrides Tailwind's own `ease-out`, so every
        // `ease-out` in the codebase resolves to this one curve and the page
        // has a single easing signature.
        out: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },

      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "aurora-a": "aurora-a 26s ease-in-out infinite",
        "aurora-b": "aurora-b 32s ease-in-out infinite",
        "aurora-c": "aurora-c 38s ease-in-out infinite",
        sheen: "sheen 1.1s ease-out",
        flow: "flow 3.4s linear infinite",
        // Diagram vocabulary: dashes crawl along edges, radar sweeps, nodes breathe.
        "dash-flow": "dash-flow 1.4s linear infinite",
        "radar-sweep": "radar-sweep 4s linear infinite",
        breathe: "breathe 2.6s ease-in-out infinite",
        "rail-travel": "rail-travel 3.6s linear infinite",

        /* Signal vocabulary. Everything added here reads as something moving
           through a pipeline, which is what the site is about. */
        marquee: "marquee 42s linear infinite",
        "scan-line": "scan-line 7s linear infinite",
        "trace-x": "trace-x 2.4s cubic-bezier(0.22, 0.61, 0.36, 1) infinite",
        "caret-blink": "caret-blink 1.05s steps(2, start) infinite",
        "ring-out": "ring-out 2.8s cubic-bezier(0.22, 0.61, 0.36, 1) infinite",
        "drift-y": "drift-y 9s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
        "shimmer-text": "shimmer-text 6s linear infinite",
        "cue-fall": "cue-fall 2.1s cubic-bezier(0.22, 0.61, 0.36, 1) infinite",
      },
      keyframes: {
        "aurora-a": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(12%, 8%, 0) scale(1.12)" },
        },
        "aurora-b": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1.08)" },
          "50%": { transform: "translate3d(-10%, -6%, 0) scale(1)" },
        },
        "aurora-c": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(8%, -10%, 0) scale(1.15)" },
        },
        flow: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(400%)" },
        },
        sheen: {
          "0%": { transform: "translateX(-120%) skewX(-18deg)", opacity: "0" },
          "35%": { opacity: "1" },
          "100%": { transform: "translateX(220%) skewX(-18deg)", opacity: "0" },
        },
        "dash-flow": {
          "0%": { strokeDashoffset: "12" },
          "100%": { strokeDashoffset: "0" },
        },
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.35)" },
        },
        /* Percentage translate is relative to the runner's own height, so the
           runner spans the rail and carries the dot at its top edge. */
        "rail-travel": {
          "0%": { transform: "translateY(0%)", opacity: "0" },
          "8%": { opacity: "1" },
          "92%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },

        /* The ticker renders its payload twice; -50% lands the second copy
           exactly where the first began, so the loop has no seam. */
        marquee: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        /* A readout line sweeping down a panel, as on a monitoring console.
           The animated element is full height with the rule along its top
           edge, so 0% to 100% carries the rule from the top of the panel to
           the bottom of it. */
        "scan-line": {
          "0%": { transform: "translateY(0%)", opacity: "0" },
          "10%": { opacity: "1" },
          "88%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        /* Highlight running the length of an underline rule. */
        "trace-x": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(300%)" },
        },
        "caret-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        /* Expanding ring, used where something has just gone live. */
        "ring-out": {
          "0%": { transform: "scale(0.6)", opacity: "0.55" },
          "100%": { transform: "scale(2.1)", opacity: "0" },
        },
        "drift-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        /* Sweeps a light band across gradient-clipped text. */
        "shimmer-text": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "cue-fall": {
          "0%": { transform: "translateY(-4px)", opacity: "0" },
          "35%": { opacity: "1" },
          "100%": { transform: "translateY(9px)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
