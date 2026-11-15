# Newsprint Personal-Brand Hub — Design

Date: 2026-11-15
Status: Draft, awaiting approval
Repo: Mahmud-portfolio (Gatsby 5 / React 18 / TS / Tailwind 4)
Supersedes the visual identity of `2026-08-31-product-minded-portfolio-design.md`.
Keeps that doc's data layer, case-study structure and TODO discipline.

## 1. Intent

Turn the portfolio from a resume page into a personal-brand hub: one place
where the work, the writing, the YouTube videos and the certificates live.

Why now: Mahmudur is switching company and role, toward an AI-first tech
company (remote or Bangladesh). He is also building a public presence through
blogs and YouTube. The reader who matters most is someone at an AI-first
company deciding whether this person is worth a conversation.

The previous look (navy, teal, mono labels, rounded cards) read as generic and
AI-built. The site must look like a person with a point of view made it.

## 2. Goals, non-goals, anti-goals

Goals
- A visitor can tell within ten seconds what this person builds, from the work
  itself.
- Videos, writing and certificates are first-class sections, not footnotes.
- The look is recognisably his and does not resemble the common dark developer
  portfolio.
- One memorable interactive moment that is about a real system he built.

Non-goals
- Automatic sync with LinkedIn. LinkedIn content is copied in once, by hand.
- A CMS, MDX pipeline, or hosting blog posts on the site.
- Dark theme. The site is light by identity.
- 3D / WebGL scenes.

Anti-goals (the site fails if it does these, even if it works)
- Self-labelling copy. No "I am an AI engineer", no "5 years of experience",
  no adjectives about himself. This is the user's explicit instruction.
- Looking pushy or like a sales page.
- Any invented number, title, or claim.
- Empty or stale-looking sections.

## 3. Copy principle: the work is the headline

A newspaper front page does not open with a biography of its editor. It opens
with the lead story. The site follows that rule.

- The masthead carries only the name. No role tagline under it.
- The lead story is a piece of work (the signature piece, section 6), with a
  headline about what the system does.
- Role and employer appear only as plain facts where a fact is expected: the
  Experience list ("Software Engineer, FConnect, April 2022 – present") and
  the resume PDF.
- "Open to work" stays, as one small line in the masthead rule. It is a fact
  the target reader needs, not a claim. (Designer's call; remove if the user
  finds it pushy.)
- Section copy describes the thing, not the person. "How one article becomes
  visuals, summaries and polls", not "I architected an AI layer".
- Metrics are allowed because they are facts about systems. Each keeps its
  source in `caseStudies.json`.
- Final wording of every headline is the user's. The builder drafts in this
  voice; the user edits.

`profile.json` fields `tagline` and `intro` are removed or rewritten to follow
this rule. The current values ("AI-Native Software Engineer — Shipping...",
"~4 years owning systems...") must not render anywhere.

## 4. Approaches considered

Layout
- A. Editorial hub: identity fixed on one side, content scrolling on the
  other, plus one interactive signature piece. **Chosen by the user.**
  Scannable, content-first, low build risk.
- B. Live bento dashboard: everything as tiles. Rejected: no reading order,
  and looks stale when content cadence slows.
- C. Immersive 3D (Lusion / Bruno Simon style). Rejected: weeks of work, heavy
  on phones, hides content, signals "creative developer".

Skin
- Newsprint: paper, ink, one red, serif headlines. **Chosen by the user.**
  The idea comes from his career in news technology.
- Signal (black, acid lime, poster type). Rejected: reads influencer.
- Delta (green, marigold, terracotta). Rejected: softest of the three.

## 5. Visual system

Tokens replace the navy/teal set in the `@theme` block of
`src/styles/global.css`. `tailwind.config.js` is updated to match, as before.

| Token | Value | Use |
|---|---|---|
| paper | `#f3efe6` | page background |
| paper-dark | `#e8e2d4` | alternate bands, image wells |
| ink | `#1a1814` | text, rules |
| ink-soft | `#5a554c` | secondary text |
| red | `#d7381e` | the single accent: links on hover, one highlight per view |

Rules for the accent: one red element per screenful. Red is never a
background for large areas.

Type (all via `@fontsource`, replacing Inter and Roboto Mono)
- Fraunces, weight 900 and 400 italic: masthead and headlines.
- Newsreader: body text and standfirsts.
- IBM Plex Mono: datelines, labels, metrics, the pipeline diagram.

Devices borrowed from print
- Double rule under the masthead; single hairline rules between stories.
  Rules and columns do the separating. No rounded cards, no drop shadows.
- Dateline row in mono caps: issue line, location, availability.
- Drop cap on the lead paragraph of long text only (case-study pages).
- Section names read as newspaper sections: Work, Products, Videos, Writing,
  Certificates, Experience.
- Photos are treated as press photos: greyscale with a CSS halftone/dot
  overlay, hairline border, mono caption underneath.

Motion (existing `framer-motion`, all gated on `prefers-reduced-motion`)
- Section reveal: fade plus small rise, once.
- Signature piece animation (section 6).
- Nothing else. No parallax, no scroll-jacking, no typewriter.

The terminal components (`Terminal`, `TypeLine`, `TechMarquee`) are retired
from the page. Delete them if nothing imports them after the rebuild.

## 6. Signature piece: the Storylens pipeline

An interactive diagram of a real system, placed as the lead story.

```
article in → embed → prompt cache → LLM → visuals · summaries · polls
```

- Built with SVG/HTML and framer-motion. No canvas or WebGL library.
- A dot (a "request") travels the pipeline on a loop. At the cache node it
  forks: most requests return early (cache hit), the rest continue to the LLM.
  The split reflects the real 70% hit rate from `caseStudies.json`.
- Hover or tap a node: a short note appears beside it with what the step
  does, what it costs, and how it fails. Text comes from the Storylens entry
  in `caseStudies.json` (`architecture`, `cost`, `risk`). Fields that are
  `TODO` are omitted in production, per the existing rule.
- Keyboard: nodes are focusable buttons; focus shows the same note.
- Reduced motion: static diagram, notes still work.
- Below the diagram: one link, "Read the full story", to `/work/storylens`.
- Mobile: the pipeline stacks vertically.

Data shape: `architecture.steps` for Storylens becomes an array of objects
`{ id, label, does, costs, fails }` instead of strings. `ArchFlow` is updated
to accept both shapes so other case studies keep working.

## 7. Site structure

```
/                    front page
/work/<slug>         case-study page (5, from caseStudies.json)
/videos              all videos
/writing             all articles
/certificates        all certificates, with images
```

Front page, desktop (two columns; the left one is sticky):

```
┌───────────────────┬──────────────────────────────────────────┐
│ MAHMUDUR          │ LEAD STORY   Storylens pipeline (sec. 6)  │
│ RAHMAN            ├──────────────────────────────────────────┤
│ ═════════════     │ WORK         rows: title, one line, metric│
│ Dhaka · Open to   │ PRODUCTS     Domka, Rizon, Swapnanagar…   │
│ work              │ VIDEOS       3 latest, link to /videos    │
│ [press photo]     │ WRITING      3 latest, link to /writing   │
│ Work              │ CERTIFICATES 3 latest, link to /certifi…  │
│ Products          │ EXPERIENCE   plain dated list             │
│ Videos …          │ CONTACT      email, socials, résumé       │
│ socials · résumé  │                                          │
└───────────────────┴──────────────────────────────────────────┘
```

Mobile: the left column collapses into a masthead at the top (name, rule,
dateline, small photo) and a sticky section bar. Content is one column.

Section notes
- Work: rows, not cards. Reads `projects.json` as today. A row with a
  `caseStudySlug` links to its page.
- Products: things he built on his own initiative (Domka, Rizon, Swapnanagar,
  TripCast, the restaurant forecasting POC). Framed as "Products", never as
  "startups" or "founder". Entries come from `projects.json` with
  `category: "Product"`.
- Skills: no standalone section and no logo marquee. Stack appears as mono
  tags on each work row and case study. A skills list remains in the resume.
- Speaking: folded into Experience as dated entries (DMEXCO showcase).
- Experience: short dated list. Detail lives in case studies.

Case-study pages keep the structure from the 2026-08-31 doc (problem,
decision, cost, risk, impact, architecture, retro), restyled as a newspaper
article: headline, standfirst, dateline, drop cap, pull-quote for the main
metric. `gatsby-node.ts` and `src/templates/CaseStudy.tsx` do not exist yet
and are built as part of this work; the `case-study/` components do exist and
are restyled.

## 8. Content sources

### 8.1 Videos (YouTube)

Two layers, so the section is never blank and is fresh when it can be.

1. Build time. `gatsby-node.ts` `sourceNodes` fetches the channel's public RSS
   feed (`https://www.youtube.com/feeds/videos.xml?channel_id=<id>`) and
   creates video nodes: id, title, published date, thumbnail URL, link. On any
   failure it falls back to committed `src/data/videos.json` and logs a
   warning. The build never fails because YouTube was unreachable. When the
   fetch succeeds, the builder may refresh `videos.json` by hand; the build
   does not write to the repo.
2. Page load. A `useYouTube` hook calls the YouTube Data API v3 from the
   browser: `playlistItems` for the uploads playlist (latest videos) and
   `channels?part=statistics` (subscriber, view and video counts). On success
   it replaces the build-time list and shows the counts. On any failure,
   missing key, or quota error it does nothing and the build-time list stays.
   Result is cached in `sessionStorage` for the session.

The RSS feed cannot be read from the browser (no CORS headers), which is why
the page-load layer uses the Data API.

Config
- `youtube.channelId` and `youtube.handle` in `profile.json`. The builder
  resolves the channel id once from the handle `@mahmudurrahman8104`.
- API key in env var `GATSBY_YOUTUBE_API_KEY`. The key ships in the page
  source by design. It must be restricted in Google Cloud to the YouTube Data
  API and to the site's HTTP referrers (`mahmud-007.github.io`, the Netlify
  domain, `localhost`). The user creates the key; the builder writes the
  steps. Without the key the site works on build-time data alone.

If the channel has fewer than three videos, the front-page section shows what
exists. If it has none, the section and the `/videos` page are hidden.

### 8.2 Writing

`articles.json` as today (external links to Medium). Optional stretch for the
builder: build-time fetch of the Medium RSS feed with the same fallback
pattern. Not required for approval.

### 8.3 Certificates and LinkedIn

One-time manual import. No scraping code ships.

- The user signs in to LinkedIn in the browser pane; the assistant reads the
  profile and copies certifications, courses, and any other detail worth
  having into the data files. Alternative: LinkedIn's data export.
- `certifications.json` gains `image` (path under `src/images/certificates/`)
  and a filled `link` (credential URL). Images are processed by
  `gatsby-plugin-image`.
- A certificate without an image renders as a text row, not an empty frame.
- `/certificates` shows all; the front page shows the latest three.

### 8.4 Photo

`src/images/profile.png` already exists and is used unless the user supplies
a better original. Treated per section 5. The LinkedIn photo is a fallback
source only; it is small.

### 8.5 Resume

`static/Mahmudur_Rahman.pdf` is replaced with the updated file from
`E:\Portfolio Materials\Mahmudur_Rahman.pdf`. `experience.json` and
`projects.json` are brought in line with it (SocialDesk, Master Dashboard,
First-Party Data, the restaurant forecasting POC are new).

## 9. Constraints

- Static build. GitHub Pages and Netlify. No server, no secrets beyond the
  referrer-restricted public key above.
- No test suite or linter. Verification is build plus browser.
- Data files remain the contract; components do not hardcode content.
- `TODO` discipline from the previous doc stays: visible amber badge in
  develop, omitted in production.
- New dependencies allowed: `@fontsource/fraunces`, `@fontsource/newsreader`,
  `@fontsource/ibm-plex-mono`. Nothing else without asking.

## 10. Branch and deploy

- New branch `redesign/newsprint`, cut from `redesign/product-minded` so the
  data layer and case-study components carry over.
- Pull request targets `main`. The `gh-pages` branch holds only compiled
  output written by `npm run deploy` and must never receive source commits.
- After merge, the user runs `npm run deploy` to publish.
- Stretch, not required: a GitHub Actions workflow that builds and deploys on
  push to `main` and on a daily schedule, to refresh the build-time video
  snapshot.

## 11. Verification

1. `npm run build` completes with no errors.
2. Browser: `/`, all five `/work/<slug>`, `/videos`, `/writing`,
   `/certificates`. Console and network clean.
3. Signature piece: hover, tap, keyboard focus, and reduced-motion all show
   node notes.
4. Videos: with a valid key, list and counts refresh on load. With no key, and
   with the API blocked, the build-time list shows and no error appears.
5. Build with YouTube RSS unreachable succeeds using `videos.json`.
6. Mobile width 375px on `/` and one case study.
7. Search the built HTML for banned copy: "AI engineer", "years of
   experience", "AI-Native". Zero hits outside the resume PDF.
8. Screenshots shared as proof.

## 12. Needed from the user

Not blocking the start of the build; blocking the sections they feed.

- LinkedIn sign-in in the browser pane (or the data export), for certificates.
- Certificate images, if LinkedIn does not provide usable ones.
- A YouTube Data API key, for the page-load refresh.
- A better original photo, if one exists.
- Final headline wording.

## 13. Left to the builder

- Exact type scale and spacing.
- Halftone implementation (CSS gradient overlay or SVG filter).
- Component file layout for the new sections, following the existing
  `ui/`, `sections/`, `case-study/`, `layout/` split.
- Whether retired sections are deleted or left unimported (delete preferred).
- Wording of drafts, in the voice of section 3.
