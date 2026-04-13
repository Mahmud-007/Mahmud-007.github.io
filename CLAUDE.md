# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site for Mahmudur Rahman — backend-focused full-stack engineer. Built with Gatsby 5, React 18, TypeScript, and Tailwind CSS 4.

Deployed to GitHub Pages (gh-pages) and Netlify. Site URL: https://Mahmud-007.github.io

## Commands

- `npm run develop` — Start dev server (Gatsby develop, default port 8000)
- `npm run build` — Production build (outputs to `public/`)
- `npm run serve` — Serve production build locally
- `npm run deploy` — Build + deploy to GitHub Pages via gh-pages

No test suite or linter configured.

## Architecture

**Gatsby static site** — single-page portfolio with section-based components. Two pages exist:

- `src/pages/index.tsx` — Main portfolio (Hero, About, Experience, Projects, Skills, SkillsGlobe3D, Blog, Speaking, Contact)
- `src/pages/ontenet.tsx` — Standalone page showcasing SkillsGlobe3D in isolation

**Component pattern**: Each section is a standalone component in `src/components/`. Data-driven sections pull from JSON files in `src/data/`.

**Data files** (`src/data/`):
- `experience.json`, `projects.json`, `articles.json` — Structured content arrays
- `skills.json` — Category-keyed skill map (used by both Skills and SkillsGlobe3D)

**SkillsGlobe3D** (`src/components/SkillsGlobe3D.tsx`): Interactive 3D skills visualization using `@react-three/fiber` and `@react-three/drei`. Uses `isBrowser` check for Gatsby SSR compatibility. Renders orbiting category spheres on a torus ring with click-to-select detail sidebar.

**Layout** (`src/components/Layout.tsx`): Wraps all pages. Fixed nav with section anchor links + resume PDF link (`/Mahmudur_Rahman.pdf` in `static/`). Footer.

## Styling

- **Tailwind CSS 4** via `@tailwindcss/postcss` plugin (not classic `tailwindcss` CLI)
- Theme tokens defined in `src/styles/global.css` using `@theme {}` block (Tailwind v4 syntax)
- Legacy `tailwind.config.js` also exists with same color/font values (v3-style config)
- Custom color palette: `navy-900/800/700`, `slate-light/lightest`, `teal`, `orange-soft`
- Fonts: Inter (sans), Roboto Mono (mono) — loaded in `gatsby-browser.tsx` via `@fontsource`

## Gatsby Config

- `gatsby-config.ts` — TypeScript config with `graphqlTypegen: true`
- Plugins: postcss, image optimization (sharp), filesystem sources for `src/images/` and `src/data/`, PWA manifest
- `gatsby-browser.tsx` — Imports global CSS and fonts

## Key Dependencies

- `framer-motion` — Animations
- `@react-three/fiber` + `@react-three/drei` — 3D rendering (SkillsGlobe3D)
- `react-icons` — Icon library
- `clsx` + `tailwind-merge` — Conditional class utilities
- `gatsby-plugin-image` + `gatsby-plugin-sharp` — Optimized images via `<StaticImage>`
