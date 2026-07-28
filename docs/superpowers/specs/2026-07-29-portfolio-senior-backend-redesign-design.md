# Portfolio Redesign — Senior Backend Positioning

**Date:** 2026-07-29
**Goal:** Reposition Mahmudur Rahman's portfolio so it reads as a backend engineer who *owns systems in production* — aligned with a senior backend JD (scale, bottlenecks, trade-offs, production ownership, AI-assisted development) — without abandoning existing work. Prioritize senior-signal content and an uncommon UI that does not read as a generic template.

## Direction

**Hybrid aesthetic:** terminal / systems-log as the *chrome* (hero, nav, section labels, contact, AI strip); editorial / case-study styling as the *content* (experience, projects, blog, speaking). One design system bridges them so it reads as intentional, not two sites glued together.

**Positioning:** Title stays "Software Engineer" (matches resume, honest). Seniority is argued by the work and framing, not a label. Hero tagline carries the theme: **"I own systems in production, not just features."**

## Design System

- **Palette:** Keep navy/teal DNA. Add:
  - Terminal surface: existing `navy-900` dark, mono type, `teal` + a green status accent (`#3fb950`-ish, add as `status-green` token).
  - Editorial surface: a warmer/softer dark card surface (slightly lifted from navy-900, e.g. a `content-surface` token) to visually separate content from chrome. Stays dark-mode overall — not stark white.
- **Type:** Roboto Mono for chrome, labels, metrics, stack tags. Inter for prose and headings. Both already loaded via `@fontsource` in `gatsby-browser.tsx`.
- **Tokens:** Add `status-green` and `content-surface` to `src/styles/global.css` `@theme {}` block (Tailwind v4). Mirror in `tailwind.config.js` for consistency.

## Section Structure (order)

1. **Hero** — terminal. `whoami` prints name + role ("Software Engineer") + tagline. `systemctl status impact` prints metric tiles. Two CTAs (code / contact). Blinking cursor invites scroll.
2. **About** — editorial. Rewritten for ownership, scale, production accountability.
3. **Experience** — editorial compact cards. Company-grouped (as today). Each highlight = outcome-led line + a one-line bottleneck/trade-off where it applies + stack tags.
4. **Projects** — editorial compact cards. Add Adaptive Restaurant Forecasting Engine (4 total).
5. **Skills** — grouped list. **SkillsGlobe3D removed.** Reordered to lead with backend/distributed.
6. **How I Work With AI** — NEW terminal-styled strip. Directly answers the JD's "AI-Assisted Development (Required)" section.
7. **Blog** — kept, editorial.
8. **Speaking** — kept, editorial. Lead with DMEXCO.
9. **Contact** — terminal, reframed as a CLI prompt.

## Removals

- `src/components/SkillsGlobe3D.tsx` — cut entirely (already deleted in working tree; make permanent).
- `src/pages/ontenet.tsx` — cut (only existed to showcase the globe; already deleted in working tree).
- Remove `@react-three/fiber` + `@react-three/drei` imports/usage. Dependencies may stay in `package.json` or be pruned (pruning is optional cleanup, not required).
- Update `CLAUDE.md` to drop SkillsGlobe3D / ontenet references.

## Content Rewrites

Source of truth: latest resumes (`Mahmudur_Rahman_Craftsmen.pdf`, `Mahmudur_Rahman.pdf`). Data lives in `src/data/*.json`.

### Hero metric tiles (pick 4)
- `70%` cache hit rate
- `32.4%` MAU growth
- `<100ms` semantic search retrieval
- `26+` publisher integrations (or `30m→2m` automation)

### About (new copy, senior framing)
Backend-focused engineer (~4 yrs) who owns services end-to-end — design, deploy, monitor, and keep stable under real production traffic. Emphasis: distributed systems, fault tolerance, measurable performance/cost wins, and using AI tools to move faster without outsourcing reasoning. Replace generic "serve millions" bullets with ownership/trade-off framing.

### Experience — FConnect (FootyLight), compact cards (reframed from resume)
Each: **outcome headline** · *one-line bottleneck/trade-off* · stack tags.
1. **Storylens** — Event-driven AI backend, articles → visual summaries; semantic prompt caching → **70% hit rate, sub-second p50, 300%+ ROI.** *Bottleneck: every article re-ran the full LLM pipeline. Trade-off: accept eventual staleness for latency + cost.*
2. **High-throughput microservices** — 4 core services, low-latency football content at high concurrency, strict SLAs → **32.4% MAU growth.**
3. **Data-pipeline fault tolerance** — 10 parsers (ELK on AWS ECS + Lambda); async queuing + exponential backoff → **eliminated dropped feeds** during peak bursts.
4. **Publisher API integration** — 26+ international publishers, high-volume widget delivery; in-image widget architecture **presented at DMEXCO.**
5. **Banglapapers semantic search** — AI news platform, 10+ feeds, OpenSearch semantic indexing → **sub-100ms retrieval.**
6. **SocialDesk** — automated content-processing + image-generation pipeline; article scraping + automated workflow → **0 manual dev cycle.**
7. **Internal ops automation (Widget Builder)** — non-engineer widget generation **30 min → <2 min.**
8. **Observability dashboard** — central monitoring: API health, ad delivery, cost across **7 core metrics**, daily reports.

InfancyIT (Trainee) — keep single compact item.

### Projects (4)
- Swapnanagar — charity platform (keep).
- FootyLight app (keep).
- Hyperledger Fabric Management System (keep).
- **Adaptive Restaurant Forecasting Engine** (add) — AI POC forecasting demand/staffing/inventory with feedback loops. Stack: FastAPI, Python, LightGBM, SGDRegressor, Streamlit, React.

### Skills (grouped, globe removed)
- **Backend & Distributed Systems:** Node.js, Express.js, FastAPI, Python, Go, Microservices, Event-Driven Architecture, Caching, Fault Tolerance, REST, GraphQL
- **Cloud, DevOps & Observability:** AWS (Lambda, ECS, S3, API Gateway, Route53, CloudFront), Docker, CI/CD (GitHub Actions), ELK Stack
- **Databases & Data Stores:** DynamoDB, MongoDB, MySQL, PostgreSQL, Redis, OpenSearch, Pinecone, Firebase
- **AI Tools & Workflows:** Claude Code, Cursor, Codex, OpenCode, LangChain, RAG, MCP
- **Frontend:** React, Next.js, React Native, TypeScript, JavaScript, Redux, Tailwind, Material-UI

### How I Work With AI (new section content)
Terminal strip. Lines:
- `iterate & prototype faster`
- `debug & explore edge cases`
- `evaluate architecture & implementation options`
- One line on verification: *critically review AI output, verify correctness before production — never outsource core reasoning or system design.*
Tools row: Claude Code · Cursor · Codex · OpenCode.

## Components Affected

- `src/components/Hero.tsx` — rebuild as terminal hero (drop the round profile-image layout, or restyle it into the terminal frame). Add metric tiles.
- `src/components/About.tsx` — new copy + editorial styling.
- `src/components/Experience.tsx` — editorial compact card styling; consume reframed `experience.json`.
- `src/components/Projects.tsx` — editorial compact cards; consume updated `projects.json`.
- `src/components/Skills.tsx` — grouped list, remove any globe reference; consume reordered `skills.json`.
- **New** `src/components/AiWorkflow.tsx` — the AI strip.
- `src/components/Blog.tsx`, `Speaking.tsx` — editorial restyle, content-preserving.
- `src/components/Contact.tsx` — terminal CLI-prompt restyle.
- `src/components/Layout.tsx` — nav updated (add "AI" or reorder anchors; remove any ontenet/globe link).
- `src/pages/index.tsx` — remove `SkillsGlobe3D`, add `AiWorkflow`, keep new order.
- `src/data/experience.json`, `projects.json`, `skills.json` — rewritten per above.
- `src/styles/global.css` + `tailwind.config.js` — new tokens.
- `CLAUDE.md` — update architecture notes.

## Non-Goals

- No new pages beyond removing `ontenet.tsx`.
- No long-form standalone case-study pages (compact only, per decision).
- No CMS / backend. Static Gatsby stays.
- No test suite added (none exists; out of scope).
- Deep dependency pruning is optional, not required.

## Success Criteria

- Site reads senior-backend: production ownership, bottlenecks/trade-offs, measurable wins, AI-assisted development are all visible above/near the fold and in content.
- Distinct look — terminal chrome + editorial content — not a recognizable template clone.
- All existing real content preserved (no fabricated claims); experience/projects reframed from the latest resume.
- Builds clean (`npm run build`), no dead SkillsGlobe3D/ontenet references, no WebGL dependency loaded at runtime.
