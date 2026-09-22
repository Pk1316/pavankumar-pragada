import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * A relative base makes every generated asset URL relative to the page that
 * loads it (`./assets/...` rather than `/assets/...`), so the same `dist/`
 * works unchanged from the domain root, from a GitHub Pages project path such
 * as `/<repo>/`, and from `npm run preview` — no rebuild between them.
 *
 * `dist/index.html` still has to be served over http to render. Opening it
 * from disk leaves it blank whatever the base is set to, because browsers
 * block ES module scripts on `file://` origins. Use `npm run preview`.
 *
 * This was previously pinned to `/<repo>/` for `command === 'build'` only.
 * `vite preview` reports `command === 'serve'`, so it mounted `dist/` at `/`
 * while the HTML inside it still asked for `/<repo>/assets/...`. Those
 * requests fell through to the SPA fallback, the module script came back as
 * `text/html`, the browser refused to execute it, and the page stayed blank.
 * Deriving the base from `command` reintroduces that mismatch — leave it
 * unconditional.
 *
 * This is safe because the site is a single page with in-page anchor links and
 * no client-side router. If nested routes are ever added, relative URLs break
 * on deep paths and the base must become the absolute `/<repo>/` prefix, with
 * preview and deploy both serving from it.
 */
export default defineConfig({
  plugins: [react()],
  base: './',
})
