# Product-Minded Engineering Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Gatsby portfolio so every project is presented as an engineering decision — worth building, what it cost, how it fails, what business number moved — while keeping the existing terminal/navy identity and adding motion.

**Architecture:** Content lives in typed JSON under `src/data/`. `gatsby-node.ts` generates one `/work/<slug>` page per case study and sources GitHub stats at build time with a committed fallback. Components split into `ui/` primitives (no data imports), `sections/` (one data file each), `case-study/` blocks, and `layout/`.

**Tech Stack:** Gatsby 5, React 18, TypeScript (strict), Tailwind CSS 4 (`@theme` tokens), framer-motion, react-icons.

**Spec:** `docs/superpowers/specs/2026-08-31-product-minded-portfolio-design.md`

## Global Constraints

- **No invented data.** Any value the user has not supplied is the literal string `"TODO"`. Never write a plausible-looking number, cost, or company detail into JSON. This is the single most important rule in this plan.
- **No entrepreneur/founder framing.** No "I build startups", no product-launch language, no "founder" anywhere in copy. Per the spec, the business/product tone must come through *indirectly* — via decisions, costs and outcomes stated plainly — never as self-branding.
- **Availability copy is exactly `Open to work`.** No role type, no seniority, no employment-status elaboration.
- **No new npm dependencies.** `framer-motion`, `react-icons`, `clsx`, `tailwind-merge` are already installed and cover everything here.
- **TypeScript is `strict: true`.** No `any`, no non-null assertions on data reads.
- **Cast imported JSON with `as unknown as T`, never a bare `as T`.** With `resolveJsonModule`, TypeScript infers `category: string` and `tone: string` from the JSON literal, which are not assignable to the `WorkCategory` and `'green' | 'amber'` unions. A bare `projects as Project[]` fails `tsc`. This applies to `projects.json`, `profile.json`, and `caseStudies.json`; `principles.json`, `articles.json` and `certifications.json` are all-string and cast cleanly.
- **Use relative imports** (`../ui/Terminal`), not the `@/*` alias. The alias is declared in `tsconfig.json` but Gatsby's webpack has no matching resolver, so `@/` imports typecheck and then fail at build.
- **Terminal identity is retained site-wide**, not reduced to the hero.
- **All motion respects `prefers-reduced-motion`** via framer-motion's `useReducedMotion`.
- Existing color tokens: `navy-900` `#0a192f`, `navy-800` `#112240`, `navy-700` `#233554`, `slate-light` `#a8b2d1`, `slate-lightest` `#ccd6f6`, `teal` `#64ffda`, `orange-soft` `#ffaf7b`, `status-green` `#3fb950`, `content-surface` `#0e1f3a`.

## Verification Model

This repo has **no test runner and no linter** — `npm test` is a stub that exits 1. Do not add one; the spec puts it out of scope. The test cycle for every task is:

| Command | When | Expected |
|---|---|---|
| `npx tsc --noEmit` | every task | exit 0, no errors |
| `npm run build` | tasks marked **BUILD GATE** | exit 0, no new warnings |
| Browser preview via `preview_start` `{name: "gatsby-develop"}` | tasks that render UI | section renders, console clean |

`.claude/launch.json` already defines `gatsby-develop` on port 8000. Use the preview tools, never `npm run develop` through Bash.

## Branch

All work happens on a feature branch, not `main`:

```bash
git checkout -b redesign/product-minded
```

## File Structure

**Created:**

```
src/types/index.ts                      Shared interfaces for every data file
src/utils/todo.ts                       TODO detection + prod stripping
src/utils/cn.ts                         clsx + tailwind-merge helper
src/data/profile.json                   Identity, socials, availability
src/data/principles.json                The four decision questions
src/data/caseStudies.json               Deep content for /work/<slug>
src/data/github.json                    Build-time fetch fallback
src/data/youtube.json                   YouTube feed fallback (Task 14)
src/components/sections/Video.tsx       Latest YouTube uploads (Task 14)
src/components/ui/Terminal.tsx          Window chrome (extracted from Hero + AiWorkflow)
src/components/ui/SectionHeading.tsx    `// label` heading (extracted from 7 components)
src/components/ui/Tag.tsx               Tag / metric pill
src/components/ui/StatusPill.tsx        Availability pill
src/components/ui/TodoBadge.tsx         Dev-only amber TODO marker
src/components/ui/Reveal.tsx            whileInView wrapper
src/components/ui/TypeLine.tsx          Typewriter line
src/components/ui/CountUp.tsx           Metric count-up
src/components/ui/FilterChips.tsx       Work category filter
src/components/ui/TechMarquee.tsx       Infinite tech-logo strip
src/components/case-study/DecisionTable.tsx
src/components/case-study/CostBlock.tsx
src/components/case-study/RiskBlock.tsx
src/components/case-study/ImpactStrip.tsx
src/components/case-study/ArchFlow.tsx
src/components/sections/Principles.tsx
src/components/sections/Work.tsx
src/components/sections/GitHubActivity.tsx
src/components/sections/Credentials.tsx
src/templates/CaseStudy.tsx
gatsby-node.ts
```

**Moved (Task 2, no behavior change):**

```
src/components/Layout.tsx      -> src/components/layout/Layout.tsx
src/components/Hero.tsx        -> src/components/sections/Hero.tsx
src/components/Experience.tsx  -> src/components/sections/Experience.tsx
src/components/Projects.tsx    -> src/components/sections/Projects.tsx   (deleted in Task 7)
src/components/Skills.tsx      -> src/components/sections/Skills.tsx
src/components/AiWorkflow.tsx  -> src/components/sections/AiWorkflow.tsx
src/components/Blog.tsx        -> src/components/sections/Writing.tsx
src/components/Contact.tsx     -> src/components/sections/Contact.tsx
src/components/Certifications.tsx, Speaking.tsx -> merged into sections/Credentials.tsx (Task 13)
src/components/About.tsx       -> deleted (Task 5)
```

**Modified:** `src/pages/index.tsx`, `src/data/projects.json`, `src/styles/global.css`, `tailwind.config.js`.

---

### Task 1: Types, utilities, and design tokens

Foundation every later task imports. Nothing renders yet.

**Files:**
- Create: `src/types/index.ts`
- Create: `src/utils/todo.ts`
- Create: `src/utils/cn.ts`
- Modify: `src/styles/global.css`
- Modify: `tailwind.config.js`

**Interfaces:**
- Consumes: nothing.
- Produces: all types below; `cn(...)`; `isTodo(v)`, `field(v)`, `listField(v)`, `IS_DEV`.

- [ ] **Step 1: Create `src/types/index.ts`**

```ts
export type WorkCategory =
  | 'Backend & Distributed'
  | 'AI & LLM'
  | 'Product'
  | 'Tooling';

export type Verdict = 'chosen' | 'rejected' | 'considered';

export interface Metric {
  label: string;
  value: string;
  baseline?: string;
  howMeasured?: string;
}

export interface DecisionOption {
  name: string;
  cost: string;
  risk: string;
  verdict: Verdict;
}

export interface CaseStudyLink {
  label: string;
  url: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  category: WorkCategory;
  role: string;
  period: string;
  status: string;
  oneLiner: string;
  stack: string[];
  problem: { context: string; trigger: string };
  decision: {
    question: string;
    options: DecisionOption[];
    chose: string;
    rejected: string;
    why: string;
  };
  cost: { engineering: string; run: string; timeline: string };
  risk: { operational: string; failureModes: string[]; mitigations: string[] };
  impact: { metrics: Metric[]; businessOutcome: string };
  architecture: { steps: string[] };
  retro: string;
  links: CaseStudyLink[];
}

export interface Project {
  title: string;
  summary: string;
  tags: string[];
  category: WorkCategory;
  link?: string;
  metric?: string;
  caseStudySlug?: string;
  year?: string;
  status?: string;
}

export interface Principle {
  command: string;
  title: string;
  body: string;
  evidence?: string;
}

export interface Social {
  label: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  initials: string;
  tagline: string;
  intro: string;
  location: string;
  email: string;
  resume: string;
  availability: { status: string; tone: 'green' | 'amber' };
  socials: Social[];
}

export interface Highlight {
  title: string;
  metric?: string;
  desc: string;
  context?: string;
}

export interface Job {
  company: string;
  role: string;
  period: string;
  type: string;
  tags: string[];
  highlights: Highlight[];
}

export interface Article {
  title: string;
  summary: string;
  tags: string[];
  link: string;
}

export interface Certification {
  title: string;
  issuer: string;
  issued: string;
  credentialId: string;
  skills: string[];
  link?: string;
}

export interface GithubLanguage {
  name: string;
  count: number;
}

export interface GithubRepo {
  name: string;
  description: string;
  stars: number;
  language: string;
  pushedAt: string;
  url: string;
}

export interface GithubStats {
  login: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  languages: GithubLanguage[];
  recentRepos: GithubRepo[];
  fetchedAt: string;
}
```

- [ ] **Step 2: Create `src/utils/cn.ts`**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

- [ ] **Step 3: Create `src/utils/todo.ts`**

This is the mechanism that keeps unfilled data off the production site.

```ts
export const TODO = 'TODO';

export const IS_DEV = process.env.NODE_ENV === 'development';

export const isTodo = (value: unknown): boolean =>
  typeof value === 'string' && value.trim().toUpperCase() === TODO;

/**
 * Resolve a single string field.
 * - real value        -> { value, todo: false }
 * - "TODO" in develop -> { value: "TODO", todo: true }   (renders an amber badge)
 * - "TODO" in build   -> null                            (caller renders nothing)
 * - empty/undefined   -> null
 */
export function field(value?: string): { value: string; todo: boolean } | null {
  if (!value) return null;
  if (isTodo(value)) return IS_DEV ? { value: TODO, todo: true } : null;
  return { value, todo: false };
}

/** Drop TODO entries from a list. In develop, TODO entries are kept so they stay visible. */
export function listField(values?: string[]): string[] {
  if (!values) return [];
  return IS_DEV ? values : values.filter((v) => !isTodo(v));
}

/** True when every supplied field is TODO or empty — caller should hide the whole block. */
export function allTodo(...values: Array<string | undefined>): boolean {
  return values.every((v) => !v || isTodo(v));
}
```

- [ ] **Step 4: Add tokens and keyframes to `src/styles/global.css`**

Add inside the existing `@theme { }` block, after `--color-content-surface`:

```css
  --color-todo-amber: #d29922;
  --color-rule: #1e3050;
```

Add at the end of the file, after the existing `.cursor-blink` rule:

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.marquee-track {
  animation: marquee 40s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
  .cursor-blink { animation: none; }
}
```

- [ ] **Step 5: Mirror the two new colors in `tailwind.config.js`**

Add `'todo-amber': '#d29922'` and `rule: '#1e3050'` to the `theme.extend.colors` object so the v3 and v4 configs do not drift.

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0, no output.

- [ ] **Step 7: Commit**

```bash
git add src/types src/utils src/styles/global.css tailwind.config.js
git commit -m "feat: add shared types, TODO utilities, and design tokens"
```

---

### Task 2: Component folder split — BUILD GATE

Pure move. No markup changes, no new components. Landing this alone means a broken import shows up here rather than tangled with new work. The spec calls this out as a named risk.

**Files:**
- Move: the 8 files listed in File Structure above into `layout/` and `sections/`
- Modify: `src/pages/index.tsx` (import paths only)

**Interfaces:**
- Consumes: nothing.
- Produces: `../components/layout/Layout`, `../components/sections/<Name>` import paths for all later tasks.

- [ ] **Step 1: Create the directories and move the files**

```bash
mkdir -p src/components/layout src/components/sections src/components/ui src/components/case-study
git mv src/components/Layout.tsx        src/components/layout/Layout.tsx
git mv src/components/Hero.tsx          src/components/sections/Hero.tsx
git mv src/components/About.tsx         src/components/sections/About.tsx
git mv src/components/Experience.tsx    src/components/sections/Experience.tsx
git mv src/components/Projects.tsx      src/components/sections/Projects.tsx
git mv src/components/Skills.tsx        src/components/sections/Skills.tsx
git mv src/components/Certifications.tsx src/components/sections/Certifications.tsx
git mv src/components/AiWorkflow.tsx    src/components/sections/AiWorkflow.tsx
git mv src/components/Blog.tsx          src/components/sections/Writing.tsx
git mv src/components/Speaking.tsx      src/components/sections/Speaking.tsx
git mv src/components/Contact.tsx       src/components/sections/Contact.tsx
```

- [ ] **Step 2: Fix data imports inside the moved files**

Every moved section imported data as `../data/x.json`. They are now one level deeper — change each to `../../data/x.json`. Affected: `Experience.tsx`, `Projects.tsx`, `Skills.tsx`, `Certifications.tsx`, `Writing.tsx`. `Speaking.tsx` imports `../images/speaking.jpg` via `StaticImage` — change to `../../images/speaking.jpg`.

- [ ] **Step 3: Rename the component inside `Writing.tsx`**

Change `const Blog = () => {` to `const Writing = () => {` and `export default Blog;` to `export default Writing;`. Leave its markup and its `id="blog"` alone for now; Task 12 revisits it.

- [ ] **Step 4: Update `src/pages/index.tsx` imports**

```tsx
import Layout from "../components/layout/Layout"
import Hero from "../components/sections/Hero"
import About from "../components/sections/About"
import Experience from "../components/sections/Experience"
import Projects from "../components/sections/Projects"
import Skills from "../components/sections/Skills"
import Certifications from "../components/sections/Certifications"
import AiWorkflow from "../components/sections/AiWorkflow"
import Writing from "../components/sections/Writing"
import Speaking from "../components/sections/Speaking"
import Contact from "../components/sections/Contact"
```

Change `<Blog />` in the JSX to `<Writing />`. Everything else in the file stays.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 6: BUILD GATE**

Run: `npm run build`
Expected: exit 0. If this fails, a moved import is wrong — fix before continuing. The site must look byte-identical to before at this point.

- [ ] **Step 7: Commit**

```bash
git add -A src/components src/pages
git commit -m "refactor: split components into layout/sections/ui/case-study"
```

---

### Task 3: UI primitives — Terminal, SectionHeading, Tag, StatusPill, TodoBadge

Extracts the two duplications the spec names, plus the small pills everything else needs.

**Files:**
- Create: `src/components/ui/Terminal.tsx`, `SectionHeading.tsx`, `Tag.tsx`, `StatusPill.tsx`, `TodoBadge.tsx`
- Modify: `src/components/sections/AiWorkflow.tsx` (adopt `Terminal` + `SectionHeading`)

**Interfaces:**
- Consumes: `cn` from Task 1.
- Produces:
  - `<Terminal title={string} children>` — window chrome with three dots
  - `<SectionHeading label={string} />` — renders `// label` plus rule
  - `<Tag tone?: 'default' | 'green' | 'teal' | 'amber'>` — pill
  - `<StatusPill status={string} tone={'green' | 'amber'} />`
  - `<TodoBadge />` — dev-only amber `TODO` marker

- [ ] **Step 1: Create `src/components/ui/Terminal.tsx`**

```tsx
import React from 'react';
import { cn } from '../../utils/cn';

interface TerminalProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

const Terminal: React.FC<TerminalProps> = ({ title, children, className, bodyClassName }) => (
  <div
    className={cn(
      'rounded-xl border border-navy-700 bg-navy-800/60 shadow-2xl overflow-hidden font-mono',
      className
    )}
  >
    <div className="flex items-center gap-2 px-4 py-3 border-b border-navy-700 bg-navy-900/70">
      <span className="w-3 h-3 rounded-full bg-red-400/70" />
      <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
      <span className="w-3 h-3 rounded-full bg-status-green/80" />
      <span className="ml-3 text-xs text-slate-light">{title}</span>
    </div>
    <div className={cn('p-5 sm:p-8 text-sm sm:text-base leading-relaxed', bodyClassName)}>
      {children}
    </div>
  </div>
);

export default Terminal;
```

- [ ] **Step 2: Create `src/components/ui/SectionHeading.tsx`**

```tsx
import React from 'react';

interface SectionHeadingProps {
  label: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ label }) => (
  <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
    <span className="text-teal font-mono mr-2">{`// ${label}`}</span>
    <span className="h-px bg-rule flex-grow ml-4 max-w-xs" />
  </h2>
);

export default SectionHeading;
```

- [ ] **Step 3: Create `src/components/ui/Tag.tsx`**

```tsx
import React from 'react';
import { cn } from '../../utils/cn';

type Tone = 'default' | 'green' | 'teal' | 'amber';

const tones: Record<Tone, string> = {
  default: 'text-slate-light/80 border-navy-700',
  green: 'text-status-green border-status-green/30',
  teal: 'text-teal border-teal/30',
  amber: 'text-todo-amber border-todo-amber/40',
};

interface TagProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, tone = 'default', className }) => (
  <span
    className={cn(
      'inline-block text-xs font-mono border rounded px-2 py-0.5',
      tones[tone],
      className
    )}
  >
    {children}
  </span>
);

export default Tag;
```

- [ ] **Step 4: Create `src/components/ui/TodoBadge.tsx`**

```tsx
import React from 'react';
import Tag from './Tag';
import { IS_DEV } from '../../utils/todo';

/** Renders only in `gatsby develop`, so unfilled data is visible to the author and invisible in production. */
const TodoBadge: React.FC<{ label?: string }> = ({ label = 'TODO' }) => {
  if (!IS_DEV) return null;
  return <Tag tone="amber">{label}</Tag>;
};

export default TodoBadge;
```

- [ ] **Step 5: Create `src/components/ui/StatusPill.tsx`**

```tsx
import React from 'react';
import { cn } from '../../utils/cn';

interface StatusPillProps {
  status: string;
  tone: 'green' | 'amber';
}

const StatusPill: React.FC<StatusPillProps> = ({ status, tone }) => (
  <span
    className={cn(
      'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono',
      tone === 'green'
        ? 'border-status-green/40 text-status-green'
        : 'border-todo-amber/40 text-todo-amber'
    )}
  >
    <span
      className={cn(
        'w-2 h-2 rounded-full',
        tone === 'green' ? 'bg-status-green' : 'bg-todo-amber'
      )}
    />
    {status}
  </span>
);

export default StatusPill;
```

- [ ] **Step 6: Adopt the primitives in `AiWorkflow.tsx`**

Replace its hand-rolled heading with `<SectionHeading label="how I work with AI" />`, and replace the terminal chrome div plus its inner padding div with `<Terminal title="~/ai-assisted-dev">…</Terminal>`, keeping the body content exactly as it is. Replace the tool `<span>` pills with `<Tag tone="teal">`.

- [ ] **Step 7: Typecheck and preview**

Run: `npx tsc --noEmit` — expect exit 0.
Then `preview_start` `{name: "gatsby-develop"}`, load `/`, and confirm the AI Workflow section looks unchanged and the console is clean.

- [ ] **Step 8: Commit**

```bash
git add src/components/ui src/components/sections/AiWorkflow.tsx
git commit -m "feat: extract Terminal, SectionHeading, Tag, StatusPill primitives"
```

---

### Task 4: Motion primitives — Reveal, TypeLine, CountUp, TechMarquee

**Files:**
- Create: `src/components/ui/Reveal.tsx`, `TypeLine.tsx`, `CountUp.tsx`, `TechMarquee.tsx`

**Interfaces:**
- Consumes: `cn`.
- Produces:
  - `<Reveal delay?: number>` — fade + 12px rise on first view
  - `<TypeLine text={string} startDelay?: number onDone?: () => void />`
  - `<CountUp value={string} />` — animates the leading number in a string like `70%`, renders `<100ms` and `30m→2m` as-is
  - `<TechMarquee items={string[]} />` — infinite logo strip

- [ ] **Step 1: Create `src/components/ui/Reveal.tsx`**

```tsx
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className }) => {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
```

- [ ] **Step 2: Create `src/components/ui/TypeLine.tsx`**

```tsx
import React from 'react';
import { useReducedMotion } from 'framer-motion';

interface TypeLineProps {
  text: string;
  startDelay?: number;
  speed?: number;
  className?: string;
  onDone?: () => void;
}

const TypeLine: React.FC<TypeLineProps> = ({
  text,
  startDelay = 0,
  speed = 28,
  className,
  onDone,
}) => {
  const reduced = useReducedMotion();
  const [shown, setShown] = React.useState(reduced ? text.length : 0);

  React.useEffect(() => {
    if (reduced) {
      onDone?.();
      return;
    }
    let index = 0;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        index += 1;
        setShown(index);
        if (index >= text.length) {
          clearInterval(interval);
          onDone?.();
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
    // onDone is intentionally excluded; callers pass inline closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, startDelay, speed, reduced]);

  return <span className={className}>{text.slice(0, shown)}</span>;
};

export default TypeLine;
```

- [ ] **Step 3: Create `src/components/ui/CountUp.tsx`**

Values in the data are strings like `70%`, `32.4%`, `<100ms`, `30m→2m`, `0`, `26+`. Only animate when the string *starts* with a number; otherwise render it untouched.

```tsx
import React from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  value: string;
  className?: string;
  duration?: number;
}

const LEADING_NUMBER = /^(\d+(?:\.\d+)?)(.*)$/s;

const CountUp: React.FC<CountUpProps> = ({ value, className, duration = 900 }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();

  const match = value.match(LEADING_NUMBER);
  const target = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : '';
  const decimals = match && match[1].includes('.') ? 1 : 0;

  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (target === null || reduced || !inView) return;
    const started = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - started) / duration, 1);
      setCurrent(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, reduced, inView, duration]);

  if (target === null || reduced) {
    return <span ref={ref} className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {(inView ? current : 0).toFixed(decimals)}
      {suffix}
    </span>
  );
};

export default CountUp;
```

- [ ] **Step 4: Create `src/components/ui/TechMarquee.tsx`**

Maps skill names to `react-icons/si` components. Any name without a mapping renders as mono text, so the marquee never breaks on an unmapped skill.

```tsx
import React from 'react';
import type { IconType } from 'react-icons';
import {
  SiNodedotjs, SiPython, SiGo, SiTypescript, SiReact, SiNextdotjs,
  SiAmazonwebservices, SiDocker, SiMongodb, SiPostgresql, SiRedis,
  SiElasticsearch, SiOpensearch, SiGraphql, SiTailwindcss, SiExpress,
  SiFastapi, SiMysql, SiFirebase, SiGithubactions,
} from 'react-icons/si';

const ICONS: Record<string, IconType> = {
  'Node.js': SiNodedotjs,
  'Express.js': SiExpress,
  FastAPI: SiFastapi,
  Python: SiPython,
  Go: SiGo,
  TypeScript: SiTypescript,
  React: SiReact,
  'Next.js': SiNextdotjs,
  AWS: SiAmazonwebservices,
  Docker: SiDocker,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  Redis: SiRedis,
  'ELK Stack': SiElasticsearch,
  OpenSearch: SiOpensearch,
  GraphQL: SiGraphql,
  Tailwind: SiTailwindcss,
  Firebase: SiFirebase,
  'CI/CD (GitHub Actions)': SiGithubactions,
};

const TechMarquee: React.FC<{ items: string[] }> = ({ items }) => {
  const track = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-4 border-y border-rule">
      <div className="marquee-track flex w-max items-center gap-10">
        {track.map((item, i) => {
          const Icon = ICONS[item];
          return (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-2 text-slate-light/70 hover:text-teal transition-colors shrink-0"
              aria-hidden={i >= items.length}
            >
              {Icon ? <Icon className="h-6 w-6" /> : null}
              <span className="font-mono text-xs whitespace-nowrap">{item}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TechMarquee;
```

- [ ] **Step 5: Verify the `react-icons/si` names resolve**

Run: `npx tsc --noEmit`
Expected: exit 0. If any `Si*` import errors, that icon was renamed in react-icons v5 — check `node_modules/react-icons/si/index.d.ts` for the correct name and fix. `SiAmazonwebservices` in particular replaced the older `SiAmazonaws`.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui
git commit -m "feat: add Reveal, TypeLine, CountUp, TechMarquee motion primitives"
```

---

### Task 5: `profile.json` and the Hero rebuild

**Files:**
- Create: `src/data/profile.json`
- Modify: `src/components/sections/Hero.tsx`
- Delete: `src/components/sections/About.tsx`
- Modify: `src/pages/index.tsx` (drop `<About />`)

**Interfaces:**
- Consumes: `Terminal`, `StatusPill`, `TypeLine`, `CountUp`, `Profile` type.
- Produces: `src/data/profile.json` as the single identity source for Tasks 12 and 13.

- [ ] **Step 1: Create `src/data/profile.json`**

Every value here already exists in the codebase — copy it, do not invent. `intro` is the existing About paragraph; `tagline` is the existing Hero line.

```json
{
  "name": "Mahmudur Rahman",
  "initials": "MR",
  "tagline": "Software Engineer — I own systems in production, not just features.",
  "intro": "Backend-focused full-stack engineer with ~4 years owning systems in production. I design, deploy, monitor, and keep services stable under real traffic — and I decide what is worth building before I build it. I care about bottlenecks, run cost, failure modes, and the business number on the other side of the change.",
  "location": "Bangladesh",
  "email": "mahmud6799@gmail.com",
  "resume": "/Mahmudur_Rahman.pdf",
  "availability": { "status": "Open to work", "tone": "green" },
  "socials": [
    { "label": "GitHub", "url": "https://github.com/Mahmud-007", "icon": "github" },
    { "label": "LinkedIn", "url": "https://www.linkedin.com/in/rahman-mahmud/", "icon": "linkedin" },
    { "label": "X", "url": "https://x.com/Rahman007Mahmud", "icon": "x" },
    { "label": "Medium", "url": "https://medium.com/@mahmud6799", "icon": "medium" },
    { "label": "YouTube", "url": "https://www.youtube.com/@mahmudurrahman8104", "icon": "youtube" }
  ]
}
```

Note: Facebook and Instagram from the current `Contact.tsx` are dropped — they are not professional proof and dilute the positioning. Medium is added because `articles.json` already links there.

- [ ] **Step 2: Rebuild `src/components/sections/Hero.tsx`**

Keeps the terminal frame and the four metrics. Adds: the availability pill, typed prompt lines, count-up metrics, and the About intro folded in.

```tsx
import React from 'react';
import Terminal from '../ui/Terminal';
import StatusPill from '../ui/StatusPill';
import TypeLine from '../ui/TypeLine';
import CountUp from '../ui/CountUp';
import profile from '../../data/profile.json';
import type { Profile } from '../../types';

const p = profile as unknown as Profile;

const metrics = [
  { value: '70%', label: 'cache hit rate' },
  { value: '32.4%', label: 'MAU growth' },
  { value: '<100ms', label: 'search retrieval' },
  { value: '30m→2m', label: 'ops automation' },
];

const Hero = () => {
  const [stage, setStage] = React.useState(0);

  return (
    <section
      id="home"
      className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8"
    >
      <div className="max-w-4xl w-full mx-auto">
        <Terminal title="mahmud: ~/production" bodyClassName="p-5 sm:p-10">
          <p className="text-slate-light">
            <span className="text-status-green">$</span>{' '}
            <TypeLine text="whoami" onDone={() => setStage(1)} />
          </p>

          <h1 className="text-3xl sm:text-5xl font-bold text-slate-lightest mt-2 font-sans tracking-tight">
            {p.name}
          </h1>
          <p className="text-teal font-sans text-lg sm:text-xl mt-1">{p.tagline}</p>

          <div className="mt-4">
            <StatusPill status={p.availability.status} tone={p.availability.tone} />
          </div>

          <p className="text-slate-light mt-4 sm:mt-6">
            <span className="text-status-green">$</span>{' '}
            {stage >= 1 && <TypeLine text="systemctl status --user impact" />}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-lg border border-navy-700 bg-navy-900/50 p-3">
                <div className="text-status-green text-xl sm:text-2xl font-bold">
                  <CountUp value={m.value} />
                </div>
                <div className="text-slate-light text-xs mt-1">{m.label}</div>
              </div>
            ))}
          </div>

          <p className="text-slate-light mt-4 sm:mt-6">
            <span className="text-status-green">$</span> cat ./intro.txt
          </p>
          <p className="text-slate-light font-sans max-w-2xl mt-2 leading-relaxed">{p.intro}</p>

          <div className="flex flex-wrap gap-4 mt-5 sm:mt-8 font-sans">
            <a
              href="#work"
              className="px-6 py-3 bg-teal text-navy-900 rounded border border-teal hover:bg-teal/80 transition-colors duration-300 font-bold text-sm"
            >
              See how I decide
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-teal text-teal rounded hover:bg-teal/10 transition-colors duration-300 text-sm"
            >
              Contact
            </a>
          </div>

          <p className="text-slate-light mt-5 sm:mt-8">
            <span className="text-status-green">$</span> cat ./case-studies/{' '}
            <span className="cursor-blink">▊</span>
          </p>
        </Terminal>
      </div>
    </section>
  );
};

export default Hero;
```

Note the primary CTA now points at `#work` rather than GitHub. The GitHub link is not lost — Task 11 gives it a whole section.

- [ ] **Step 3: Delete About and drop it from the page**

```bash
git rm src/components/sections/About.tsx
```

Remove the `import About` line and the `<About />` element from `src/pages/index.tsx`.

- [ ] **Step 4: Typecheck and preview**

Run `npx tsc --noEmit` (exit 0), then preview `/`. Confirm: `whoami` types out, then the second prompt types, metrics count up, the green `Open to work` pill renders, console clean.

- [ ] **Step 5: Commit**

```bash
git add -A src/data/profile.json src/components/sections src/pages/index.tsx
git commit -m "feat: rebuild hero with availability, typed prompts, count-up metrics"
```

---

### Task 6: `principles.json` and the Principles section

The positioning core. This is the section that makes the rest read as evidence.

**Files:**
- Create: `src/data/principles.json`
- Create: `src/components/sections/Principles.tsx`
- Modify: `src/pages/index.tsx`

**Interfaces:**
- Consumes: `SectionHeading`, `Reveal`, `Principle` type.
- Produces: `<Principles />` at `id="principles"`; `evidence` slugs link to `/work/<slug>` (live after Task 10).

- [ ] **Step 1: Create `src/data/principles.json`**

The four questions from the spec. Bodies are written from the user's own stated persona and existing project context — no new facts, no invented numbers.

```json
[
  {
    "command": "./is-it-worth-building",
    "title": "Is this worth building?",
    "body": "The cheapest system is the one you talked yourself out of. Before I design anything I want to know who is blocked, how often, and what it costs them today. If the honest answer is a config change or a runbook, that is the deliverable. When the answer is real, the case is easy to make and easy to defend later.",
    "evidence": "widget-builder"
  },
  {
    "command": "./what-does-it-cost",
    "title": "What does it cost — to build and to run?",
    "body": "Engineering time is the visible cost; the run cost is the one that compounds. I price the request path before I commit to it — what it calls, what it stores, what it re-computes. A design that is elegant and quietly expensive per request is not a design I want to defend twelve months in.",
    "evidence": "storylens"
  },
  {
    "command": "./what-breaks-at-3am",
    "title": "What is the operational risk?",
    "body": "Every system fails; the question is whether it fails loudly, partially, and recoverably. I ask what happens under a burst, what happens when a dependency is slow rather than down, and what the on-call person can actually do about it. Retries, backoff, and queues are cheaper than an incident.",
    "evidence": "data-pipeline"
  },
  {
    "command": "./what-number-moved",
    "title": "What business outcome does this create?",
    "body": "A change that nobody can measure is a change nobody will defend when priorities shift. I want the metric named before the work starts and the baseline recorded, so afterwards the claim is arithmetic rather than opinion. Latency, cost per request, hours returned to a team — all of them count, none of them are assumed.",
    "evidence": "banglapapers"
  }
]
```

- [ ] **Step 2: Create `src/components/sections/Principles.tsx`**

```tsx
import React from 'react';
import { Link } from 'gatsby';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import principles from '../../data/principles.json';
import type { Principle } from '../../types';

const Principles = () => (
  <section id="principles" className="py-20 px-4 sm:px-6 lg:px-8 bg-content-surface/40">
    <div className="max-w-5xl mx-auto">
      <SectionHeading label="how I decide" />

      <p className="text-slate-light max-w-2xl mb-10 leading-relaxed">
        Four questions I ask before I write anything. The work below is the evidence.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {(principles as Principle[]).map((principle, i) => (
          <Reveal key={principle.command} delay={i * 0.06}>
            <div className="h-full rounded-lg border border-navy-700 bg-navy-800/60 p-6 hover:border-teal/40 transition-colors duration-300">
              <p className="font-mono text-xs text-slate-light mb-3">
                <span className="text-status-green">$</span> {principle.command}
              </p>
              <h3 className="text-lg font-bold text-slate-lightest mb-3">{principle.title}</h3>
              <p className="text-sm text-slate-light leading-relaxed">{principle.body}</p>
              {principle.evidence && (
                <Link
                  to={`/work/${principle.evidence}/`}
                  className="inline-block mt-4 font-mono text-xs text-teal hover:text-teal/80 transition-colors"
                >
                  → see it applied
                </Link>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Principles;
```

- [ ] **Step 3: Insert into the page**

In `src/pages/index.tsx`, import `Principles` and place `<Principles />` directly after `<Hero />`.

- [ ] **Step 4: Typecheck and preview**

`npx tsc --noEmit` exits 0; preview `/` and confirm four cards reveal on scroll. The `→ see it applied` links will 404 until Task 10 — expected, do not "fix" it.

- [ ] **Step 5: Commit**

```bash
git add src/data/principles.json src/components/sections/Principles.tsx src/pages/index.tsx
git commit -m "feat: add how-I-decide principles section"
```

---

### Task 7: `projects.json` extension and the filterable Work section

**Files:**
- Modify: `src/data/projects.json`
- Create: `src/components/ui/FilterChips.tsx`
- Create: `src/components/sections/Work.tsx`
- Delete: `src/components/sections/Projects.tsx`
- Modify: `src/pages/index.tsx`

**Interfaces:**
- Consumes: `SectionHeading`, `Reveal`, `Tag`, `Project`, `WorkCategory`.
- Produces: `<Work />` at `id="work"`; `<FilterChips options categories active onChange />`.

- [ ] **Step 1: Rewrite `src/data/projects.json`**

Nine entries: the five case studies first, then the four existing projects. Summaries for the case-study entries are drawn from `experience.json` — no new claims. Domka's summary is the one line the user gave; everything else about it is `TODO`.

```json
[
  {
    "title": "Domka",
    "summary": "An AI-native newsroom automation tool. Personal product.",
    "tags": ["TODO"],
    "category": "Product",
    "caseStudySlug": "domka",
    "status": "Personal product",
    "year": "TODO",
    "metric": "TODO"
  },
  {
    "title": "Storylens",
    "summary": "Event-driven LLM backend turning articles into visual summaries. Semantic prompt caching held sub-second p50 while cutting per-article model spend.",
    "tags": ["Node.js", "AWS Lambda", "LLM", "Event-Driven", "Caching"],
    "category": "AI & LLM",
    "caseStudySlug": "storylens",
    "status": "In production",
    "metric": "70% cache hit · 300%+ ROI"
  },
  {
    "title": "Widget Builder",
    "summary": "Internal widget-generation engine so non-engineers ship production-ready widgets without a developer cycle.",
    "tags": ["Node.js", "Internal Tooling", "Automation"],
    "category": "Tooling",
    "caseStudySlug": "widget-builder",
    "status": "In production",
    "metric": "30m → <2m"
  },
  {
    "title": "Data Pipeline Fault Tolerance",
    "summary": "10 data parsers on the ELK stack across AWS ECS and Lambda. Peak-event bursts dropped feeds until async queuing and exponential backoff eliminated the loss.",
    "tags": ["ELK", "AWS ECS", "AWS Lambda", "Queuing", "Fault Tolerance"],
    "category": "Backend & Distributed",
    "caseStudySlug": "data-pipeline",
    "status": "In production",
    "metric": "0 dropped feeds"
  },
  {
    "title": "Banglapapers",
    "summary": "AI news platform aggregating 10+ publisher feeds with OpenSearch semantic indexing, tuned for sub-100ms retrieval.",
    "tags": ["OpenSearch", "Semantic Search", "Node.js", "AWS"],
    "category": "AI & LLM",
    "caseStudySlug": "banglapapers",
    "status": "In production",
    "metric": "<100ms retrieval"
  },
  {
    "title": "Adaptive Restaurant Forecasting Engine",
    "summary": "An AI-driven POC forecasting demand, staffing, and inventory with feedback loops for continuously improving model accuracy.",
    "tags": ["FastAPI", "Python", "LightGBM", "SGDRegressor", "Streamlit", "React"],
    "category": "AI & LLM",
    "link": "https://github.com/Mahmud-007",
    "metric": "Self-learning POC"
  },
  {
    "title": "Swapnanagar — Charity Platform",
    "summary": "A content-driven donation platform with campaign handling and PayPal-based payment flow, built with Figma MCP and a Strapi CMS; SEO-friendly and performance-optimized.",
    "tags": ["React", "Strapi", "PayPal", "MongoDB", "Node.js"],
    "category": "Product",
    "link": "https://www.swapnanagar.org/"
  },
  {
    "title": "FootyLight Soccer Highlights",
    "summary": "A mobile app serving global football fans with highlights, live updates, and personalized content across iOS and Android, backed by 4 microservices.",
    "tags": ["React Native", "Node.js", "AWS", "Microservices"],
    "category": "Product",
    "link": "https://apps.apple.com/us/app/footylight-soccer-highlights/id549404480"
  },
  {
    "title": "Hyperledger Fabric Management System",
    "summary": "A management interface for Hyperledger Fabric that removes CLI complexity for Docker-based network operations.",
    "tags": ["Hyperledger Fabric", "Docker", "Node.js"],
    "category": "Tooling",
    "link": "https://github.com/Mahmud-007/HyperledgerFabric-Management-System"
  }
]
```

- [ ] **Step 2: Create `src/components/ui/FilterChips.tsx`**

```tsx
import React from 'react';
import { cn } from '../../utils/cn';

interface FilterChipsProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
  counts?: Record<string, number>;
}

const FilterChips: React.FC<FilterChipsProps> = ({ options, active, onChange, counts }) => (
  <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter work by category">
    {options.map((option) => {
      const isActive = option === active;
      return (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={isActive}
          className={cn(
            'font-mono text-xs rounded border px-3 py-1.5 transition-colors duration-200',
            isActive
              ? 'border-teal text-teal bg-teal/10'
              : 'border-navy-700 text-slate-light hover:border-teal/40 hover:text-teal'
          )}
        >
          {option}
          {counts && counts[option] !== undefined && (
            <span className="ml-2 text-slate-light/50">{counts[option]}</span>
          )}
        </button>
      );
    })}
  </div>
);

export default FilterChips;
```

- [ ] **Step 3: Create `src/components/sections/Work.tsx`**

```tsx
import React from 'react';
import { Link } from 'gatsby';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import FilterChips from '../ui/FilterChips';
import Tag from '../ui/Tag';
import TodoBadge from '../ui/TodoBadge';
import projects from '../../data/projects.json';
import { isTodo, listField } from '../../utils/todo';
import type { Project } from '../../types';

const ALL = 'All';
const CATEGORIES = [ALL, 'Backend & Distributed', 'AI & LLM', 'Product', 'Tooling'];

const Work = () => {
  const [active, setActive] = React.useState(ALL);
  const reduced = useReducedMotion();
  const all = projects as unknown as Project[];

  const counts = React.useMemo(() => {
    const result: Record<string, number> = { [ALL]: all.length };
    for (const category of CATEGORIES.slice(1)) {
      result[category] = all.filter((p) => p.category === category).length;
    }
    return result;
  }, [all]);

  const visible = active === ALL ? all : all.filter((p) => p.category === active);

  return (
    <section id="work" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading label="work" />

        <FilterChips options={CATEGORIES} active={active} onChange={setActive} counts={counts} />

        <motion.div layout={!reduced} className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.article
                key={project.title}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="bg-navy-800 p-6 rounded-lg border border-navy-700 hover:border-teal/40 transition-colors duration-300 flex flex-col h-full group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  {project.metric &&
                    (isTodo(project.metric) ? <TodoBadge label="metric TODO" /> : <Tag tone="green">{project.metric}</Tag>)}
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-light/50 ml-auto">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-lightest mb-2 group-hover:text-teal transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-light mb-4 flex-grow text-sm leading-relaxed">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {listField(project.tags).map((tag) =>
                    isTodo(tag) ? (
                      <TodoBadge key={tag} label="tags TODO" />
                    ) : (
                      <span key={tag} className="text-xs font-mono text-slate-light/70">{tag}</span>
                    )
                  )}
                </div>

                <div className="mt-auto flex items-center gap-4 font-mono text-xs">
                  {project.caseStudySlug && (
                    <Link
                      to={`/work/${project.caseStudySlug}/`}
                      className="text-teal hover:text-teal/80 transition-colors"
                    >
                      read case study →
                    </Link>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-light hover:text-teal transition-colors"
                    >
                      visit ↗
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Work;
```

- [ ] **Step 4: Swap Projects for Work in the page**

```bash
git rm src/components/sections/Projects.tsx
```

In `src/pages/index.tsx`, replace the `Projects` import and `<Projects />` element with `Work` / `<Work />`, positioned after `<Principles />`.

- [ ] **Step 5: Typecheck and preview**

`npx tsc --noEmit` exits 0. Preview `/`, click through all five filter chips, confirm cards animate and counts are right (All 9, Backend & Distributed 1, AI & LLM 3, Product 3, Tooling 2). Console clean.

- [ ] **Step 6: Commit**

```bash
git add -A src/data/projects.json src/components src/pages/index.tsx
git commit -m "feat: add filterable work section with case study links"
```

---

### Task 8: `caseStudies.json` seed data

Data only, no components. **The TODO rule is at maximum force in this task** — the executor must not fill in a cost, a risk, a baseline, or a measurement method that the user has not stated. Everything factual here traces back to `experience.json` or to the user's own words about Domka.

**Files:**
- Create: `src/data/caseStudies.json`

**Interfaces:**
- Consumes: the `CaseStudy` type from Task 1.
- Produces: `src/data/caseStudies.json`, read by Tasks 9 and 10.

- [ ] **Step 1: Create `src/data/caseStudies.json`**

Five objects in this order: `domka`, `storylens`, `widget-builder`, `data-pipeline`, `banglapapers`. Every object carries every key in the `CaseStudy` interface — absent keys break the template.

Start from this exact skeleton for each entry, then overwrite only the fields listed as known in the table below. Anything not named there stays exactly as written here.

```json
{
  "slug": "",
  "title": "",
  "category": "",
  "role": "TODO",
  "period": "TODO",
  "status": "",
  "oneLiner": "",
  "stack": ["TODO"],
  "problem": { "context": "TODO", "trigger": "TODO" },
  "decision": {
    "question": "Is this worth building?",
    "options": [],
    "chose": "TODO",
    "rejected": "TODO",
    "why": "TODO"
  },
  "cost": { "engineering": "TODO", "run": "TODO", "timeline": "TODO" },
  "risk": { "operational": "TODO", "failureModes": ["TODO"], "mitigations": ["TODO"] },
  "impact": { "metrics": [], "businessOutcome": "TODO" },
  "architecture": { "steps": [] },
  "retro": "TODO",
  "links": []
}
```

Domka is the skeleton verbatim with only `slug`, `title`, `category`, `status` and `oneLiner` filled — do not "improve" it.

Known content per study (everything else is `"TODO"`, and `TODO` list fields are written as `["TODO"]`):

| slug | known fields |
|---|---|
| `domka` | `title` "Domka", `category` "Product", `status` "Personal product", `oneLiner` "An AI-native newsroom automation tool." — **all other fields `TODO`**, including `role`, `period`, `stack`, every block |
| `storylens` | `category` "AI & LLM", `status` "In production", `role` "Software Engineer — design, build, operate", `period` "Apr 2022 – Present", `oneLiner` from `projects.json`, `stack` `["Node.js","AWS Lambda","LLM","Event-Driven","Caching"]`, `problem.context` "Every article re-ran the full LLM pipeline.", `decision.why` "Accepted eventual staleness in exchange for latency and cost.", `decision.chose` "Semantic prompt caching in front of the LLM pipeline.", `impact.metrics` = `[{label:"cache hit rate", value:"70%", baseline:"TODO", howMeasured:"TODO"}, {label:"ROI", value:"300%+", baseline:"TODO", howMeasured:"TODO"}, {label:"p50 response", value:"<1s", baseline:"TODO", howMeasured:"TODO"}]` |
| `widget-builder` | `category` "Tooling", `status` "In production", `role`/`period` as above, `oneLiner` from `projects.json`, `problem.context` "Producing a production-ready widget was a repetitive 30-minute manual workflow that required a developer.", `impact.metrics` = `[{label:"time to ship a widget", value:"30m → <2m", baseline:"30 minutes, developer-led", howMeasured:"TODO"}]`, `impact.businessOutcome` "Non-engineers ship production-ready widgets without a developer cycle." |
| `data-pipeline` | `category` "Backend & Distributed", `status` "In production", `role`/`period` as above, `stack` `["ELK","AWS ECS","AWS Lambda","Queuing"]`, `problem.trigger` "Peak-event bursts dropped feeds.", `decision.chose` "Async queuing with exponential backoff.", `risk.failureModes` `["Feed loss during peak-event bursts"]`, `risk.mitigations` `["Async queuing","Exponential backoff"]`, `impact.metrics` = `[{label:"dropped feeds", value:"0", baseline:"TODO", howMeasured:"TODO"}, {label:"parsers operated", value:"10", baseline:"TODO", howMeasured:"TODO"}]` |
| `banglapapers` | `category` "AI & LLM", `status` "In production", `role`/`period` as above, `stack` `["OpenSearch","Semantic Search","Node.js","AWS"]`, `problem.context` "Aggregating 10+ publisher feeds into one searchable index.", `impact.metrics` = `[{label:"retrieval latency", value:"<100ms", baseline:"TODO", howMeasured:"TODO"}, {label:"publisher feeds", value:"10+", baseline:"TODO", howMeasured:"TODO"}]` |

For every study, `decision.options` is `[]` unless the user supplies alternatives — an empty array is honest, a fabricated rejected option is not. `architecture.steps` is `[]` for all five for the same reason.

- [ ] **Step 2: Validate the JSON parses and matches the type**

Create a scratch file and run it, then delete it:

```bash
npx tsc --noEmit
node -e "const d=require('./src/data/caseStudies.json'); const keys=['slug','title','category','role','period','status','oneLiner','stack','problem','decision','cost','risk','impact','architecture','retro','links']; d.forEach(c=>{const missing=keys.filter(k=>!(k in c)); if(missing.length) throw new Error(c.slug+' missing: '+missing.join(','));}); console.log('ok', d.length, 'case studies');"
```

Expected: `ok 5 case studies`.

- [ ] **Step 3: Commit**

```bash
git add src/data/caseStudies.json
git commit -m "feat: seed case study data with TODO placeholders for unknown values"
```

---

### Task 9: Case study content blocks

**Files:**
- Create: `src/components/case-study/ImpactStrip.tsx`, `DecisionTable.tsx`, `CostBlock.tsx`, `RiskBlock.tsx`, `ArchFlow.tsx`

**Interfaces:**
- Consumes: `CountUp`, `Tag`, `TodoBadge`, `field`, `listField`, `allTodo`, `isTodo`, and the `Metric` / `DecisionOption` / `CaseStudy` types.
- Produces:
  - `<ImpactStrip metrics={Metric[]} />`
  - `<DecisionTable decision={CaseStudy['decision']} />`
  - `<CostBlock cost={CaseStudy['cost']} />`
  - `<RiskBlock risk={CaseStudy['risk']} />`
  - `<ArchFlow steps={string[]} />`
  - Each returns `null` when all of its data is TODO in a production build.

- [ ] **Step 1: Create `src/components/case-study/ImpactStrip.tsx`**

```tsx
import React from 'react';
import CountUp from '../ui/CountUp';
import TodoBadge from '../ui/TodoBadge';
import { field } from '../../utils/todo';
import type { Metric } from '../../types';

const ImpactStrip: React.FC<{ metrics: Metric[] }> = ({ metrics }) => {
  const usable = metrics.filter((m) => field(m.value) !== null);
  if (usable.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-8">
      {usable.map((metric) => {
        const value = field(metric.value);
        const baseline = field(metric.baseline);
        return (
          <div key={metric.label} className="rounded-lg border border-navy-700 bg-navy-900/50 p-4">
            <div className="text-status-green text-2xl font-bold font-mono">
              {value?.todo ? <TodoBadge /> : <CountUp value={metric.value} />}
            </div>
            <div className="text-slate-light text-xs mt-1">{metric.label}</div>
            {baseline && (
              <div className="text-slate-light/50 text-[11px] font-mono mt-2">
                {baseline.todo ? <TodoBadge label="baseline TODO" /> : `from ${baseline.value}`}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImpactStrip;
```

- [ ] **Step 2: Create `src/components/case-study/DecisionTable.tsx`**

Renders the options table only when options exist. The `chose` / `rejected` / `why` prose renders independently, so a study with no alternatives still shows its reasoning.

```tsx
import React from 'react';
import Tag from '../ui/Tag';
import TodoBadge from '../ui/TodoBadge';
import { field } from '../../utils/todo';
import type { CaseStudy } from '../../types';

const verdictTone = { chosen: 'green', rejected: 'default', considered: 'teal' } as const;

const DecisionTable: React.FC<{ decision: CaseStudy['decision'] }> = ({ decision }) => {
  const chose = field(decision.chose);
  const rejected = field(decision.rejected);
  const why = field(decision.why);
  const options = decision.options ?? [];

  if (!chose && !rejected && !why && options.length === 0) return null;

  return (
    <div className="space-y-6">
      {options.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-navy-700">
          <table className="w-full text-sm font-mono">
            <thead className="bg-navy-900/70 text-slate-light/70">
              <tr>
                <th className="text-left p-3 font-normal">option</th>
                <th className="text-left p-3 font-normal">cost</th>
                <th className="text-left p-3 font-normal">risk</th>
                <th className="text-left p-3 font-normal">verdict</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option) => (
                <tr key={option.name} className="border-t border-navy-700">
                  <td className="p-3 text-slate-lightest">{option.name}</td>
                  <td className="p-3 text-slate-light">{option.cost}</td>
                  <td className="p-3 text-slate-light">{option.risk}</td>
                  <td className="p-3">
                    <Tag tone={verdictTone[option.verdict]}>{option.verdict}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <dl className="space-y-4 text-sm">
        {chose && (
          <div>
            <dt className="font-mono text-xs text-status-green mb-1">chose</dt>
            <dd className="text-slate-light">{chose.todo ? <TodoBadge /> : chose.value}</dd>
          </div>
        )}
        {rejected && (
          <div>
            <dt className="font-mono text-xs text-slate-light/60 mb-1">rejected</dt>
            <dd className="text-slate-light">{rejected.todo ? <TodoBadge /> : rejected.value}</dd>
          </div>
        )}
        {why && (
          <div>
            <dt className="font-mono text-xs text-teal mb-1">why</dt>
            <dd className="text-slate-light">{why.todo ? <TodoBadge /> : why.value}</dd>
          </div>
        )}
      </dl>
    </div>
  );
};

export default DecisionTable;
```

- [ ] **Step 3: Create `src/components/case-study/CostBlock.tsx`**

```tsx
import React from 'react';
import TodoBadge from '../ui/TodoBadge';
import { field } from '../../utils/todo';
import type { CaseStudy } from '../../types';

const LABELS: Array<[keyof CaseStudy['cost'], string]> = [
  ['engineering', 'engineering cost'],
  ['run', 'run cost'],
  ['timeline', 'timeline'],
];

const CostBlock: React.FC<{ cost: CaseStudy['cost'] }> = ({ cost }) => {
  const rows = LABELS.map(([key, label]) => ({ label, resolved: field(cost[key]) })).filter(
    (row) => row.resolved !== null
  );

  if (rows.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {rows.map((row) => (
        <div key={row.label} className="rounded-lg border border-navy-700 bg-content-surface/70 p-4">
          <p className="font-mono text-xs text-slate-light/60 mb-2">{row.label}</p>
          <p className="text-sm text-slate-lightest">
            {row.resolved?.todo ? <TodoBadge /> : row.resolved?.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CostBlock;
```

- [ ] **Step 4: Create `src/components/case-study/RiskBlock.tsx`**

```tsx
import React from 'react';
import TodoBadge from '../ui/TodoBadge';
import { field, listField, isTodo } from '../../utils/todo';
import type { CaseStudy } from '../../types';

const List: React.FC<{ title: string; items: string[]; marker: string; tone: string }> = ({
  title,
  items,
  marker,
  tone,
}) => {
  const usable = listField(items);
  if (usable.length === 0) return null;
  return (
    <div>
      <p className="font-mono text-xs text-slate-light/60 mb-3">{title}</p>
      <ul className="space-y-2">
        {usable.map((item) => (
          <li key={item} className="flex items-start text-sm text-slate-light">
            <span className={`mr-2 font-mono ${tone}`}>{marker}</span>
            {isTodo(item) ? <TodoBadge /> : <span>{item}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

const RiskBlock: React.FC<{ risk: CaseStudy['risk'] }> = ({ risk }) => {
  const operational = field(risk.operational);
  const modes = listField(risk.failureModes);
  const mitigations = listField(risk.mitigations);

  if (!operational && modes.length === 0 && mitigations.length === 0) return null;

  return (
    <div className="space-y-6">
      {operational && (
        <p className="text-slate-light text-sm leading-relaxed">
          {operational.todo ? <TodoBadge /> : operational.value}
        </p>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <List title="failure modes" items={risk.failureModes} marker="✗" tone="text-orange-soft" />
        <List title="mitigations" items={risk.mitigations} marker="✓" tone="text-status-green" />
      </div>
    </div>
  );
};

export default RiskBlock;
```

- [ ] **Step 5: Create `src/components/case-study/ArchFlow.tsx`**

```tsx
import React from 'react';
import { listField } from '../../utils/todo';

const ArchFlow: React.FC<{ steps: string[] }> = ({ steps }) => {
  const usable = listField(steps);
  if (usable.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
      {usable.map((step, i) => (
        <React.Fragment key={step}>
          <span className="rounded border border-navy-700 bg-navy-900/60 px-3 py-2 text-slate-lightest">
            {step}
          </span>
          {i < usable.length - 1 && <span className="text-teal">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ArchFlow;
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0. Nothing renders these yet — Task 10 wires them up.

- [ ] **Step 7: Commit**

```bash
git add src/components/case-study
git commit -m "feat: add case study impact, decision, cost, risk, and architecture blocks"
```

---

### Task 10: CaseStudy template and `gatsby-node.ts` page generation — BUILD GATE

**Files:**
- Create: `gatsby-node.ts`
- Create: `src/templates/CaseStudy.tsx`

**Interfaces:**
- Consumes: `caseStudies.json`, all Task 9 blocks, `Layout`, `Terminal`, `Tag`.
- Produces: routes `/work/domka/`, `/work/storylens/`, `/work/widget-builder/`, `/work/data-pipeline/`, `/work/banglapapers/`. `pageContext` shape: `{ caseStudy: CaseStudy, prev: {slug,title} | null, next: {slug,title} | null }`.

- [ ] **Step 1: Create `gatsby-node.ts`**

```ts
import * as path from 'path';
import type { GatsbyNode } from 'gatsby';
import caseStudies from './src/data/caseStudies.json';
import type { CaseStudy } from './src/types';

export const createPages: GatsbyNode['createPages'] = async ({ actions }) => {
  const studies = caseStudies as unknown as CaseStudy[];
  const template = path.resolve('./src/templates/CaseStudy.tsx');

  studies.forEach((caseStudy, index) => {
    const prev = index > 0 ? studies[index - 1] : null;
    const next = index < studies.length - 1 ? studies[index + 1] : null;

    actions.createPage({
      path: `/work/${caseStudy.slug}/`,
      component: template,
      context: {
        caseStudy,
        prev: prev ? { slug: prev.slug, title: prev.title } : null,
        next: next ? { slug: next.slug, title: next.title } : null,
      },
    });
  });
};
```

- [ ] **Step 2: Create `src/templates/CaseStudy.tsx`**

```tsx
import React from 'react';
import { Link, type HeadFC, type PageProps } from 'gatsby';
import Layout from '../components/layout/Layout';
import Terminal from '../components/ui/Terminal';
import Tag from '../components/ui/Tag';
import TodoBadge from '../components/ui/TodoBadge';
import ImpactStrip from '../components/case-study/ImpactStrip';
import DecisionTable from '../components/case-study/DecisionTable';
import CostBlock from '../components/case-study/CostBlock';
import RiskBlock from '../components/case-study/RiskBlock';
import ArchFlow from '../components/case-study/ArchFlow';
import { field, listField, isTodo } from '../utils/todo';
import type { CaseStudy as CaseStudyType } from '../types';

interface Neighbor {
  slug: string;
  title: string;
}

interface Context {
  caseStudy: CaseStudyType;
  prev: Neighbor | null;
  next: Neighbor | null;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  if (!children) return null;
  return (
    <section className="py-8 border-t border-rule">
      <h2 className="font-mono text-sm text-teal mb-5">{`// ${title}`}</h2>
      {children}
    </section>
  );
};

const CaseStudyTemplate: React.FC<PageProps<object, Context>> = ({ pageContext }) => {
  const { caseStudy, prev, next } = pageContext;
  const context = field(caseStudy.problem.context);
  const trigger = field(caseStudy.problem.trigger);
  const outcome = field(caseStudy.impact.businessOutcome);
  const retro = field(caseStudy.retro);
  const role = field(caseStudy.role);
  const period = field(caseStudy.period);

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/#work" className="font-mono text-xs text-slate-light hover:text-teal transition-colors">
          ← cd ~/work
        </Link>

        <Terminal title={`~/work/${caseStudy.slug}`} className="mt-6">
          <p className="text-slate-light text-xs">
            <span className="text-status-green">$</span> cat ./{caseStudy.slug}/README.md
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-lightest font-sans mt-3">
            {caseStudy.title}
          </h1>
          <p className="text-slate-light font-sans mt-2 leading-relaxed">{caseStudy.oneLiner}</p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Tag tone="green">{caseStudy.status}</Tag>
            <Tag tone="teal">{caseStudy.category}</Tag>
            {period && <Tag>{period.todo ? 'TODO' : period.value}</Tag>}
          </div>
          {role && (
            <p className="font-mono text-xs text-slate-light/70 mt-3">
              {role.todo ? <TodoBadge label="role TODO" /> : role.value}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {listField(caseStudy.stack).map((item) =>
              isTodo(item) ? (
                <TodoBadge key={item} label="stack TODO" />
              ) : (
                <span key={item} className="font-mono text-xs text-slate-light/70">{item}</span>
              )
            )}
          </div>
        </Terminal>

        <ImpactStrip metrics={caseStudy.impact.metrics} />

        <Section title="the problem">
          {(context || trigger) && (
            <div className="space-y-3 text-slate-light text-sm leading-relaxed">
              {context && <p>{context.todo ? <TodoBadge /> : context.value}</p>}
              {trigger && <p>{trigger.todo ? <TodoBadge /> : trigger.value}</p>}
            </div>
          )}
        </Section>

        <Section title="the decision">
          <DecisionTable decision={caseStudy.decision} />
        </Section>

        <Section title="what it cost">
          <CostBlock cost={caseStudy.cost} />
        </Section>

        <Section title="operational risk">
          <RiskBlock risk={caseStudy.risk} />
        </Section>

        <Section title="impact">
          {outcome && (
            <p className="text-slate-light text-sm leading-relaxed">
              {outcome.todo ? <TodoBadge /> : outcome.value}
            </p>
          )}
        </Section>

        <Section title="architecture">
          <ArchFlow steps={caseStudy.architecture.steps} />
        </Section>

        <Section title="what I'd do differently">
          {retro && (
            <p className="text-slate-light text-sm leading-relaxed">
              {retro.todo ? <TodoBadge /> : retro.value}
            </p>
          )}
        </Section>

        {caseStudy.links.length > 0 && (
          <div className="flex flex-wrap gap-4 py-8 border-t border-rule font-mono text-xs">
            {caseStudy.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-teal hover:text-teal/80 transition-colors"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}

        <nav className="flex justify-between gap-4 pt-8 border-t border-rule font-mono text-xs">
          {prev ? (
            <Link to={`/work/${prev.slug}/`} className="text-slate-light hover:text-teal transition-colors">
              ← {prev.title}
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/work/${next.slug}/`} className="text-slate-light hover:text-teal transition-colors">
              {next.title} →
            </Link>
          ) : <span />}
        </nav>
      </article>
    </Layout>
  );
};

export default CaseStudyTemplate;

export const Head: HeadFC<object, Context> = ({ pageContext }) => (
  <>
    <title>{pageContext.caseStudy.title} — Mahmudur Rahman</title>
    <meta name="description" content={pageContext.caseStudy.oneLiner} />
  </>
);
```

- [ ] **Step 3: BUILD GATE**

Run: `npm run build`
Expected: exit 0, and the log lists five `/work/...` pages created. Confirm the directories exist:

```bash
ls public/work
```

Expected: `banglapapers  data-pipeline  domka  storylens  widget-builder`.

- [ ] **Step 4: Preview all five routes**

Preview and load `/work/storylens/`, `/work/domka/`, `/work/widget-builder/`, `/work/data-pipeline/`, `/work/banglapapers/`. In develop, TODO fields show amber badges. Confirm `/work/domka/` renders header plus badges without crashing — it is nearly all TODO and is the hardest case.

- [ ] **Step 5: Commit**

```bash
git add gatsby-node.ts src/templates
git commit -m "feat: generate /work/<slug> case study pages"
```

---

### Task 11: Build-time GitHub stats with fallback — BUILD GATE

**Files:**
- Create: `src/data/github.json`
- Modify: `gatsby-node.ts`

**Interfaces:**
- Consumes: `GithubStats` type.
- Produces: a GraphQL node type `GithubStats` with fields `login`, `publicRepos`, `followers`, `totalStars`, `languages { name count }`, `recentRepos { name description stars language pushedAt url }`, `fetchedAt`. Task 12 queries it.

- [ ] **Step 1: Create `src/data/github.json` as the fallback**

Values here must be conservative and clearly real-or-zero — this file is what ships when the API is unreachable, so it must never overstate. Use zeros and an empty list; the section hides empty data rather than showing a wrong number.

```json
{
  "login": "Mahmud-007",
  "publicRepos": 0,
  "followers": 0,
  "totalStars": 0,
  "languages": [],
  "recentRepos": [],
  "fetchedAt": ""
}
```

- [ ] **Step 2: Add `sourceNodes` to `gatsby-node.ts`**

Append to the existing file:

```ts
import githubFallback from './src/data/github.json';
import type { GithubRepo, GithubStats } from './src/types';

const GITHUB_USER = 'Mahmud-007';

interface ApiUser {
  public_repos: number;
  followers: number;
}

interface ApiRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  html_url: string;
  fork: boolean;
}

async function fetchGithubStats(reporter: {
  warn: (message: string) => void;
}): Promise<GithubStats> {
  try {
    const headers = { Accept: 'application/vnd.github+json', 'User-Agent': GITHUB_USER };

    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, { headers }),
    ]);

    if (!userResponse.ok || !reposResponse.ok) {
      throw new Error(`github responded ${userResponse.status}/${reposResponse.status}`);
    }

    const user = (await userResponse.json()) as ApiUser;
    const repos = ((await reposResponse.json()) as ApiRepo[]).filter((repo) => !repo.fork);

    const languageCounts = new Map<string, number>();
    for (const repo of repos) {
      if (!repo.language) continue;
      languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
    }

    const recentRepos: GithubRepo[] = repos.slice(0, 6).map((repo) => ({
      name: repo.name,
      description: repo.description ?? '',
      stars: repo.stargazers_count,
      language: repo.language ?? '',
      pushedAt: repo.pushed_at,
      url: repo.html_url,
    }));

    return {
      login: GITHUB_USER,
      publicRepos: user.public_repos,
      followers: user.followers,
      totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      languages: [...languageCounts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),
      recentRepos,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    reporter.warn(
      `GitHub stats unavailable (${(error as Error).message}); using src/data/github.json fallback.`
    );
    return githubFallback as GithubStats;
  }
}

export const sourceNodes: GatsbyNode['sourceNodes'] = async ({
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  const stats = await fetchGithubStats(reporter);

  actions.createNode({
    ...stats,
    id: createNodeId('github-stats'),
    parent: null,
    children: [],
    internal: {
      type: 'GithubStats',
      contentDigest: createContentDigest(stats),
    },
  });
};
```

- [ ] **Step 3: Add an explicit GraphQL schema so empty arrays do not break the build**

Gatsby infers types from data. When `languages` and `recentRepos` are empty (the fallback case), inference produces no field type and Task 12's query fails. Add to `gatsby-node.ts`:

```ts
export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions }) => {
  actions.createTypes(`
    type GithubLanguage {
      name: String!
      count: Int!
    }

    type GithubRepo {
      name: String!
      description: String!
      stars: Int!
      language: String!
      pushedAt: String!
      url: String!
    }

    type GithubStats implements Node {
      login: String!
      publicRepos: Int!
      followers: Int!
      totalStars: Int!
      languages: [GithubLanguage!]!
      recentRepos: [GithubRepo!]!
      fetchedAt: String!
    }
  `);
};
```

This is not optional — it is the difference between a build that survives a rate-limited CI run and one that does not.

- [ ] **Step 4: BUILD GATE — normal path**

Run: `npm run build`
Expected: exit 0. No GitHub warning in the log means the live fetch succeeded.

- [ ] **Step 5: BUILD GATE — fallback path**

This is spec verification item 6 and must actually be run, not assumed. Temporarily point the fetch at an unresolvable host to force the failure branch:

Change both `https://api.github.com` strings to `https://api.github.invalid`, then:

```bash
npm run build
```

Expected: exit 0, with `warning GitHub stats unavailable (...); using src/data/github.json fallback.` in the log. Then revert the two strings back to `https://api.github.com` and confirm `git diff gatsby-node.ts` is empty.

- [ ] **Step 6: Commit**

```bash
git add gatsby-node.ts src/data/github.json
git commit -m "feat: source GitHub stats at build time with committed fallback"
```

---

### Task 12: GitHubActivity section

**Files:**
- Create: `src/components/sections/GitHubActivity.tsx`
- Modify: `src/pages/index.tsx`

**Interfaces:**
- Consumes: the `GithubStats` GraphQL node from Task 11, `SectionHeading`, `Reveal`, `CountUp`.
- Produces: `<GitHubActivity />` at `id="github"`. Renders nothing when `publicRepos` is 0 and `recentRepos` is empty — the fallback state must not display an empty shell.

- [ ] **Step 1: Create `src/components/sections/GitHubActivity.tsx`**

```tsx
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import CountUp from '../ui/CountUp';
import profile from '../../data/profile.json';
import type { GithubStats, Profile } from '../../types';

const p = profile as unknown as Profile;

const GitHubActivity = () => {
  const data = useStaticQuery<{ githubStats: GithubStats }>(graphql`
    query GithubStatsQuery {
      githubStats {
        login
        publicRepos
        followers
        totalStars
        fetchedAt
        languages {
          name
          count
        }
        recentRepos {
          name
          description
          stars
          language
          pushedAt
          url
        }
      }
    }
  `);

  const stats = data.githubStats;
  if (!stats || (stats.publicRepos === 0 && stats.recentRepos.length === 0)) return null;

  const languageTotal = stats.languages.reduce((sum, language) => sum + language.count, 0);
  const asOf = stats.fetchedAt ? new Date(stats.fetchedAt).toISOString().slice(0, 10) : null;

  const summary = [
    { label: 'public repos', value: String(stats.publicRepos) },
    { label: 'stars earned', value: String(stats.totalStars) },
    { label: 'followers', value: String(stats.followers) },
  ];

  return (
    <section id="github" className="py-20 px-4 sm:px-6 lg:px-8 bg-content-surface/40">
      <div className="max-w-5xl mx-auto">
        <SectionHeading label="github" />

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            {summary.map((item) => (
              <div key={item.label} className="rounded-lg border border-navy-700 bg-navy-800/60 p-4">
                <div className="text-teal text-2xl font-bold font-mono">
                  <CountUp value={item.value} />
                </div>
                <div className="text-slate-light text-xs mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 space-y-6">
            {languageTotal > 0 && (
              <div>
                <p className="font-mono text-xs text-slate-light/60 mb-3">languages by repo count</p>
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-navy-800">
                  {stats.languages.map((language, i) => (
                    <span
                      key={language.name}
                      className="h-full"
                      style={{
                        width: `${(language.count / languageTotal) * 100}%`,
                        backgroundColor: ['#64ffda', '#3fb950', '#ffaf7b', '#a8b2d1', '#233554', '#d29922'][i % 6],
                      }}
                      title={`${language.name} — ${language.count}`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-3 font-mono text-xs text-slate-light/70">
                  {stats.languages.map((language) => (
                    <span key={language.name}>
                      {language.name} <span className="text-slate-light/40">{language.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {stats.recentRepos.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {stats.recentRepos.map((repo, i) => (
                  <Reveal key={repo.name} delay={i * 0.04}>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block h-full rounded-lg border border-navy-700 bg-navy-800/60 p-4 hover:border-teal/40 transition-colors"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-mono text-sm text-slate-lightest truncate">{repo.name}</span>
                        {repo.stars > 0 && (
                          <span className="font-mono text-xs text-slate-light/60">★ {repo.stars}</span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-xs text-slate-light/70 mt-2 line-clamp-2">{repo.description}</p>
                      )}
                      {repo.language && (
                        <p className="font-mono text-[11px] text-teal/70 mt-2">{repo.language}</p>
                      )}
                    </a>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="font-mono text-[11px] text-slate-light/40 mt-8">
          Pulled from github.com/{stats.login} at build time{asOf ? ` · as of ${asOf}` : ''}.
        </p>
        <p className="sr-only">
          <a href={p.socials[0].url}>GitHub profile</a>
        </p>
      </div>
    </section>
  );
};

export default GitHubActivity;
```

- [ ] **Step 2: Insert into the page after `<Skills />`**

- [ ] **Step 3: Typecheck, build, preview**

Run `npx tsc --noEmit` (exit 0) then `npm run build` (exit 0 — a bad `useStaticQuery` only fails at build, not typecheck). Preview `/`, confirm the counts animate, the language bar renders, and the repo cards link out.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/GitHubActivity.tsx src/pages/index.tsx
git commit -m "feat: add build-time GitHub activity section"
```

---

### Task 13: Credentials merge, Skills marquee, Writing and Contact polish

Consolidates the tail of the page and routes the remaining hardcoded identity through `profile.json`.

**Files:**
- Create: `src/components/sections/Credentials.tsx`
- Delete: `src/components/sections/Certifications.tsx`, `src/components/sections/Speaking.tsx`
- Modify: `src/components/sections/Skills.tsx`, `Writing.tsx`, `Contact.tsx`

**Interfaces:**
- Consumes: `SectionHeading`, `Reveal`, `Tag`, `TechMarquee`, `StatusPill`, `profile.json`, `certifications.json`, `articles.json`, `skills.json`.
- Produces: `<Credentials />` at `id="credentials"`.

- [ ] **Step 1: Create `src/components/sections/Credentials.tsx`**

This is a layout merge, not a copy rewrite — every user-facing string below is copied from the two components being deleted.

```tsx
import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import Tag from '../ui/Tag';
import certifications from '../../data/certifications.json';
import type { Certification } from '../../types';

const SPEAKING_TOPICS = [
  'Scaling microservices and event-driven backends under production load',
  'Semantic search and caching for AI-driven content pipelines',
];

const Credentials = () => (
  <section id="credentials" className="py-20 px-4 sm:px-6 lg:px-8 bg-content-surface/40">
    <div className="max-w-6xl mx-auto">
      <SectionHeading label="credentials" />

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs text-slate-light/60 mb-5">certifications</p>
          <div className="space-y-4">
            {(certifications as Certification[]).map((cert, i) => (
              <Reveal key={cert.credentialId} delay={i * 0.05}>
                <div className="rounded-lg border border-navy-700 bg-navy-800/60 p-5 hover:border-teal/40 transition-colors duration-300">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-slate-lightest font-bold leading-snug">{cert.title}</h3>
                    <span className="text-xs font-mono text-slate-light whitespace-nowrap mt-1">
                      {cert.issued}
                    </span>
                  </div>
                  <p className="text-teal text-sm mb-3">{cert.issuer}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {cert.skills.map((skill) => (
                      <Tag key={skill} tone="green">{skill}</Tag>
                    ))}
                  </div>
                  <p className="text-xs font-mono text-slate-light/70">
                    Credential ID: {cert.credentialId}
                  </p>
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-xs font-mono text-teal hover:text-teal/80 transition-colors mt-3"
                    >
                      Show credential ↗
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-xs text-slate-light/60 mb-5">speaking</p>
          <div className="relative group mb-6">
            <div className="absolute inset-0 bg-teal/20 rounded-lg transform translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300" />
            <div className="relative rounded-lg overflow-hidden border-2 border-teal grayscale hover:grayscale-0 transition-all duration-300">
              <StaticImage
                src="../../images/speaking.jpg"
                alt="Mahmudur presenting"
                placeholder="blurred"
                layout="fullWidth"
              />
            </div>
          </div>

          <Tag tone="green" className="mb-4">DMEXCO</Tag>
          <p className="text-slate-light leading-relaxed mb-6">
            I presented the in-image widget architecture at DMEXCO — walking through how a
            distributed, high-volume widget delivery system integrates across 26+ international
            publishers.
          </p>
          <h3 className="text-slate-lightest font-bold mb-3">Topics I speak on</h3>
          <ul className="space-y-3">
            {SPEAKING_TOPICS.map((topic) => (
              <li key={topic} className="flex items-start text-slate-light text-sm">
                <span className="text-teal mr-2 font-mono">▹</span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default Credentials;
```

- [ ] **Step 2: Add the marquee to `Skills.tsx`**

Replace the heading with `<SectionHeading label="skills" />`. Below the existing category grid, add:

```tsx
<div className="mt-12">
  <TechMarquee items={Object.values(skills).flat()} />
</div>
```

- [ ] **Step 3: Update `Writing.tsx`**

Change `id="blog"` to `id="writing"`, replace the heading with `<SectionHeading label="writing" />`, and replace the tag spans with `<Tag tone="teal">`.

- [ ] **Step 4: Rewrite the identity parts of `Contact.tsx`**

Delete the six hand-written social `<svg>` blocks and the stale `{/* Placeholder for phone ... */}` comment. Replace the identity parts with data-driven markup. Facebook and Instagram disappear by virtue of not being in `profile.json`.

Add at the top of the file:

```tsx
import type { IconType } from 'react-icons';
import { FaGithub, FaLinkedin, FaXTwitter, FaMedium, FaYoutube } from 'react-icons/fa6';
import StatusPill from '../ui/StatusPill';
import profile from '../../data/profile.json';
import type { Profile } from '../../types';

const p = profile as unknown as Profile;

const SOCIAL_ICONS: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaXTwitter,
  medium: FaMedium,
  youtube: FaYoutube,
};
```

Replace the availability line, mailto and social row with:

```tsx
<div className="mb-6">
  <StatusPill status={p.availability.status} tone={p.availability.tone} />
</div>

<a
  href={`mailto:${p.email}`}
  className="inline-block px-8 py-4 border-2 border-teal text-teal rounded hover:bg-teal/10 transition-colors duration-300 font-mono text-sm"
>
  Say Hello
</a>

<div className="mt-12 flex flex-col items-center">
  <div className="flex space-x-6 mb-6">
    {p.socials.map((social) => {
      const Icon = SOCIAL_ICONS[social.icon];
      if (!Icon) return null;
      return (
        <a
          key={social.url}
          href={social.url}
          target="_blank"
          rel="noreferrer"
          aria-label={social.label}
          className="text-slate-light hover:text-teal transition-colors duration-300"
        >
          <Icon size={24} />
        </a>
      );
    })}
  </div>
  <p className="text-slate-light text-sm font-mono">{p.email}</p>
  <p className="text-slate-light/60 text-xs font-mono mt-1">{p.location}</p>
</div>
```

Keep the existing `id="contact"`, heading, and body paragraph unchanged.

- [ ] **Step 5: Remove the merged sections**

```bash
git rm src/components/sections/Certifications.tsx src/components/sections/Speaking.tsx
```

- [ ] **Step 6: Typecheck and preview**

`npx tsc --noEmit` exits 0. Preview `/` — confirm the marquee scrolls and pauses on hover, credentials render in two columns, and the contact socials render five icons.

- [ ] **Step 7: Commit**

```bash
git add -A src/components/sections
git commit -m "feat: merge credentials, add skills marquee, drive contact from profile"
```

---

### Task 14: Remove AI Workflow and Principles, add YouTube video section — BUILD GATE

Two scope changes requested by the project owner after those sections shipped:

1. The `// how I work with AI` section is removed entirely. The AI tooling itself stays visible through the existing "AI Tools & Workflows" group in `skills.json` — only the section explaining the process goes.
2. The `// how I decide` (Principles) section is removed entirely, including its data file. The owner chose the "show, don't tell" route: the decision framing now lives only inside the case studies, where it is evidence rather than assertion. Delete it wholesale — do not relocate the cards, do not fold the copy into another section.

A section showing the latest YouTube uploads takes their place.

**Files:**
- Delete: `src/components/sections/AiWorkflow.tsx`
- Delete: `src/components/sections/Principles.tsx`
- Delete: `src/data/principles.json`
- Create: `src/data/youtube.json`
- Create: `src/components/sections/Video.tsx`
- Modify: `gatsby-node.ts`
- Modify: `src/types/index.ts`
- Modify: `src/pages/index.tsx`

**Interfaces:**
- Consumes: `SectionHeading`, `Reveal`, `Terminal`, the `sourceNodes` pattern already established for GitHub in Task 11.
- Produces: GraphQL node type `YoutubeFeed` with fields `channelTitle`, `channelUrl`, `fetchedAt`, `videos { videoId title url thumbnail published views }`; `<Video />` at `id="video"`.

- [ ] **Step 1: Add the types to `src/types/index.ts`**

```ts
export interface YoutubeVideo {
  videoId: string;
  title: string;
  url: string;
  thumbnail: string;
  published: string;
  views: number;
}

export interface YoutubeFeed {
  channelTitle: string;
  channelUrl: string;
  videos: YoutubeVideo[];
  fetchedAt: string;
}
```

- [ ] **Step 2: Create the fallback `src/data/youtube.json`**

Same discipline as `github.json`: real identifiers, no invented content. An empty `videos` array makes the section hide itself rather than display stale or wrong data.

```json
{
  "channelTitle": "Mahmudur Rahman",
  "channelUrl": "https://www.youtube.com/channel/UCXYONuojOl6sGPHvupVXx7w",
  "videos": [],
  "fetchedAt": ""
}
```

- [ ] **Step 3: Add YouTube sourcing to `gatsby-node.ts`**

YouTube's Atom feed has a stable, simple shape, so it is parsed with targeted regexes rather than adding an XML dependency — the plan's no-new-dependencies constraint holds. Append to the existing file and add the fallback import alongside the GitHub one:

```ts
import youtubeFallback from './src/data/youtube.json';
import type { YoutubeFeed, YoutubeVideo } from './src/types';

const YOUTUBE_CHANNEL_ID = 'UCXYONuojOl6sGPHvupVXx7w';
const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

/** Reads the text content of the first <name>…</name> in a feed entry. */
function readTag(source: string, name: string): string {
  const match = source.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return match ? decodeEntities(match[1].trim()) : '';
}

async function fetchYoutubeFeed(reporter: {
  warn: (message: string) => void;
}): Promise<YoutubeFeed> {
  try {
    const response = await fetch(YOUTUBE_FEED_URL, {
      headers: { 'User-Agent': 'portfolio-build' },
    });

    if (!response.ok) throw new Error(`youtube responded ${response.status}`);

    const xml = await response.text();
    const entries = xml
      .split('<entry>')
      .slice(1)
      .map((chunk) => chunk.split('</entry>')[0]);

    const videos: YoutubeVideo[] = entries
      .map((entry) => {
        const videoId = readTag(entry, 'yt:videoId');
        const thumbnail = entry.match(/<media:thumbnail\s+url="([^"]+)"/);
        const views = entry.match(/views="(\d+)"/);
        return {
          videoId,
          title: readTag(entry, 'title'),
          url: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail: thumbnail
            ? thumbnail[1]
            : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          published: readTag(entry, 'published'),
          views: views ? Number(views[1]) : 0,
        };
      })
      .filter((video) => video.videoId && video.title);

    if (videos.length === 0) throw new Error('feed contained no usable entries');

    return {
      channelTitle: readTag(xml, 'title') || 'Mahmudur Rahman',
      channelUrl: `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`,
      videos: videos.slice(0, 8),
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    reporter.warn(
      `YouTube feed unavailable (${(error as Error).message}); using src/data/youtube.json fallback.`
    );
    return youtubeFallback as YoutubeFeed;
  }
}
```

Note on `readTag(entry, 'title')`: the regex requires the literal `<title`, so it does not match `<media:title>` — the first match is the entry's own title. Do not "simplify" this to a looser pattern.

Extend the existing `sourceNodes` export to create both nodes — do not add a second `sourceNodes` export, Gatsby will only honour one:

```ts
export const sourceNodes: GatsbyNode['sourceNodes'] = async ({
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  const stats = await fetchGithubStats(reporter);

  actions.createNode({
    ...stats,
    id: createNodeId('github-stats'),
    parent: null,
    children: [],
    internal: {
      type: 'GithubStats',
      contentDigest: createContentDigest(stats),
    },
  });

  const feed = await fetchYoutubeFeed(reporter);

  actions.createNode({
    ...feed,
    id: createNodeId('youtube-feed'),
    parent: null,
    children: [],
    internal: {
      type: 'YoutubeFeed',
      contentDigest: createContentDigest(feed),
    },
  });
};
```

Extend `createSchemaCustomization` — the empty-array fallback case needs an explicit type here for exactly the reason it did for GitHub:

```
    type YoutubeVideo {
      videoId: String!
      title: String!
      url: String!
      thumbnail: String!
      published: String!
      views: Int!
    }

    type YoutubeFeed implements Node {
      channelTitle: String!
      channelUrl: String!
      videos: [YoutubeVideo!]!
      fetchedAt: String!
    }
```

- [ ] **Step 4: Create `src/components/sections/Video.tsx`**

Featured newest video plus a terminal-styled list of the rest, per the owner's chosen layout.

```tsx
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import type { YoutubeFeed } from '../../types';

const formatDate = (value: string) =>
  value ? new Date(value).toISOString().slice(0, 10) : '';

const Video = () => {
  const data = useStaticQuery<{ youtubeFeed: YoutubeFeed }>(graphql`
    query YoutubeFeedQuery {
      youtubeFeed {
        channelTitle
        channelUrl
        fetchedAt
        videos {
          videoId
          title
          url
          thumbnail
          published
          views
        }
      }
    }
  `);

  const feed = data.youtubeFeed;
  if (!feed || feed.videos.length === 0) return null;

  const [featured, ...rest] = feed.videos;

  return (
    <section id="video" className="py-20 px-4 sm:px-6 lg:px-8 bg-content-surface/40">
      <div className="max-w-6xl mx-auto">
        <SectionHeading label="video" />

        <p className="text-slate-light max-w-2xl mb-10 leading-relaxed">
          Short technical explainers — the same things I argue about at work, written down for
          anyone who has to make the same call.
        </p>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <a
              href={featured.url}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-xl border border-navy-700 bg-navy-800/60 overflow-hidden hover:border-teal/40 transition-colors duration-300"
            >
              <div className="relative">
                <img
                  src={featured.thumbnail}
                  alt=""
                  loading="lazy"
                  className="w-full aspect-video object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-teal/70 bg-navy-900/70 text-teal text-xl transition-transform duration-300 group-hover:scale-110">
                    ▶
                  </span>
                </span>
              </div>
              <div className="p-5">
                <p className="font-mono text-[11px] text-status-green mb-2">latest</p>
                <h3 className="text-lg font-bold text-slate-lightest group-hover:text-teal transition-colors">
                  {featured.title}
                </h3>
                <p className="font-mono text-xs text-slate-light/60 mt-2">
                  {formatDate(featured.published)}
                  {featured.views > 0 ? ` · ${featured.views} views` : ''}
                </p>
              </div>
            </a>
          </Reveal>

          {rest.length > 0 && (
            <Reveal delay={0.06}>
              <div className="rounded-xl border border-navy-700 bg-navy-800/60 overflow-hidden font-mono h-full">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-navy-700 bg-navy-900/70">
                  <span className="w-3 h-3 rounded-full bg-red-400/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <span className="w-3 h-3 rounded-full bg-status-green/80" />
                  <span className="ml-3 text-xs text-slate-light">~/youtube</span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-light mb-3">
                    <span className="text-status-green">$</span> yt --list
                  </p>
                  <ul className="divide-y divide-navy-700">
                    {rest.map((video) => (
                      <li key={video.videoId}>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-start gap-3 py-3 group"
                        >
                          <span className="text-teal text-xs mt-0.5">▹</span>
                          <span className="flex-1">
                            <span className="block text-sm text-slate-lightest font-sans leading-snug group-hover:text-teal transition-colors">
                              {video.title}
                            </span>
                            <span className="block text-[11px] text-slate-light/50 mt-1">
                              {formatDate(video.published)}
                              {video.views > 0 ? ` · ${video.views} views` : ''}
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          )}
        </div>

        <a
          href={feed.channelUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-8 font-mono text-xs text-teal hover:text-teal/80 transition-colors"
        >
          all videos on YouTube ↗
        </a>
      </div>
    </section>
  );
};

export default Video;
```

- [ ] **Step 5: Delete AiWorkflow and Principles, and swap in Video**

```bash
git rm src/components/sections/AiWorkflow.tsx
git rm src/components/sections/Principles.tsx
git rm src/data/principles.json
```

In `src/pages/index.tsx`, remove the `AiWorkflow` import and element, remove the `Principles` import and element, then import `Video` and place `<Video />` immediately after `<Writing />`. Task 15 sets the final order — this step only has to leave the page building.

After deleting, confirm nothing still references the removed modules:

```bash
grep -rn "Principles\|principles.json\|AiWorkflow" src/ | grep -v node_modules
```

Expected: no output. A dangling import fails the build gate two steps later.

Note: the Hero's primary CTA reads "See how I decide" and points at `#work`. Leave it. With the Principles section gone the phrase now describes what the Work grid demonstrates, which is the intent — do not reword it on your own initiative.

- [ ] **Step 6: BUILD GATE — normal path**

Run: `npm run build`
Expected: exit 0, no YouTube warning in the log (a warning means the fetch failed and the fallback was used).

- [ ] **Step 7: BUILD GATE — fallback path**

Temporarily change `https://www.youtube.com` in `YOUTUBE_FEED_URL` to `https://www.youtube.invalid`, then run `npm run build`. Expected: exit 0 with `warning YouTube feed unavailable (...); using src/data/youtube.json fallback.` in the log, and no video section in the output HTML. Revert the string and confirm `git diff gatsby-node.ts` is empty.

- [ ] **Step 8: Commit**

```bash
git add -A gatsby-node.ts src/types/index.ts src/data/youtube.json src/components/sections src/pages/index.tsx
git commit -m "feat: replace AI workflow section with build-time YouTube feed"
```

---

### Task 15: Page assembly, navigation, and SEO — BUILD GATE

**Files:**
- Modify: `src/pages/index.tsx`
- Modify: `src/components/layout/Layout.tsx`

**Interfaces:**
- Consumes: every section built above, `profile.json`.
- Produces: the final page order and nav anchors.

- [ ] **Step 1: Set the final section order in `src/pages/index.tsx`**

```tsx
<Layout>
  <Hero />
  <Work />
  <Experience />
  <Skills />
  <GitHubActivity />
  <Writing />
  <Video />
  <Credentials />
  <Contact />
</Layout>
```

- [ ] **Step 2: Replace the page `Head`**

```tsx
export const Head: HeadFC = () => (
  <>
    <title>Mahmudur Rahman — Software Engineer</title>
    <meta
      name="description"
      content="Backend-focused full-stack engineer. I own systems in production and decide what is worth building — cost, operational risk, and the business outcome behind each call."
    />
  </>
)
```

- [ ] **Step 3: Update the nav in `Layout.tsx`**

Replace the hardcoded label array with entries matching the new section ids, and drive the logo, resume link and initials from `profile.json`:

```tsx
const NAV = [
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Skills', href: '/#skills' },
  { label: 'GitHub', href: '/#github' },
  { label: 'Writing', href: '/#writing' },
  { label: 'Video', href: '/#video' },
  { label: 'Contact', href: '/#contact' },
];
```

There is deliberately no `AI` entry — that section was removed in Task 14.

Use absolute `/#anchor` hrefs, not `#anchor` — bare fragments break when the visitor is on a `/work/<slug>/` page. Keep `MR` as the logo but read it from `profile.initials`, and read the resume href from `profile.resume`.

- [ ] **Step 4: Add the availability pill to the footer**

In the footer, render `<StatusPill status={p.availability.status} tone={p.availability.tone} />` beside the existing "Designed & Built by" line.

- [ ] **Step 5: BUILD GATE**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.tsx src/components/layout/Layout.tsx
git commit -m "feat: finalize page order, navigation, and page metadata"
```

---

### Task 16: Full verification pass

No new code. This task exists because the spec's section 8 lists verification steps that must be *run*, and a plan that assumes them is a plan that ships a broken page.

**Files:** none.

- [ ] **Step 1: Clean build from scratch**

```bash
rm -rf .cache public
npm run build
```

Expected: exit 0, no errors, no new warnings. Confirm all five `/work/` directories exist under `public/work`.

- [ ] **Step 1b: Confirm the AI Workflow section is gone**

```bash
test ! -f src/components/sections/AiWorkflow.tsx && echo "ai component deleted"
test ! -f src/components/sections/Principles.tsx && echo "principles component deleted"
test ! -f src/data/principles.json && echo "principles data deleted"
grep -rin "how I work with AI\|ai-assisted-dev\|how I decide" src/ public/index.html | wc -l
```

Expected: all three "deleted" lines, and a count of `0`. The nav must have no `AI` and no `Decide` entry, and the page no `#ai` or `#principles` anchor.

- [ ] **Step 2: Desktop preview of `/`**

`preview_start` `{name: "gatsby-develop"}`, load `/`. Walk every section top to bottom. Then `read_console_messages` — expect zero errors — and `read_network_requests` — expect no failed requests.

- [ ] **Step 3: Exercise the Work filter**

Click each of the five chips. Cards animate, counts match, no console error on rapid switching.

- [ ] **Step 4: All five case study routes**

Load each `/work/<slug>/`. Confirm prev/next navigation works at both ends of the list (`domka` has no prev, `banglapapers` has no next) and that `/work/domka/` renders without crashing despite being almost entirely TODO.

- [ ] **Step 4b: Video section**

Confirm the featured video's thumbnail loads from `i.ytimg.com` (check `read_network_requests` for a failed image), the play overlay renders over it, the three remaining videos appear in the terminal list, and every link opens the right video. Then confirm the section hides cleanly on the fallback path by checking that Task 14's Step 7 fallback build produced no `id="video"` in `public/index.html`.

- [ ] **Step 5: Mobile viewport**

`resize_window` to the `mobile` preset (375px). Check `/` and `/work/storylens/`. The decision table must scroll inside its own container without the page scrolling horizontally. Reset with the `desktop` preset afterwards.

- [ ] **Step 6: Reduced motion**

In the browser console, verify the reduced-motion path renders final state rather than animating:

```js
matchMedia('(prefers-reduced-motion: reduce)').matches
```

Then use `resize_window` with `colorScheme` unchanged and reload with reduced motion emulated if available; otherwise confirm by code review that every motion component branches on `useReducedMotion`.

- [ ] **Step 7: Confirm no invented data shipped**

```bash
grep -rn '"TODO"' src/data/ | wc -l
npm run build && grep -rn 'TODO' public/work/*/index.html | wc -l
```

Expected: the first count is greater than zero (placeholders exist in data), the second is `0` (no placeholder reached the production HTML).

- [ ] **Step 8: Screenshot and report**

Capture `/` and one case study page. Report results honestly: what passed, what did not, and the exact list of `TODO` fields the user still needs to fill.

- [ ] **Step 9: Final commit**

```bash
git add -A
git commit -m "chore: verification pass for product-minded portfolio redesign"
```

---

## Post-Implementation: TODO fields the user must fill

After Task 15, hand the user this list. Nothing below can be filled by the implementer.

- **Domka** — everything except title, category, status, and one-liner: role, period, stack, problem, decision, cost, risk, impact metrics, architecture, retro, links.
- **All five studies** — `cost.engineering`, `cost.run`, `cost.timeline`; `risk.operational`; every metric's `baseline` and `howMeasured`; `retro`.
- **Storylens** — `problem.trigger`, `decision.options`, `impact.businessOutcome`.
- **Widget Builder** — `stack`, `decision.*`, `risk.*`.
- **Data Pipeline** — `decision.options`, `impact.businessOutcome`.
- **Banglapapers** — `problem.trigger`, `decision.*`.
- **`architecture.steps`** for all five — the pipeline stages, in order.
