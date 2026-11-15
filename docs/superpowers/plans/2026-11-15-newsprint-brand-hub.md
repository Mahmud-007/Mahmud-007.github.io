# Newsprint Personal-Brand Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a light, newspaper-styled personal-brand hub with a sticky masthead column, an interactive Storylens pipeline as lead story, and first-class Videos, Writing and Certificates sections.

**Architecture:** Gatsby static site. JSON files in `src/data/` stay the content contract. Pure logic (pipeline steps, YouTube parsing, banned-copy check) lives in dependency-free `src/utils/*.ts` files tested with Node's built-in test runner. `gatsby-node.ts` creates case-study pages and build-time `Video` nodes; a browser hook refreshes videos on page load.

**Tech Stack:** Gatsby 5, React 18, TypeScript, Tailwind CSS 4 (`@theme` tokens), framer-motion, `@fontsource`, Node 22 `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-15-newsprint-brand-hub-design.md`

## Global Constraints

- Branch `redesign/newsprint`, cut from `redesign/product-minded`. PR targets `main`. Never commit to or open a PR against `gh-pages`.
- Banned copy, anywhere in rendered output or `src/data/*.json`: "AI engineer", "AI-Native", "years of experience", "years owning", and any first-person self-description with adjectives. The masthead carries the name only.
- Section and product framing: "Products". Never "startup" or "founder".
- No invented numbers, titles or claims. Unknown values are the literal string `TODO` (badge in develop, omitted in build) using `src/utils/todo.ts`.
- Colours: paper `#f3efe6`, paper-dark `#e8e2d4`, ink `#1a1814`, ink-soft `#5a554c`, red `#d7381e`. One red element per screenful; red is never a large background.
- Fonts: Fraunces (900, 400 italic) for masthead and headlines; Newsreader for body; IBM Plex Mono for datelines, labels, metrics, diagram.
- No rounded cards, no drop shadows. Rules and columns separate content.
- Light theme only. No WebGL/canvas libraries.
- New dependencies allowed: `@fontsource/fraunces`, `@fontsource/newsreader`, `@fontsource/ibm-plex-mono`. Nothing else.
- All motion is gated on `useReducedMotion()` from framer-motion; reduced means final state, no transition.
- Components never hardcode content; they read `src/data/`.
- Test files live in `tests/` and import helpers with the `.ts` extension. Helpers in `src/utils/` that are tested must import nothing and use only erasable TypeScript syntax.
- Every task ends with `npm test` passing and `npm run build` completing with no errors.

## Review Focus

1. Channel has zero videos, or `youtube.channelId` is empty: Videos section and `/videos` link are hidden; nothing renders empty. (Task 8)
2. YouTube Data API returns an error body, a quota error, or malformed JSON: the build-time list stays, no console error, no thrown exception. (Task 8)
3. A Storylens pipeline step has every note field `TODO` or missing: in a production build the node is not interactive and no empty note box appears. (Task 5)
4. A certificate has no `image`, or names a file that does not exist: it renders as a text row, not an empty frame, and the build does not fail. (Task 9)
5. Feed XML contains an entry with a missing title or thumbnail, or HTML entities in a title: the entry is skipped or decoded, never rendered as `undefined` or `&amp;`. (Task 8)

---

### Task 1: Branch, test harness, tokens, fonts

**Files:**
- Modify: `package.json` (scripts, dependencies)
- Modify: `src/styles/global.css`
- Modify: `tailwind.config.js`
- Modify: `gatsby-browser.tsx`
- Create: `src/utils/copy.ts`
- Create: `tests/copy.test.ts`

**Interfaces:**
- Produces: `findBanned(text: string): string[]` in `src/utils/copy.ts`, returning each banned phrase found (case-insensitive), empty array when clean. Tailwind utilities `bg-paper`, `bg-paper-dark`, `text-ink`, `text-ink-soft`, `text-red`, `border-ink`, `font-display`, `font-body`, `font-mono`.

- [ ] **Step 1: Create the branch**

```bash
git checkout redesign/product-minded
git checkout -b redesign/newsprint
```

- [ ] **Step 2: Add the test script and fonts**

In `package.json` set `"test": "node --experimental-strip-types --test \"tests/**/*.test.ts\""`.
Run: `npm install @fontsource/fraunces @fontsource/newsreader @fontsource/ibm-plex-mono` then `npm uninstall @fontsource/inter @fontsource/roboto-mono`.

- [ ] **Step 3: Write the failing test** in `tests/copy.test.ts`

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findBanned } from '../src/utils/copy.ts';

test('flags each banned phrase, case-insensitively', () => {
  assert.deepEqual(findBanned('An AI Engineer with 5 years of experience'), ['AI engineer', 'years of experience']);
  assert.deepEqual(findBanned('AI-native builder, ~4 years owning systems'), ['AI-Native', 'years owning']);
});
test('clean copy returns empty', () => {
  assert.deepEqual(findBanned('How one article becomes visuals, summaries and polls'), []);
});
```

- [ ] **Step 4: Run** `npm test`. Expected: FAIL, cannot find `copy.ts`.

- [ ] **Step 5: Implement `findBanned`** in `src/utils/copy.ts`. Export `BANNED: string[] = ['AI engineer', 'AI-Native', 'years of experience', 'years owning']`; results keep `BANNED` order and casing.

- [ ] **Step 6: Run** `npm test`. Expected: PASS.

- [ ] **Step 7: Replace tokens** in the `@theme` block of `src/styles/global.css`: remove every `navy`, `slate`, `teal`, `orange-soft`, `content-surface` and `rule` token; add `--color-paper`, `--color-paper-dark`, `--color-ink`, `--color-ink-soft`, `--color-red` with the Global Constraints values; keep `--color-status-green` and `--color-todo-amber`; set `--font-display: "Fraunces", serif`, `--font-body: "Newsreader", serif`, `--font-mono: "IBM Plex Mono", monospace`. Base layer: `body` gets `bg-paper text-ink font-body`; headings get `font-display text-ink`. Delete the `blink` and `marquee` keyframes and their classes. Add a `.halftone` class: a `::after` overlay with `background: radial-gradient(circle, var(--color-ink) 1.1px, transparent 1.3px) 0 0 / 5px 5px; mix-blend-mode: multiply; opacity: .35`. Mirror colours and fonts in `tailwind.config.js`.

- [ ] **Step 8: Swap font imports** in `gatsby-browser.tsx`: Fraunces 400-italic and 900, Newsreader 400 and 400-italic, IBM Plex Mono 400 and 500.

- [ ] **Step 9: Verify** `npm run build`. Expected: completes; the page is unstyled-looking until later tasks, which is acceptable.

- [ ] **Step 10: Commit** `chore: newsprint tokens, fonts, and test harness`

---

### Task 2: Data and types

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/data/profile.json`, `src/data/projects.json`, `src/data/experience.json`, `src/data/caseStudies.json`, `src/data/certifications.json`
- Create: `src/data/videos.json` (content: `[]`)
- Replace: `static/Mahmudur_Rahman.pdf` with `E:\Portfolio Materials\Mahmudur_Rahman.pdf`
- Delete: `src/data/principles.json`, `src/data/skills.json`
- Create: `tests/data.test.ts`

**Interfaces:**
- Produces, in `src/types/index.ts`:

```ts
export interface PipelineStep { id: string; label: string; does?: string; costs?: string; fails?: string; cacheNode?: boolean }
// CaseStudy.architecture becomes: { steps: Array<string | PipelineStep> }
export interface Video { id: string; title: string; publishedAt: string; thumbnail: string; url: string }
export interface ChannelStats { subscribers: number; views: number; videos: number }
// Profile: remove `tagline` and `intro`; add `youtube: { handle: string; channelId: string }`
// Certification: add `image?: string`  (file name inside src/images/certificates/)
// Remove: Principle
```

- [ ] **Step 1: Write the failing test** in `tests/data.test.ts`. Read each JSON file with `fs.readFileSync` and `JSON.parse`.

```ts
test('no data file contains banned copy', () => { /* for every src/data/*.json: assert.deepEqual(findBanned(raw), []) */ });
test('profile has no tagline or intro and has youtube config', () => {
  assert.equal('tagline' in profile, false); assert.equal('intro' in profile, false);
  assert.equal(profile.youtube.handle, '@mahmudurrahman8104'); assert.match(profile.youtube.channelId, /^UC[\w-]{22}$/);
});
test('storylens steps are objects with exactly one cache node', () => {
  const steps = caseStudies.find(c => c.slug === 'storylens').architecture.steps;
  assert.ok(steps.every(s => typeof s === 'object' && s.id && s.label));
  assert.equal(steps.filter(s => s.cacheNode).length, 1);
});
test('every project with a caseStudySlug points at a real case study', () => { /* slug lookup */ });
test('at least three projects have category "Product"', () => {});
```

- [ ] **Step 2: Run** `npm test`. Expected: FAIL on profile and storylens assertions.

- [ ] **Step 3: Update types** as listed under Interfaces.

- [ ] **Step 4: Update `profile.json`.** Delete `tagline` and `intro`. Set `location` to `"Dhaka, Bangladesh"`. Add `youtube.handle`. Resolve the channel id once: fetch `https://www.youtube.com/@mahmudurrahman8104` and read the `UC…` id from the canonical `/channel/` link; store it in `youtube.channelId`.

- [ ] **Step 5: Update `caseStudies.json`.** Storylens `architecture.steps` becomes five `PipelineStep` objects with ids `ingest`, `embed`, `cache`, `llm`, `output` and labels `article in`, `embed`, `prompt cache`, `LLM`, `visuals · summaries · polls`; `cache` has `cacheNode: true`. Fill `does`, `costs`, `fails` only from text already in that case study's `cost`, `risk` and `decision` fields; anything not stated there is `"TODO"`. Rewrite any `role` or `oneLiner` that trips `findBanned`.

- [ ] **Step 6: Sync with the resume.** In `projects.json` add entries for SocialDesk, Master Dashboard, First-Party Data (category `Tooling` or `Backend & Distributed`) and the Adaptive Restaurant Operations Forecasting Engine (category `Product`, link `https://rrps-frontend.onrender.com/`); ensure Domka, Rizon, Swapnanagar (link `https://www.swapnanagar.org/`) and TripCast exist with category `Product`. Summaries describe the thing, copied or shortened from the resume PDF text, with no first person. In `experience.json` add a dated entry for the DMEXCO in-image-widget showcase taken from the existing Speaking content, and bring highlights in line with the resume. Copy the new PDF over `static/Mahmudur_Rahman.pdf`.

- [ ] **Step 7: Run** `npm test`. Expected: PASS.

- [ ] **Step 8: Verify** `npm run build`. Fix type or import errors caused by removed fields by deleting the usages (Hero, Principles and Skills are deleted in Task 6; stub their imports out of `src/pages/index.tsx` now if they block the build).

- [ ] **Step 9: Commit** `feat: data and types for newsprint hub`

---

### Task 3: Print primitives

**Files:**
- Create: `src/components/ui/Rule.tsx`, `src/components/ui/SectionHead.tsx`, `src/components/ui/Dateline.tsx`, `src/components/ui/PressPhoto.tsx`, `src/components/ui/StoryRow.tsx`, `src/components/ui/MoreLink.tsx`
- Modify: `src/components/ui/Tag.tsx`, `src/components/ui/StatusPill.tsx`, `src/components/ui/TodoBadge.tsx`, `src/components/ui/Reveal.tsx`
- Delete: `src/components/ui/Terminal.tsx`, `TypeLine.tsx`, `TechMarquee.tsx`, `CountUp.tsx`, `FilterChips.tsx`, `SectionHeading.tsx`

**Interfaces:**
- Produces:

```ts
Rule({ variant?: 'hair' | 'double' })                       // 1px ink line, or 3px double ink line
SectionHead({ id: string; title: string; more?: { label: string; to: string } })  // mono caps label, hair rule, optional MoreLink right-aligned; renders <section>-level <h2 id>
Dateline({ items: string[] })                               // mono caps, items separated by " · "
PressPhoto({ caption?: string; className?: string })        // StaticImage of ../../images/profile.png, greyscale + contrast filter, `.halftone` overlay, 1px ink border, mono caption
StoryRow({ title: string; summary: string; meta?: string; href?: string; tags?: string[]; internal?: boolean })
            // one row: Fraunces title, Newsreader summary, mono meta right-aligned, hair rule beneath; whole row is a link when href is set (Gatsby <Link> when internal)
MoreLink({ label: string; to: string })                     // mono caps link with arrow; red on hover
```

- [ ] **Step 1: Build the primitives** to the signatures above. Each takes props and imports no data. `Tag` becomes mono text with a 1px ink border and square corners. `StatusPill` becomes plain mono text with a small filled circle in `status-green`. `Reveal` keeps its API; fade plus 12px rise, once, 300ms, final state under reduced motion.

- [ ] **Step 2: Delete the retired primitives** and remove their imports wherever the build reports them.

- [ ] **Step 3: Verify** `npm run build` and `npm test`. Expected: both pass.

- [ ] **Step 4: Commit** `feat: print-style ui primitives`

---

### Task 4: Layout and masthead

**Files:**
- Modify: `src/components/layout/Layout.tsx`
- Create: `src/components/layout/Masthead.tsx`, `src/components/layout/SectionBar.tsx`, `src/components/layout/sections.ts`

**Interfaces:**
- Consumes: `Rule`, `Dateline`, `PressPhoto` (Task 3); `profile.json`.
- Produces:

```ts
// sections.ts
export const SECTIONS: Array<{ id: string; label: string }> = [
  { id: 'work', label: 'Work' }, { id: 'products', label: 'Products' }, { id: 'videos', label: 'Videos' },
  { id: 'writing', label: 'Writing' }, { id: 'certificates', label: 'Certificates' },
  { id: 'experience', label: 'Experience' }, { id: 'contact', label: 'Contact' },
];
Layout({ children, hidden?: string[] })   // hidden = section ids to drop from nav (used when Videos is empty)
Masthead({ hidden?: string[] })
SectionBar({ hidden?: string[] })
```

- [ ] **Step 1: Build `Masthead`.** Contents top to bottom: name in Fraunces 900 on two lines linking to `/`; `Rule variant="double"`; `Dateline` with `[profile.location, profile.availability.status]`; `PressPhoto`; section nav from `SECTIONS` as `/#id` links; socials and resume link in mono. No role, no tagline.

- [ ] **Step 2: Build `Layout`.** At `lg` and up: CSS grid, left column 320px with `Masthead` in a `sticky top-0 h-screen` wrapper, right column `max-w-3xl` with children, 1px ink rule between columns. Below `lg`: `Masthead` renders compact at the top (name, double rule, dateline, photo at 96px) followed by `SectionBar`, a sticky horizontally scrollable mono nav on paper background with a hair rule beneath. Footer: one mono line with name and year.

- [ ] **Step 3: Verify in the browser.** `npm run develop`; at 1280px the left column stays fixed while the right scrolls; at 375px there is no horizontal page scroll and the section bar sticks.

- [ ] **Step 4: Commit** `feat: sticky masthead layout`

---

### Task 5: Signature piece

**Files:**
- Create: `src/utils/pipeline.ts`, `tests/pipeline.test.ts`
- Create: `src/components/ui/PipelineDiagram.tsx`, `src/components/sections/LeadStory.tsx`
- Modify: `src/components/case-study/ArchFlow.tsx`

**Interfaces:**
- Consumes: `PipelineStep`, `CaseStudy` types (Task 2).
- Produces, in `src/utils/pipeline.ts` (imports nothing):

```ts
export interface StepLike { id: string; label: string; does?: string; costs?: string; fails?: string; cacheNode?: boolean }
export function normalizeSteps(steps: Array<string | StepLike>): StepLike[]   // string "a b" -> { id: 'a-b', label: 'a b' }
export function stepNotes(step: StepLike, showTodo: boolean): Array<{ label: 'Does' | 'Costs' | 'Fails'; text: string }>
export function parseRate(value: string): number | null                      // "70%" -> 0.7 ; "abc" -> null
export function hitPattern(rate: number, length?: number): boolean[]         // default length 10; true = cache hit; hits spread evenly
```
- `PipelineDiagram({ steps: StepLike[]; hitRate: number | null })`
- `LeadStory()` reads the `storylens` entry of `caseStudies.json`.

- [ ] **Step 1: Write the failing tests** in `tests/pipeline.test.ts`

```ts
test('normalizeSteps converts strings and keeps objects', () => {
  assert.deepEqual(normalizeSteps(['cache lookup', { id: 'llm', label: 'LLM' }]),
    [{ id: 'cache-lookup', label: 'cache lookup' }, { id: 'llm', label: 'LLM' }]);
});
test('stepNotes drops TODO and empty fields in production', () => {
  const s = { id: 'x', label: 'x', does: 'Looks up prompt', costs: 'TODO', fails: '' };
  assert.deepEqual(stepNotes(s, false), [{ label: 'Does', text: 'Looks up prompt' }]);
  assert.equal(stepNotes(s, true).length, 2);                       // TODO kept in develop
  assert.deepEqual(stepNotes({ id: 'y', label: 'y', does: 'todo' }, false), []);
});
test('parseRate', () => { assert.equal(parseRate('70%'), 0.7); assert.equal(parseRate('fast'), null); });
test('hitPattern has the right share of hits and never clumps them all first', () => {
  const p = hitPattern(0.7);
  assert.equal(p.length, 10); assert.equal(p.filter(Boolean).length, 7);
  assert.notDeepEqual(p.slice(0, 7), Array(7).fill(true));
  assert.deepEqual(hitPattern(0), Array(10).fill(false));
});
```

- [ ] **Step 2: Run** `npm test`. Expected: FAIL, module not found.
- [ ] **Step 3: Implement** the four functions. `hitPattern` uses error diffusion: accumulate `rate` per slot, emit a hit each time the accumulator crosses 1.
- [ ] **Step 4: Run** `npm test`. Expected: PASS.

- [ ] **Step 5: Build `PipelineDiagram`.** Horizontal row of nodes joined by ink lines at `md` and up; vertical stack below. Each node is a `<button>` in mono with a 1px ink border; the `cacheNode` is the single red-filled element. A small ink dot animates along the line on a loop following `hitPattern(hitRate ?? 0)`: on a hit it travels from the cache node along a curved return path straight to the last node; on a miss it continues through every node. A node whose `stepNotes(step, IS_DEV)` is empty renders as a non-interactive `<span>`. Hover, focus or tap sets the active node; its notes show in a fixed-height panel under the diagram (label in mono caps, text in Newsreader) so the layout does not jump. `aria-pressed` on the active button; panel has `aria-live="polite"`. Under reduced motion: no dot, everything else works. Mono caption under the diagram: `"{n} of 10 requests answered from cache"` only when `hitRate` is not null.

- [ ] **Step 6: Build `LeadStory`.** Mono kicker "Lead story"; Fraunces headline from the case study's `oneLiner` (draft: "How one article becomes visuals, summaries and polls"); `PipelineDiagram` with `normalizeSteps(architecture.steps)` and `parseRate` of the metric whose label contains "cache"; `MoreLink` "Read the full story" to `/work/storylens`.

- [ ] **Step 7: Update `ArchFlow`** to call `normalizeSteps` so both step shapes render; restyle as a plain mono ordered list with hair rules.

- [ ] **Step 8: Verify in the browser.** Mouse hover, keyboard Tab, and tap at 375px each show notes. With the OS reduced-motion setting on, the dot is absent.

- [ ] **Step 9: Commit** `feat: storylens pipeline lead story`

---

### Task 6: Front page sections

**Files:**
- Modify: `src/components/sections/Work.tsx`, `Experience.tsx`, `Contact.tsx`
- Create: `src/components/sections/Products.tsx`
- Delete: `src/components/sections/Hero.tsx`, `Principles.tsx`, `Skills.tsx`, `AiWorkflow.tsx`, `Speaking.tsx`
- Modify: `src/pages/index.tsx`

**Interfaces:**
- Consumes: `SectionHead`, `StoryRow`, `Tag`, `Reveal`, `MoreLink` (Task 3); `LeadStory` (Task 5); `Layout` (Task 4).
- Produces: `Work()`, `Products()`, `Experience()`, `Contact()`, each rendering a `<section>` whose `SectionHead id` matches `SECTIONS`.

- [ ] **Step 1: `Work`.** `projects.json` entries whose category is not `Product`, as `StoryRow`s: `meta` is `metric`, `tags` is the stack, `href` is `/work/<caseStudySlug>` (internal) when set, else `link`. No filter chips.
- [ ] **Step 2: `Products`.** Entries with category `Product`, same row component, `meta` is `status` or `year`.
- [ ] **Step 3: `Experience`.** One dated row per job: period in mono on the left, role and company, then highlights as short lines (title plus metric). No cards.
- [ ] **Step 4: `Contact`.** Email as a large Fraunces link, socials and resume in mono beneath.
- [ ] **Step 5: Assemble `src/pages/index.tsx`** in this order: `LeadStory`, `Work`, `Products`, (Videos, Writing, Certificates placeholders added in Tasks 8 and 9), `Experience`, `Contact`. `Head` title: `Mahmudur Rahman`.
- [ ] **Step 6: Verify** `npm run build`, `npm test`, and in the browser that every nav link scrolls to its section.
- [ ] **Step 7: Commit** `feat: newsprint front page sections`

---

### Task 7: Case-study pages

**Files:**
- Create: `gatsby-node.ts`, `src/templates/CaseStudy.tsx`
- Modify: `src/components/case-study/DecisionTable.tsx`, `CostBlock.tsx`, `RiskBlock.tsx`, `ImpactStrip.tsx`

**Interfaces:**
- Consumes: `CaseStudy` type; `Layout`; case-study components; `todo.ts` helpers.
- Produces: `createPages` in `gatsby-node.ts` creating `/work/<slug>/` for every entry of `caseStudies.json`, with `context: { study: CaseStudy, prev: { slug, title } | null, next: { slug, title } | null }`. Template default export `CaseStudyPage({ pageContext })` and a `Head` export.

- [ ] **Step 1: `gatsby-node.ts`.** Import `caseStudies.json`; `createPages` resolves the template with `path.resolve('src/templates/CaseStudy.tsx')`.
- [ ] **Step 2: Template.** Order: `MoreLink` back to `/#work`; mono kicker (category · period · status); Fraunces headline (title); Newsreader italic standfirst (oneLiner); `ImpactStrip`; sections "The problem", "The decision", "What it cost", "Operational risk", "Impact", "Architecture", "What I'd do differently"; links; prev/next. The first paragraph of "The problem" gets a drop cap (Fraunces 900, red, floated, 3 lines). A block whose fields are all TODO is hidden via `allTodo`. `Head`: `<title>{title} — Mahmudur Rahman</title>` and a meta description from `oneLiner`.
- [ ] **Step 3: Restyle the four components** with ink rules, mono labels, no rounded corners or fills. In `DecisionTable` the chosen row is marked with a red "chosen" label, not a coloured background.
- [ ] **Step 4: Verify** `npm run build`, then `npm run serve` and open all five `/work/<slug>/` routes; console clean.
- [ ] **Step 5: Commit** `feat: case study pages`

---

### Task 8: Videos

**Files:**
- Create: `src/utils/youtube.ts`, `tests/youtube.test.ts`
- Modify: `gatsby-node.ts`
- Create: `src/hooks/useVideos.ts`
- Create: `src/components/sections/Videos.tsx`, `src/components/ui/VideoCard.tsx`, `src/pages/videos.tsx`
- Modify: `src/pages/index.tsx`
- Create: `.env.example` (one line: `GATSBY_YOUTUBE_API_KEY=`)

**Interfaces:**
- Consumes: `Video`, `ChannelStats` types; `profile.youtube`.
- Produces, in `src/utils/youtube.ts` (imports nothing):

```ts
export interface VideoLike { id: string; title: string; publishedAt: string; thumbnail: string; url: string }
export function parseFeed(xml: string): VideoLike[]                  // YouTube Atom feed -> videos, newest first
export function uploadsPlaylistId(channelId: string): string         // "UCabc" -> "UUabc"
export function mapPlaylistItems(json: unknown): VideoLike[]         // Data API playlistItems (part=snippet) -> videos; [] on any unexpected shape
export function mapChannelStats(json: unknown): { subscribers: number; views: number; videos: number } | null
```
- GraphQL type `Video` with fields `videoId, title, publishedAt, thumbnail, url` (all `String!`).
- `useVideos(): { videos: Video[]; stats: ChannelStats | null }`
- `Videos({ limit?: number })`, `VideoCard({ video: Video })`.

- [ ] **Step 1: Write the failing tests** in `tests/youtube.test.ts`. Use an inline fixture string with two `<entry>` blocks in YouTube's Atom format (`<yt:videoId>`, `<title>`, `<published>`, `<media:thumbnail url="…"/>`).

```ts
test('parseFeed reads id, title, date, thumbnail, url', () => {
  const [v] = parseFeed(FIXTURE);
  assert.deepEqual(v, { id: 'abc123', title: 'RAG & MCP in 10 minutes', publishedAt: '2026-10-02T10:00:00+00:00',
    thumbnail: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=abc123' });
});
test('parseFeed decodes entities and skips entries missing id or title', () => {
  // fixture title is "RAG &amp; MCP in 10 minutes"; third entry has no <title>
  assert.equal(parseFeed(FIXTURE_WITH_BROKEN_ENTRY).length, 2);
});
test('parseFeed falls back to the standard thumbnail url when media:thumbnail is absent', () => {});
test('parseFeed returns [] for empty string and for non-feed text', () => {
  assert.deepEqual(parseFeed(''), []); assert.deepEqual(parseFeed('<html>error</html>'), []);
});
test('uploadsPlaylistId', () => { assert.equal(uploadsPlaylistId('UCabc'), 'UUabc'); });
test('mapPlaylistItems returns [] for error bodies and garbage', () => {
  assert.deepEqual(mapPlaylistItems({ error: { code: 403 } }), []);
  assert.deepEqual(mapPlaylistItems(null), []); assert.deepEqual(mapPlaylistItems('x'), []);
});
test('mapPlaylistItems maps snippet.resourceId.videoId, title, publishedAt, thumbnails.high.url', () => {});
test('mapChannelStats parses string counts and returns null on bad shape', () => {
  assert.deepEqual(mapChannelStats({ items: [{ statistics: { subscriberCount: '120', viewCount: '4500', videoCount: '9' } }] }),
    { subscribers: 120, views: 4500, videos: 9 });
  assert.equal(mapChannelStats({ items: [] }), null);
});
```

- [ ] **Step 2: Run** `npm test`. Expected: FAIL, module not found.
- [ ] **Step 3: Implement** with regular expressions over the XML (no parser dependency). Decode `&amp; &lt; &gt; &quot; &#39;`.
- [ ] **Step 4: Run** `npm test`. Expected: PASS.

- [ ] **Step 5: Build-time source** in `gatsby-node.ts`. `createSchemaCustomization` declares `type Video implements Node`. `sourceNodes`: if `profile.youtube.channelId` is empty, use `videos.json`; otherwise `fetch` the feed URL from the spec with an 8-second `AbortController` timeout and `parseFeed` it; on a thrown error, non-200, or zero parsed videos, `reporter.warn` and use `videos.json`. Create one node per video.

- [ ] **Step 6: `useVideos`.** Build-time list from `useStaticQuery` (`allVideo`, sorted by `publishedAt` descending). In `useEffect` only (never during render, so SSR is safe): return early when `process.env.GATSBY_YOUTUBE_API_KEY` or `channelId` is empty; read `sessionStorage` key `yt-v1` and use it when present; otherwise fetch `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=12&playlistId=<uploads>&key=<key>` and `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=<channelId>&key=<key>`; replace the list only when `mapPlaylistItems` returns at least one video; set stats from `mapChannelStats`; store both in `sessionStorage`. Wrap everything in `try/catch` that swallows silently, including `sessionStorage` access.

- [ ] **Step 7: Components and page.** `VideoCard`: thumbnail in a 16:9 well with 1px ink border and `loading="lazy"`, Fraunces title, mono date; whole card links to `url` in a new tab with `rel="noopener noreferrer"`. `Videos`: returns `null` when there are no videos; otherwise `SectionHead id="videos"` with `more` to `/videos`, the first `limit` (default 3) cards in a three-column grid (one column on mobile), and a mono stats line "`{subscribers} subscribers · {videos} videos`" only when stats exist. `src/pages/videos.tsx`: all videos in `Layout`, with a link to the channel; when empty, a single line linking to the channel. `Head` title `Videos — Mahmudur Rahman`.

- [ ] **Step 8: Wire into `index.tsx`** after `Products`. Create `src/hooks/useHiddenSections.ts` exporting `useHiddenSections(): string[]`, which returns `['videos']` when a build-time `useStaticQuery` `totalCount` of `allVideo` is zero, else `[]`. Call it inside `Layout` and merge its result with the `hidden` prop, so every page (front page, case studies, `/writing`, `/certificates`) hides the Videos nav item consistently.

- [ ] **Step 9: Verify.** (a) `npm run build` with network on: videos render. (b) Temporarily set `channelId` to `UCxxxxxxxxxxxxxxxxxxxxxx`, build: warning logged, build succeeds, Videos section and nav item absent; revert. (c) In develop with a bogus `GATSBY_YOUTUBE_API_KEY`: build-time list stays, console clean.

- [ ] **Step 10: Commit** `feat: videos from youtube with build-time snapshot and live refresh`

---

### Task 9: Writing and Certificates

**Files:**
- Modify: `src/components/sections/Writing.tsx`, `src/components/sections/Certifications.tsx` (rename to `Certificates.tsx`)
- Create: `src/components/ui/CertificateCard.tsx`, `src/hooks/useCertificateImages.ts`
- Create: `src/pages/writing.tsx`, `src/pages/certificates.tsx`
- Create: `src/images/certificates/` (with the image files)
- Modify: `src/data/certifications.json`, `src/pages/index.tsx`

**Interfaces:**
- Consumes: `StoryRow`, `SectionHead`, `Layout`; `Certification` with `image?`.
- Produces: `Writing({ limit?: number })`, `Certificates({ limit?: number })`, `useCertificateImages(): Record<string, IGatsbyImageData>` keyed by file `base`, `CertificateCard({ cert: Certification; image?: IGatsbyImageData })`.

- [ ] **Step 1: `Writing`.** `articles.json` as `StoryRow`s, `tags` shown, external links. Front page shows `limit` 3 with `more` to `/writing`; the page shows all. If there are three or fewer articles, omit the `more` link.

- [ ] **Step 2: `useCertificateImages`.** `useStaticQuery` over `allFile(filter: { sourceInstanceName: { eq: "images" }, relativeDirectory: { eq: "certificates" } })` selecting `base` and `childImageSharp { gatsbyImageData(width: 640, placeholder: BLURRED) }`.

- [ ] **Step 3: `CertificateCard` and `Certificates`.** With an image: image in a 4:3 well with 1px ink border, then Fraunces title, mono "issuer · issued", credential link when `link` is set. Without an image, or when `cert.image` has no match in the hook's map: a `StoryRow` with the same text and no frame. Sort newest first by `issued`. Front page `limit` 3 with `more` to `/certificates`.

- [ ] **Step 4: Verify the fallback.** Set one certificate's `image` to `missing.png`; `npm run build` succeeds and that certificate renders as a text row; revert.

- [ ] **Step 5: One-time LinkedIn import (needs the user).** Ask the user to sign in to linkedin.com in the browser pane. Then read their profile's Licenses & certifications and Courses, add every entry to `certifications.json` with `title`, `issuer`, `issued`, `credentialId`, `link`, `skills`, and save each certificate image the user confirms into `src/images/certificates/`, setting `image`. If the user has not signed in, skip this step, keep the three existing entries as text rows, and record it in the PR description as outstanding.

- [ ] **Step 6: Pages and wiring.** `writing.tsx` and `certificates.tsx` with `Head` titles; add both sections to `index.tsx` after `Videos`.

- [ ] **Step 7: Verify** `npm test`, `npm run build`, browser check of both pages.

- [ ] **Step 8: Commit** `feat: writing and certificates sections and pages`

---

### Task 10: Metadata, banned-copy gate, verification, PR

**Files:**
- Modify: `gatsby-config.ts`, `CLAUDE.md`, `package.json`
- Create: `scripts/check-copy.mjs`
- Create: `docs/youtube-api-key.md`

**Interfaces:**
- Consumes: built HTML in `public/`.
- Produces: `npm run check:copy`, exiting 1 and listing file plus phrase when any `public/**/*.html` contains a `BANNED` phrase (case-insensitive, tags stripped).

- [ ] **Step 1: `gatsby-config.ts`.** `siteMetadata.description`: `"Work, writing, videos and certificates of Mahmudur Rahman."`; manifest `background_color` `#f3efe6`, `theme_color` `#1a1814`.

- [ ] **Step 2: `scripts/check-copy.mjs`.** Keep its phrase list identical to `BANNED` in `src/utils/copy.ts` (duplicate the four strings; add a comment pointing at the source). Add script `"check:copy": "node scripts/check-copy.mjs"`.

- [ ] **Step 3: `docs/youtube-api-key.md`.** Steps for the user: create a Google Cloud project, enable YouTube Data API v3, create an API key, restrict it to that API and to HTTP referrers `https://mahmud-007.github.io/*`, the Netlify domain, and `http://localhost:8000/*`; put it in `.env.production` and `.env.development` as `GATSBY_YOUTUBE_API_KEY`; note that the key is visible in page source by design.

- [ ] **Step 4: Update `CLAUDE.md`** for the new architecture, pages, tokens, fonts, `npm test`, `npm run check:copy`, and the rule that `gh-pages` is build output only.

- [ ] **Step 5: Full verification.** Run `npm test` (all pass), `npm run build` (no errors), `npm run check:copy` (exit 0). In the browser via `npm run serve`: `/`, five `/work/<slug>/`, `/videos`, `/writing`, `/certificates`; console and network clean; 375px on `/` and one case study with no horizontal scroll; pipeline notes by hover, keyboard and tap. Take screenshots of `/` at desktop and mobile and of one case study.

- [ ] **Step 6: Commit and open the PR.**

```bash
git add -A
git commit -m "chore: metadata, copy gate, docs"
git push -u origin redesign/newsprint
gh pr create --base main --title "Newsprint personal-brand hub" --body-file <prepared body>
```

The PR body lists what changed, the screenshots, and what is outstanding from the user (LinkedIn import if skipped, YouTube API key, final headline wording, better photo). After merge the user runs `npm run deploy`.
