# Product-Minded Engineering Portfolio — Design

Date: 2026-08-31
Status: Approved (design), pending implementation plan
Repo: Mahmud-portfolio (Gatsby 5 / React 18 / TS / Tailwind 4)

## 1. Goal

Reposition https://mahmud-007.github.io from "backend engineer with a metrics list"
to "engineer who decides what is worth building."

The site must make a visitor conclude, without being told: this person owns
production systems, knows what they cost to run, knows how they fail, and can
name the business number that moved.

Explicit non-goal: entrepreneur / founder branding. No "I build startups"
framing, no product-launch language. The framing is engineering judgment
applied to business outcomes, not business ownership.
But this tone should be present on the portfolio indirectly

## 2. Positioning thesis

Four questions define the persona. Every case study answers all four, in the
same order, under the same headings:

1. Is this worth building?       -> decision
2. What does it cost?            -> engineering cost, run cost, timeline
3. What is the operational risk? -> failure modes, mitigations
4. What business outcome?        -> metrics with baselines and measurement method

The rigidity is the point. A visitor who reads two case studies learns the
format and can then skim the third for exactly the part they care about.

## 3. Constraints

- Static build, deployed to GitHub Pages (`gh-pages -d public`) and Netlify.
  No server, no runtime secrets, no database.
- No test suite and no linter exist. Verification is build plus browser.
- Existing identity is terminal/navy/teal with Roboto Mono. The user asked to
  KEEP the terminal identity, and to add "techy" motion and tech-logo animation.
- `framer-motion`, `react-icons`, `clsx`, `tailwind-merge` are already
  dependencies. Prefer them over new packages.
- Tailwind v4 `@theme` block in `src/styles/global.css` is the token source.
  Legacy `tailwind.config.js` exists with duplicate values.
- No number may be invented. Unknown values ship as the literal string `TODO`.

## 4. Architecture

### 4.1 Data layer — `src/data/`

Data is the contract. Components render it; they never hardcode content.

**`caseStudies.json` (new)** — array of 5 objects:
`domka`, `storylens`, `widget-builder`, `data-pipeline`, `banglapapers`.

```jsonc
{
  "slug": "storylens",
  "title": "Storylens",
  "category": "AI & LLM",            // one of the four Work categories
  "role": "Software Engineer — design, build, operate",
  "period": "2024 – present",
  "status": "In production",         // In production | Shipped | Personal product
  "oneLiner": "...",
  "stack": ["Node.js", "AWS Lambda"],

  "problem":  { "context": "...", "trigger": "..." },

  "decision": {
    "question": "Is this worth building?",
    "options": [                     // renders as DecisionTable
      { "name": "Do nothing",            "cost": "...", "risk": "...", "verdict": "rejected" },
      { "name": "Semantic prompt cache", "cost": "...", "risk": "...", "verdict": "chosen" }
    ],
    "chose": "...",
    "rejected": "...",
    "why": "..."
  },

  "cost": { "engineering": "...", "run": "...", "timeline": "..." },

  "risk": {
    "operational": "...",
    "failureModes": ["..."],
    "mitigations": ["..."]
  },

  "impact": {
    "metrics": [
      {
        "label": "cache hit rate",
        "value": "70%",
        "baseline": "0% (no cache)",
        "howMeasured": "..."
      }
    ],
    "businessOutcome": "..."
  },

  "architecture": { "steps": ["ingest", "embed", "cache lookup"] },
  "retro": "What I would do differently",
  "links": [{ "label": "Live", "url": "..." }]
}
```

Seed content:

- **domka** — personal product, AI-native newsroom automation. Only the
  one-liner and category are known. Every other field ships as `TODO`.
- **storylens** — from `experience.json`: 70% cache hit, 300%+ ROI,
  sub-second p50, staleness traded for latency and cost.
- **widget-builder** — 30m to under 2m, non-engineers ship without a dev cycle.
- **data-pipeline** — 10 parsers on ELK across ECS and Lambda, 0 dropped
  feeds, async queuing with exponential backoff.
- **banglapapers** — 10+ publisher feeds, OpenSearch semantic indexing,
  sub-100ms retrieval.

Existing metrics carry over verbatim. `baseline`, `howMeasured`, `cost.*`,
and `risk.*` are largely `TODO` — the user fills them before deploy.

**`projects.json` (extend)** — add `category`, optional `caseStudySlug`,
`year`, `status`, `metrics[]`. A project with a `caseStudySlug` renders a
"read case study" link; one without renders as a plain card.

The Work section renders `projects.json` as the single card list. Each of the
5 case studies gets a corresponding entry there (adding Domka, Storylens,
Widget Builder, Data Pipeline and Banglapapers alongside the 4 existing
projects), with `caseStudySlug` set. `caseStudies.json` holds only the deep
content for the `/work/<slug>` pages; it is never used to build the grid.
This keeps one ordering and one filter source rather than two lists that can
disagree.

**`principles.json` (new)** — the how-I-decide framework, 4 entries:

```jsonc
{
  "command": "./should-we-build-this",
  "title": "Is this worth building?",
  "body": "...",
  "evidence": "widget-builder"       // optional slug, links to a case study
}
```

**`profile.json` (new)** — single source for identity currently duplicated
across Hero, Contact and Layout: name, tagline, location, email, resume path,
`socials[]`, and `availability: { status: "Open to work", tone: "green" }`.
No role type and no employment-status claim beyond "Open to work", per the
user's explicit instruction.

**`github.json` (new)** — committed fallback snapshot matching the shape the
build-time fetch produces.

`articles.json`, `skills.json`, `certifications.json` and `experience.json`
keep their current shapes.

### 4.2 Build layer — `gatsby-node.ts` (new)

Two independent responsibilities:

1. **`createPages`** — reads `caseStudies.json`, creates `/work/<slug>` for
   each entry using `src/templates/CaseStudy.tsx`, passing the full object
   through `pageContext`. No GraphQL layer needed for this data.

2. **`sourceNodes`** — unauthenticated `fetch` against the GitHub public REST
   API for user `Mahmud-007`: profile, public repos (name, stars, primary
   language, `pushed_at`), aggregated language totals, and recent push
   activity. Creates a single `GithubStats` node.

   Failure handling is not optional: rate limit (60/hr per IP, and CI IPs are
   shared), network failure, or any non-200 response all fall back to
   `src/data/github.json` and log a warning. The build must never fail because
   GitHub was unavailable.

Data is frozen at build time. That is acceptable and is stated on the page
("as of <build date>") rather than hidden.

### 4.3 Component layer

Current `src/components/` is 11 flat files with real duplication: terminal
window chrome is copy-pasted in `Hero.tsx` and `AiWorkflow.tsx`, and the
`// section` heading markup is repeated in 7 components. Extracting these is
required by the work, not adjacent refactoring.

```
src/components/
  ui/           Terminal, SectionHeading, MetricStat, Tag, FilterChips,
                StatusPill, TypeLine, CountUp, TechMarquee
  sections/     Hero, Principles, Work, Experience, Skills, GitHubActivity,
                Writing, AiWorkflow, Credentials, Contact
  case-study/   DecisionTable, CostBlock, RiskBlock, ImpactStrip, ArchFlow
  layout/       Layout, Nav, Footer
src/templates/  CaseStudy.tsx
src/types/      index.ts        // shared interfaces, currently redeclared per component
```

Each `ui/` primitive takes props and imports no data. Each `sections/`
component imports exactly the data files it renders. This keeps every file
small enough to reason about and change in isolation.

`About.tsx` is deleted. Its positioning paragraph moves to Hero; its
highlights are stated better by Principles and Work.

`Speaking.tsx` and `Certifications.tsx` merge into `Credentials.tsx` — one
section, two columns. Both are supporting evidence; neither deserves a
full-width section between the reader and Contact.

### 4.4 Page structure — `src/pages/index.tsx`

```
Hero            terminal boot, availability pill, headline metrics
Principles      the four questions — positioning, placed before the proof
Work            filterable grid; case studies link to /work/<slug>
Experience      existing data, restyled only — no content edits
Skills          grouped, with animated tech-logo marquee
GitHubActivity  build-time stats, language bar, recent activity
Writing         articles
AiWorkflow      existing
Credentials     certifications and speaking, merged
Contact         availability, email, socials
```

Principles at position 2 is deliberate. The framework should be read before
the projects that demonstrate it, so the projects read as evidence rather than
as a list.

Work filter categories: `All`, `Backend & Distributed`, `AI & LLM`,
`Product`, `Tooling`.

### 4.5 Case study page — `/work/<slug>`

```
Terminal breadcrumb          cd ~/work/<slug>
Title, status, period, stack
ImpactStrip                  headline metrics, count-up on view
## The problem               problem.context + problem.trigger
## The decision              DecisionTable — option / cost / risk / verdict
## What it cost              engineering, run, timeline
## Operational risk          failure modes, mitigations
## Impact                    metrics with baseline and how measured, then outcome
## Architecture              ArchFlow — terminal-styled pipeline steps
## What I'd do differently   retro
Links, and prev/next case study
```

Head: per-page `<title>` and meta description drawn from the case study, so
each page is independently shareable and indexable.

## 5. TODO discipline

Any unknown value is the literal string `"TODO"`.

- A shared `isTodo()` helper detects it.
- In `gatsby develop`, a `TODO` renders as a visible amber badge.
- In `gatsby build` (production), a field whose value is `TODO` is omitted
  entirely, and a block hides when all of its fields are `TODO`.

Consequence: the site is deployable at any point and never displays an
invented or placeholder number, while the user can see exactly what is
outstanding in dev.

## 6. Motion

Uses the existing `framer-motion` dependency. All motion respects
`prefers-reduced-motion` through a `useReducedMotion` gate; when reduced,
elements render in their final state with no transition.

- Hero: sequential typewriter for the prompt lines, then staggered metric
  cards. The existing blinking cursor is retained.
- Section reveal: `whileInView` fade plus 12px rise, `once: true`, 300ms.
- Metric numbers: count-up on first view, parsed from the value string so
  `70%`, `<100ms` and `30m→2m` degrade gracefully to a plain render when the
  value does not start with a number.
- Tech marquee: `react-icons/si` logos, CSS infinite translate, pause on
  hover, duplicated track for a seamless loop.
- Work filter: framer-motion `layout` on the grid so cards animate position on
  filter change.

Motion is signature, not decoration. No parallax, no scroll-jacking, and no
entrance animation on text the reader is trying to read.

## 7. Styling

The terminal identity is retained across the whole site, not reduced to the
hero. New tokens are added to the `@theme` block in `src/styles/global.css`:
an amber for TODO badges, a muted grid/rule color, and marquee plus typewriter
keyframes. `tailwind.config.js` is updated in step so the two files do not
drift further apart.

## 8. Verification

There is no test suite, so verification is empirical and must be run, not
assumed:

1. `npm run build` completes clean — no errors, no new warnings.
2. Browser preview of `/` — console clean, network clean.
3. Browser preview of all 5 `/work/<slug>` routes.
4. Filter interaction exercised on the Work section.
5. Mobile viewport (375px) checked on `/` and on one case study.
6. Build re-run with the GitHub API unreachable, proving the `github.json`
   fallback works and the build still succeeds.
7. Screenshots shared as proof.

## 9. Risks

- **Build-time GitHub fetch** — rate limits on shared CI IPs. Mitigated by the
  mandatory fallback in 4.2; verification item 6 tests it explicitly.
- **Data staleness** — GitHub stats freeze at build. Mitigated by labelling the
  section with the build date rather than implying it is live.
- **Scope of the component split** — moving 11 files at once can break imports
  silently. Mitigated by landing the split as its own step, verified by a clean
  build, before any new sections are written.
- **Tailwind v4 / v3 config duplication** — pre-existing. Kept in sync here;
  consolidating it is out of scope.

## 10. Out of scope

- CMS or MDX authoring pipeline.
- Hosting blog posts (articles stay external links).
- Dark/light theme toggle — the site is dark by identity.
- Analytics, comments, newsletter.
- Consolidating `tailwind.config.js` into `global.css`.
