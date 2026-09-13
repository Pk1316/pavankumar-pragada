import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * GitHub Pages serves a project site from `/<repo>/`, not from the domain
 * root, so the built asset URLs have to carry that prefix. It is applied to
 * the build only: leaving it off in dev keeps `npm run dev` on plain
 * `http://localhost:5173/` instead of a nested path.
 *
 * If this is ever moved to a custom domain or a user site, set `base` back to
 * `'/'` and the built HTML will reference assets from the root again.
 */
const REPO_BASE = '/pavankumar-pragada/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? REPO_BASE : '/',
}))
