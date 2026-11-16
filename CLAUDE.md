# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal-brand hub for Mahmudur Rahman: work, products, videos, writing and certificates in one place. Built with Gatsby 5, React 18, TypeScript, and Tailwind CSS 4. The look is "Newsprint, press blue": white newsprint, black ink, one printer's-blue accent, condensed newspaper headlines.

Deployed to GitHub Pages and Netlify. Site URL: https://mahmudurrahman.tech (custom domain; `static/CNAME` must stay, or each deploy drops the domain). The old https://mahmud-007.github.io address redirects to it.

Design doc: `docs/superpowers/specs/2026-11-15-newsprint-brand-hub-design.md`

## Commands

- `npm run develop` — Start dev server (default port 8000)
- `npm run build` — Production build (outputs to `public/`)
- `npm run serve` — Serve the production build locally
- `npm test` — Unit tests for the pure helpers in `src/utils/` (Node's built-in runner)
- `npm run check:copy` — Fails if built pages in `public/` contain banned self-labelling copy. Run after `npm run build`.
- `npm run deploy` — Build and publish to GitHub Pages

## Branches

- Source lives on `main`. Open pull requests against `main`.
- `gh-pages` holds only compiled output written by `npm run deploy`. Never commit source to it or open a PR against it.

## Copy rules (important)

The work is the headline. The site never labels its owner.

- The masthead carries the name only. No role, no tagline.
- Never write "AI engineer", "AI-Native", "N years of experience", or adjectives about the person. The list lives in `src/utils/copy.ts` (`BANNED`) and is mirrored in `scripts/check-copy.mjs`.
- Describe the thing, not the person: "How one article becomes visuals, summaries and polls".
- Own-initiative work is "Products". Never "startup" or "founder".
- No invented numbers or claims. Unknown values are the literal string `TODO`: shown as an amber badge in `gatsby develop`, omitted from production builds (`src/utils/todo.ts`).

## Architecture

Pages:

- `src/pages/index.tsx` — Front page: Work, Products, Videos, Writing, Certificates, Experience, Contact
- `src/templates/CaseStudy.tsx` — `/work/<slug>/`, one per entry in `caseStudies.json` (created in `gatsby-node.ts`)
- `src/pages/videos.tsx`, `writing.tsx`, `certificates.tsx` — full lists

Components (`src/components/`):

- `layout/` — `Layout` (sticky masthead column from `lg` up; masthead on top plus sticky `SectionBar` below), `Masthead`, `sections.ts` (the nav list)
- `sections/` — one file per front-page section. Each imports the data it renders.
- `ui/` — props-only primitives: `Rule`, `SectionHead`, `Dateline`, `StoryRow`, `MoreLink`, `Tag`, `PressPhoto`, `PipelineDiagram`, `VideoCard`, `CertificateCard`
- `case-study/` — blocks of a case-study page

Data (`src/data/`) is the content contract; components do not hardcode content:

- `profile.json` — name, location, availability, socials, YouTube handle and channel id
- `projects.json` — rows for Work and Products (`category: "Product"` goes to Products)
- `caseStudies.json` — deep content for `/work/<slug>/`. Steps written as objects with `does`/`costs`/`fails` notes render as the interactive pipeline diagram ("How it works") on that case study; plain strings render as a numbered list.
- `experience.json`, `articles.json`, `certifications.json`
- `videos.json` — committed fallback snapshot of the YouTube feed

Pure helpers (`src/utils/`), covered by `tests/`: `pipeline.ts`, `youtube.ts`, `copy.ts`. They import nothing so `node --test` can load them directly; keep them that way.

## Videos

Two layers:

1. Build time: `gatsby-node.ts` reads the channel's public RSS feed and creates `Video` nodes. Any failure falls back to `src/data/videos.json`; the build never fails because of YouTube.
2. Page load: `src/hooks/useVideos.ts` asks the YouTube Data API for a fresher list and channel stats when `GATSBY_YOUTUBE_API_KEY` is set. Any failure keeps the build-time list. Setup steps: `docs/youtube-api-key.md`.

With zero videos the Videos section and its nav link disappear (`src/hooks/useHiddenSections.ts`).

## Certificates

Add an entry to `certifications.json`. To show the certificate itself, put the image in `src/images/certificates/` and set `image` to its file name. An entry without an image renders as a text row.

## Styling

- Tailwind CSS 4 via `@tailwindcss/postcss`. Tokens live in the `@theme` block of `src/styles/global.css`; `tailwind.config.js` mirrors them.
- Colours: `paper` #fafaf8, `paper-dark`, `ink` #111214, `ink-soft`, `accent` #1d3fd6 (printer's blue). One accent element per screenful; never a large background. No cream and no orange: they read as AI-generated.
- Fonts (loaded in `gatsby-browser.tsx` via `@fontsource`): Archivo variable at 62% width (`font-display`, condensed headlines), Source Serif 4 (`font-body`), IBM Plex Mono (`font-mono`, numbers only). No spaced-out uppercase mono labels.
- Rules and columns separate content. No rounded cards, no drop shadows. Light theme only.
- No scroll fade-ins. The pipeline diagram is the only animated element, and it respects `prefers-reduced-motion`.
