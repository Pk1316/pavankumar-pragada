# Running the Pavan Portfolio

A single-page portfolio site built with **Vite 8 + React 19 + TypeScript + Tailwind CSS 3**.
No backend, no database, no environment variables. It is a fully static front-end app.

Verified working on Windows 11 with Node v24.21.0 / npm 11.19.0 on 2026-09-11.

---

## Prerequisites

| Requirement | Version used | Notes |
|---|---|---|
| Node.js | v24.21.0 | Vite 8 requires Node 20.19+ / 22.12+ |
| npm | 11.19.0 | Ships with Node |

Check yours:

```bash
node -v
npm -v
```

---

## First-time setup

From the project root (`C:\Users\Admin\Desktop\pavan`):

```bash
npm install
```

`node_modules/` is already present in this copy, so you can skip this unless you
deleted it or `package.json` changed.

---

## Run it (development)

```bash
npm run dev
```

Then open **http://localhost:5173/** in a browser.

Vite prints the URL when it is ready:

```
  VITE v8.2.2  ready in 1036 ms

  ➜  Local:   http://localhost:5173/
```

Hot Module Replacement is on. Save any file under `src/` and the page updates
without a reload.

**To pin the host and port** (useful if 5173 is taken):

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

Stop the server with `Ctrl+C`.

---

## Build for production

```bash
npm run build
```

This runs `tsc -b` (type-check) then `vite build`. Output lands in `dist/`.

Expected result:

```
dist/index.html                           2.11 kB │ gzip:   0.82 kB
dist/assets/portrait-560-*.webp          87.34 kB
dist/assets/portrait-941-*.webp         174.17 kB
dist/assets/index-*.css                  46.86 kB │ gzip:   9.08 kB
dist/assets/index-*.js                  486.48 kB │ gzip: 150.14 kB
✓ built in ~10s
```

If `tsc -b` reports type errors the build stops before Vite runs. Fix the types
first; `dist/` is not updated.

---

## Preview the production build

```bash
npm run preview
```

Serves `dist/` at **http://localhost:4173/**. Use this to check the real built
output (minified, hashed assets) rather than the dev server.

Run `npm run build` first. Preview serves whatever is currently in `dist/`,
which may be stale.

---

## Lint

```bash
npm run lint
```

Uses [Oxlint](https://oxc.rs) (config in `.oxlintrc.json`).

Currently reports **warnings only, no errors**. Most are
`react(only-export-components)` in `src/components/viz/*` and a few other files
that export helper constants alongside components, which only affects Fast
Refresh granularity, plus some `react(set-state-in-effect)` warnings in hooks
that drive timers and observers. None of these block the build.

---

## All scripts at a glance

| Command | What it does | URL |
|---|---|---|
| `npm run dev` | Dev server with HMR | http://localhost:5173/ |
| `npm run build` | Type-check + production build to `dist/` | none |
| `npm run preview` | Serve the built `dist/` | http://localhost:4173/ |
| `npm run lint` | Oxlint over the source | none |

---

## How the page behaves

### Motion tiers

`src/hooks/useMotionTier.ts` decides how much motion a visitor gets, and every
animated component reads from it. There are three tiers:

| Tier | Who gets it | What runs |
|---|---|---|
| `none` | `prefers-reduced-motion: reduce` | Nothing decorative. Every element renders in its final state. |
| `lite` | Phones, and low-power touch devices | Scroll reveals and hover states. No continuous background loops. |
| `full` | Desktop | Everything, including the canvas node field, diagram packets and the cursor ring. |

The tier is read through `useSyncExternalStore`, so it is correct on the first
paint and re-evaluates live when the OS motion setting changes or a phone is
rotated.

Continuous animations are additionally gated on visibility: diagrams mount their
moving parts only while on screen (`useInViewOnce` with `repeat: true`), and the
background canvas suspends its animation frame loop whenever the tab is hidden.

### Keyboard

| Key | Does |
|---|---|
| `Ctrl`/`Cmd` + `K` | Open or close the command palette |
| `/` | Open the command palette |
| Up / Down | Move through palette results |
| `Enter` | Jump to the selected section, or open the selected profile |
| `Esc` | Close the palette, the mobile menu or a case study |
| `Tab` | Focus is trapped inside the palette, the mobile menu and case studies |

### The intro

The page opens with a short panel showing the pipeline stages coming online,
then wipes upward and hands the hero its entrance. It runs **once per browser
tab** and is skipped entirely when:

- the visitor has `prefers-reduced-motion: reduce` set,
- the URL carries a section hash such as `#projects`, since arriving there means
  the visitor asked for that content rather than a title card, or
- `?noboot` is in the query string, which is there for working on the page
  without sitting through the intro on every reload.

Any key, click or scroll cuts it short. The hero never waits on a signal from
the panel; it holds for a fixed delay and then sets on its own, so nothing that
happens in the intro can leave the hero blank.

To see it again in the same tab, clear the session key:

```js
sessionStorage.removeItem("pp-boot-done");
```

---

## Project layout

```
pavan/
├── index.html              # HTML shell, SEO + Open Graph meta tags
├── vite.config.ts          # Vite config (just the React plugin)
├── tailwind.config.js      # Design tokens: colors, fonts, animations
├── postcss.config.js       # Tailwind + autoprefixer
├── tsconfig*.json          # TS project references (app / node)
├── .oxlintrc.json          # Lint rules
├── dist/                   # Build output (generated, gitignored)
└── src/
    ├── main.tsx            # React entry point
    ├── App.tsx             # Root component
    ├── assets/             # Portrait images (.webp, 560px + 941px)
    ├── components/         # Reusable UI (Navbar, timelines, cards, ...)
    │   │                   #   BootSequence  - the one-per-tab intro panel
    │   │                   #   CommandPalette- Ctrl/Cmd+K navigation
    │   │                   #   CursorProbe   - trailing ring on fine pointers
    │   │                   #   SectionNav    - edge navigator, xl and up
    │   │                   #   SignalTicker  - drifting stack band
    │   └── viz/            # Visualization pieces (hero backdrop, diagrams)
    ├── data/               # Static content the page renders
    ├── hooks/              # Custom hooks (useMotionTier, useInViewOnce, ...)
    ├── pages/
    ├── sections/           # Page sections (Hero, About, Projects, ...)
    ├── styles/             # Global CSS / Tailwind layers
    └── utils/
```

To change the content of the site (job history, projects, skills), start in
`src/data/`. The section components read from there.

---

## Troubleshooting

**Port already in use.** Vite normally picks the next free port and prints it.
To force a specific one:

```bash
npm run dev -- --port 3000
```

**Blank page below the hero.** Expected on first paint. Sections reveal on
scroll through `Reveal` and `useInViewOnce`. Scroll down and they appear.

**Wholly blank page after `npm run build`, with no error anywhere.** The build
succeeded and the assets are missing at the URL the HTML asks for. Open the
browser console: `Failed to load module script ... MIME type of "text/html"`
means the request fell through to the SPA fallback. Check that the `src` in
`dist/index.html` is relative (`./assets/...`) and that `base` in
`vite.config.ts` is `'./'` and not conditional on `command` — see
[The base path](#the-base-path). Serving `dist/index.html` from the filesystem
rather than over http produces the same blank page; use `npm run preview`.

**Stale build in preview.** Run `npm run build` again. `npm run preview` never
rebuilds on its own.

**Dependency errors after pulling changes.** Delete and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

**Type errors only during build, not dev.** The dev server does not type-check
(esbuild strips types). `npm run build` runs `tsc -b`, which does. Run the build
before you consider a change finished.

---

## Deploying

The site deploys to **GitHub Pages** automatically. Pushing to `main` triggers
`.github/workflows/deploy.yml`, which installs from the lockfile, lints,
type-checks, builds, and publishes `dist/`.

Live URL: **https://pk1316.github.io/pavankumar-pragada/**

Nothing has to be enabled by hand. The workflow's `configure-pages` step turns
Pages on for the repository the first time it runs, and sets the source to
GitHub Actions.

To redeploy without changing anything, open the repository's **Actions** tab,
pick **Deploy to GitHub Pages**, and use **Run workflow**.

### The base path

Pages serves a project site from `/<repo>/` rather than the domain root, so
asset URLs cannot assume the root. `vite.config.ts` sets `base` to `'./'`, which
makes every generated URL relative to the page that loads it. The same `dist/`
then works from the Pages subpath, from a domain root, and from
`npm run preview`, with no rebuild in between. `npm run dev` and
`npm run preview` both stay on the plain roots listed above.

Do not make `base` conditional on Vite's `command`. `vite preview` reports
`command === 'serve'`, not `'build'`, so a build-only base leaves preview
serving `dist/` at `/` while the HTML inside it asks for `/<repo>/assets/...`.
Those requests miss, fall through to the SPA fallback, and the module script
arrives as `text/html`, which the browser refuses to execute. The page then
renders blank with no build error and nothing in the terminal.

`dist/index.html` has to be served over http either way. Opening it straight
off disk stays blank whatever the base is, because browsers block ES module
scripts on `file://` origins. Use `npm run preview`.

Moving to a custom domain or a `<user>.github.io` repository needs no change.
Adding a client-side router does: relative URLs break on nested paths, so
`base` would have to become the absolute `/pavankumar-pragada/` prefix, applied
unconditionally.

### Hosting it somewhere else

The build is fully static, so `dist/` also drops onto Netlify, Vercel,
Cloudflare Pages, S3 or nginx. Build command `npm run build`, output directory
`dist`. The relative base means no config change is needed, whether the host
serves from a domain root or from a subpath.
- **Node version:** 20.19+ (24.x used here)

Since the app is a single page with in-page anchor navigation, no SPA rewrite
rule is required.
