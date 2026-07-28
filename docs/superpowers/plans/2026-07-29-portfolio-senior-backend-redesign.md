# Portfolio Senior-Backend Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the portfolio to read as a backend engineer who owns systems in production, using a hybrid terminal-chrome + editorial-content UI, driven by the latest resume content.

**Architecture:** Gatsby static site, section components in `src/components/`, data in `src/data/*.json`. Redesign keeps navy/teal identity, adds two design tokens, rebuilds Hero as a terminal window, restyles content sections as editorial compact cards, adds an "How I Work With AI" strip, and removes the 3D skills globe. No new pages.

**Tech Stack:** Gatsby 5, React 18, TypeScript, Tailwind CSS 4 (`@theme` tokens in `src/styles/global.css`).

**No test suite exists** (confirmed in CLAUDE.md). Per-task verification is **type check** (`npx tsc --noEmit`) plus a **full production build** (`npm run build`) at milestones, and a final visual check (`npm run develop`). Substitute these for the "run the test" steps in the standard TDD loop.

**Commit rule:** The repo owner commits only when they ask. Each task ends with a **prepared commit command the owner can run** — do not auto-commit unless the owner says so.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/styles/global.css` | Modify | Add `status-green`, `content-surface` tokens + `blink` keyframe |
| `tailwind.config.js` | Modify | Mirror new color tokens (legacy config parity) |
| `src/data/experience.json` | Rewrite | Reframed compact highlights (metric + context) |
| `src/data/projects.json` | Modify | Add Restaurant Forecasting Engine; optional metric field |
| `src/data/skills.json` | Rewrite | Reordered/expanded groups, backend-first |
| `src/components/Hero.tsx` | Rewrite | Terminal-window hero + metric tiles |
| `src/components/About.tsx` | Rewrite | Ownership/production copy |
| `src/components/Experience.tsx` | Modify | Editorial compact cards, new highlight shape |
| `src/components/Projects.tsx` | Modify | Editorial compact cards, optional metric |
| `src/components/Skills.tsx` | No code change | Data-only reorder (verify renders) |
| `src/components/AiWorkflow.tsx` | Create | Terminal "How I Work With AI" strip |
| `src/components/Blog.tsx` | No code change | Content kept as-is (verify) |
| `src/components/Speaking.tsx` | Rewrite | Lead with real DMEXCO talk |
| `src/components/Contact.tsx` | Modify | Terminal CLI-prompt framing |
| `src/components/Layout.tsx` | Modify | Nav adds "AI" anchor |
| `src/pages/index.tsx` | Modify | Insert `<AiWorkflow />` after Skills |
| `CLAUDE.md` | Modify | Drop SkillsGlobe3D / ontenet references |

**Data shape (new) — experience highlight:**
```ts
interface Highlight {
  title: string;
  metric?: string;   // short badge, e.g. "70% cache hit"
  desc: string;      // outcome line
  context?: string;  // one-line bottleneck/trade-off (italic)
}
```

**Data shape (new) — project:**
```ts
interface Project {
  title: string;
  summary: string;
  tags: string[];
  link?: string;
  metric?: string;   // optional headline, e.g. "AI POC"
}
```

---

## Task 1: Design tokens

**Files:**
- Modify: `src/styles/global.css`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Add tokens + blink keyframe to global.css**

Replace the `@theme {}` block and add a keyframe. New file content:

```css
@import "tailwindcss";

@theme {
  --color-navy-900: #0a192f;
  --color-navy-800: #112240;
  --color-navy-700: #233554;

  --color-slate-light: #a8b2d1;
  --color-slate-lightest: #ccd6f6;

  --color-teal: #64ffda;

  --color-orange-soft: #ffaf7b;

  --color-status-green: #3fb950;
  --color-content-surface: #0e1f3a;

  --font-sans: "Inter", sans-serif;
  --font-mono: "Roboto Mono", monospace;
}

@layer base {
  body {
    @apply bg-navy-900 text-slate-light font-sans;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply text-slate-lightest font-bold;
  }
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}
```

- [ ] **Step 2: Mirror tokens in tailwind.config.js**

In the `colors` block, add `status` and `surface` keys:

```js
        teal: {
          DEFAULT: '#64ffda',
        },
        orange: {
          soft: '#ffaf7b',
        },
        status: {
          green: '#3fb950',
        },
        content: {
          surface: '#0e1f3a',
        }
```

- [ ] **Step 3: Type check**

Run: `npx tsc --noEmit`
Expected: no errors (CSS/config changes don't affect TS).

- [ ] **Step 4: Prepared commit**

```bash
git add src/styles/global.css tailwind.config.js
git commit -m "feat(portfolio): add status-green + content-surface design tokens

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 2: Rewrite experience data

**Files:**
- Rewrite: `src/data/experience.json`

- [ ] **Step 1: Replace file content**

```json
[
  {
    "company": "Footylight (FCONNECT)",
    "role": "Software Engineer",
    "period": "Apr 2022 – Present",
    "type": "Hybrid",
    "tags": ["Node.js", "Python", "AWS", "Microservices", "Event-Driven", "ELK", "OpenSearch", "DynamoDB"],
    "highlights": [
      { "title": "Storylens — event-driven AI backend", "metric": "70% cache hit · 300%+ ROI", "desc": "Transformed articles into visual summaries through an event-driven LLM pipeline; semantic prompt caching drove sub-second p50 responses.", "context": "Bottleneck: every article re-ran the full LLM pipeline. Trade-off: accepted eventual staleness for latency and cost." },
      { "title": "High-throughput microservices", "metric": "32.4% MAU growth", "desc": "Operated 4 core microservices serving low-latency football content to high-concurrency global traffic under strict production SLAs.", "context": "Owned uptime and latency, not just endpoints." },
      { "title": "Data-pipeline fault tolerance", "metric": "0 dropped feeds", "desc": "Architected 10 data parsers on the ELK stack across AWS ECS and Lambda.", "context": "Peak-event bursts dropped feeds; async queuing + exponential backoff eliminated the loss." },
      { "title": "Publisher API integration", "metric": "26+ publishers", "desc": "Managed distributed API integrations and high-volume widget delivery; presented the in-image widget architecture at DMEXCO.", "context": "Multi-tenant integration across international publishers." },
      { "title": "Banglapapers semantic search", "metric": "<100ms retrieval", "desc": "Architected an AI news platform aggregating 10+ publisher feeds with OpenSearch semantic indexing.", "context": "Tuned indexing for sub-100ms query latency." },
      { "title": "SocialDesk automation", "metric": "0 dev cycle", "desc": "Engineered an automated content-processing and image-generation pipeline via direct article scraping and workflow execution.", "context": "Removed manual developer cycles from content prep." },
      { "title": "Widget Builder (internal ops)", "metric": "30m → <2m", "desc": "Built an internal widget-generation engine so non-engineers ship production-ready widgets.", "context": "Cut a repetitive 30-minute manual workflow to under two minutes." },
      { "title": "Observability dashboard", "metric": "7 core metrics", "desc": "Developed central monitoring aggregating API health, ad delivery, cost insights, and daily operational reports.", "context": "Used logs and metrics to diagnose production behavior." }
    ]
  },
  {
    "company": "InfancyIT",
    "role": "Trainee Software Engineer",
    "period": "Oct 2020 – Dec 2020",
    "type": "On-site",
    "tags": ["PHP", "SQL", "MySQL"],
    "highlights": [
      { "title": "Inquiry System", "desc": "Designed optimized SQL queries across business units and built reporting structures under custom relational schemas." }
    ]
  }
]
```

- [ ] **Step 2: Validate JSON**

Run: `node -e "require('./src/data/experience.json'); console.log('ok')"`
Expected: prints `ok`.

- [ ] **Step 3: Prepared commit**

```bash
git add src/data/experience.json
git commit -m "content(portfolio): reframe experience toward production ownership

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 3: Rewrite projects + skills data

**Files:**
- Modify: `src/data/projects.json`
- Rewrite: `src/data/skills.json`

- [ ] **Step 1: Replace projects.json**

```json
[
  {
    "title": "Adaptive Restaurant Forecasting Engine",
    "summary": "An AI-driven POC forecasting demand, staffing, and inventory with feedback loops for continuously improving model accuracy.",
    "tags": ["FastAPI", "Python", "LightGBM", "SGDRegressor", "Streamlit", "React"],
    "link": "https://github.com/Mahmud-007",
    "metric": "Self-learning POC"
  },
  {
    "title": "Swapnanagar — Charity Platform",
    "summary": "A content-driven donation platform with campaign handling and PayPal-based payment flow, built with Figma MCP and a Strapi CMS; SEO-friendly and performance-optimized.",
    "tags": ["React", "Strapi", "PayPal", "MongoDB", "Node.js"],
    "link": "https://www.swapnanagar.org/"
  },
  {
    "title": "FootyLight Soccer Highlights",
    "summary": "A mobile app serving global football fans with highlights, live updates, and personalized content across iOS and Android, backed by 4 microservices.",
    "tags": ["React Native", "Node.js", "AWS", "Microservices"],
    "link": "https://apps.apple.com/us/app/footylight-soccer-highlights/id549404480"
  },
  {
    "title": "Hyperledger Fabric Management System",
    "summary": "A management interface for Hyperledger Fabric that removes CLI complexity for Docker-based network operations.",
    "tags": ["Hyperledger Fabric", "Docker", "Node.js"],
    "link": "https://github.com/Mahmud-007/HyperledgerFabric-Management-System"
  }
]
```

- [ ] **Step 2: Replace skills.json (backend-first order)**

```json
{
    "Backend & Distributed Systems": [
        "Node.js",
        "Express.js",
        "FastAPI",
        "Python",
        "Go",
        "Microservices",
        "Event-Driven Architecture",
        "Caching",
        "Fault Tolerance",
        "REST",
        "GraphQL"
    ],
    "Cloud, DevOps & Observability": [
        "AWS (Lambda, ECS, S3, API Gateway, Route53, CloudFront)",
        "Docker",
        "CI/CD (GitHub Actions)",
        "ELK Stack"
    ],
    "Databases & Data Stores": [
        "DynamoDB",
        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "Redis",
        "OpenSearch",
        "Pinecone",
        "Firebase"
    ],
    "AI Tools & Workflows": [
        "Claude Code",
        "Cursor",
        "Codex",
        "OpenCode",
        "LangChain",
        "RAG",
        "MCP"
    ],
    "Frontend": [
        "React",
        "Next.js",
        "React Native",
        "TypeScript",
        "JavaScript",
        "Redux",
        "Tailwind",
        "Material-UI"
    ]
}
```

- [ ] **Step 3: Validate JSON**

Run: `node -e "require('./src/data/projects.json'); require('./src/data/skills.json'); console.log('ok')"`
Expected: prints `ok`.

- [ ] **Step 4: Prepared commit**

```bash
git add src/data/projects.json src/data/skills.json
git commit -m "content(portfolio): add forecasting project, reorder skills backend-first

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 4: Rebuild Hero as terminal window

**Files:**
- Rewrite: `src/components/Hero.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import React from 'react';

const metrics = [
  { value: '70%', label: 'cache hit rate' },
  { value: '32.4%', label: 'MAU growth' },
  { value: '<100ms', label: 'search retrieval' },
  { value: '30m→2m', label: 'ops automation' },
];

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto">
        <div className="rounded-xl border border-navy-700 bg-navy-800/60 shadow-2xl overflow-hidden font-mono">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-navy-700 bg-navy-900/70">
            <span className="w-3 h-3 rounded-full bg-red-400/70"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400/70"></span>
            <span className="w-3 h-3 rounded-full bg-status-green/80"></span>
            <span className="ml-3 text-xs text-slate-light">mahmud@fconnect: ~/production</span>
          </div>

          <div className="p-6 sm:p-10 text-sm sm:text-base leading-relaxed">
            <p className="text-slate-light">
              <span className="text-status-green">$</span> whoami
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-slate-lightest mt-2 font-sans tracking-tight">
              Mahmudur Rahman
            </h1>
            <p className="text-teal font-sans text-lg sm:text-xl mt-1">
              Software Engineer — I own systems in production, not just features.
            </p>

            <p className="text-slate-light mt-6">
              <span className="text-status-green">$</span> systemctl status --user impact
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-lg border border-navy-700 bg-navy-900/50 p-3">
                  <div className="text-status-green text-xl sm:text-2xl font-bold">{m.value}</div>
                  <div className="text-slate-light text-xs mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            <p className="text-slate-light mt-6">
              <span className="text-status-green">$</span> cat ./intro.txt
            </p>
            <p className="text-slate-light font-sans max-w-2xl mt-2 leading-relaxed">
              Backend-focused full-stack engineer. I design, deploy, monitor, and keep services
              stable under real production traffic — distributed systems, fault tolerance, and
              measurable performance and cost wins, with AI tools to move faster without outsourcing reasoning.
            </p>

            <div className="flex flex-wrap gap-4 mt-8 font-sans">
              <a
                href="https://github.com/Mahmud-007"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 border border-teal text-teal rounded hover:bg-teal/10 transition-colors duration-300 text-sm"
              >
                Check out my code
              </a>
              <a
                href="#contact"
                className="px-6 py-3 bg-teal text-navy-900 rounded border border-teal hover:bg-teal/80 transition-colors duration-300 font-bold text-sm"
              >
                Contact Me
              </a>
            </div>

            <p className="text-slate-light mt-8">
              <span className="text-status-green">$</span> cat ./case-studies/ <span className="cursor-blink">▊</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Prepared commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat(portfolio): rebuild hero as terminal window with impact metrics

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 5: Rewrite About copy

**Files:**
- Rewrite: `src/components/About.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import React from 'react';

const About = () => {
  const highlights = [
    "Own services end-to-end — design, deploy, monitor, and keep them stable in production.",
    "Cut LLM-pipeline latency and cost with semantic caching: 70% hit rate, sub-second p50, 300%+ ROI.",
    "Hardened data pipelines with async queuing and exponential backoff, eliminating dropped feeds at peak.",
    "Operate high-concurrency microservices under strict SLAs, supporting 32.4% MAU growth.",
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-content-surface/40">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-lightest mb-8 flex items-center">
          <span className="text-teal font-mono mr-2">// about</span>
          <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
        </h2>
        <div className="text-slate-light text-lg leading-relaxed">
          <p className="mb-6">
            I'm a backend-focused full-stack engineer with ~4 years of experience owning systems in
            production. My strength is designing scalable, cost-efficient services and being accountable
            for how they behave under load — not just shipping endpoints. I care about bottlenecks,
            trade-offs, and failure modes, and I use AI tools to move faster without outsourcing the reasoning.
          </p>
          <div className="mb-6">
            <h3 className="text-slate-lightest font-bold mb-4 font-mono">Key highlights</h3>
            <ul className="space-y-2">
              {highlights.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-status-green mr-2 mt-1 font-mono">▹</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Prepared commit**

```bash
git add src/components/About.tsx
git commit -m "content(portfolio): rewrite about for production ownership

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 6: Editorial compact Experience cards

**Files:**
- Modify: `src/components/Experience.tsx`

- [ ] **Step 1: Replace file content (new Highlight shape + editorial styling)**

```tsx
import React from 'react';
import experienceData from '../data/experience.json';

interface Highlight {
  title: string;
  metric?: string;
  desc: string;
  context?: string;
}

interface Job {
  company: string;
  role: string;
  period: string;
  type: string;
  tags: string[];
  highlights: Highlight[];
}

const Experience = () => {
  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
          <span className="text-teal font-mono mr-2">// experience</span>
          <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
        </h2>

        <div className="space-y-12">
          {(experienceData as Job[]).map((job, index) => (
            <div key={index}>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                <h3 className="text-xl font-bold text-slate-lightest">
                  {job.role} <span className="text-teal">@ {job.company}</span>
                </h3>
                <span className="text-sm font-mono text-slate-light">{job.period} · {job.type}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {job.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono text-slate-light/80">{tag}</span>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {job.highlights.map((h, i) => (
                  <div key={i} className="rounded-lg border border-navy-700 bg-content-surface/70 p-5 hover:border-teal/40 transition-colors duration-300">
                    {h.metric && (
                      <span className="inline-block text-xs font-mono text-status-green border border-status-green/30 rounded px-2 py-0.5 mb-2">
                        {h.metric}
                      </span>
                    )}
                    <h4 className="text-slate-lightest font-bold mb-1">{h.title}</h4>
                    <p className="text-sm text-slate-light leading-relaxed">{h.desc}</p>
                    {h.context && (
                      <p className="text-xs text-slate-light/70 italic mt-2 font-mono">{h.context}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no errors (json import matches new Highlight shape).

- [ ] **Step 3: Prepared commit**

```bash
git add src/components/Experience.tsx
git commit -m "feat(portfolio): editorial compact experience cards with metric + context

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 7: Editorial compact Projects cards

**Files:**
- Modify: `src/components/Projects.tsx`

- [ ] **Step 1: Replace file content (add optional metric, editorial style)**

```tsx
import React from 'react';
import projectsData from '../data/projects.json';

interface Project {
  title: string;
  summary: string;
  tags: string[];
  link?: string;
  metric?: string;
}

const Projects = () => {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-content-surface/40">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
          <span className="text-teal font-mono mr-2">// projects</span>
          <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {(projectsData as Project[]).map((project, index) => (
            <div key={index} className="bg-navy-800 p-6 rounded-lg border border-navy-700 hover:-translate-y-1 hover:border-teal/40 transition-all duration-300 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-3">
                {project.metric ? (
                  <span className="text-xs font-mono text-status-green border border-status-green/30 rounded px-2 py-0.5">{project.metric}</span>
                ) : <span />}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" className="text-slate-light hover:text-teal transition-colors" aria-label={`Open ${project.title}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-lightest mb-2 group-hover:text-teal transition-colors">{project.title}</h3>
              <p className="text-slate-light mb-4 flex-grow text-sm leading-relaxed">{project.summary}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono text-slate-light/80">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Prepared commit**

```bash
git add src/components/Projects.tsx
git commit -m "feat(portfolio): editorial compact project cards with optional metric

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 8: Skills header polish (data already reordered)

**Files:**
- Modify: `src/components/Skills.tsx` (header label only — data reorder done in Task 3)

- [ ] **Step 1: Update the section header to match the new `// section` style**

Find:
```tsx
                <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
                    <span className="text-teal mr-2">Skills</span>
                    <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
                </h2>
```
Replace with:
```tsx
                <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
                    <span className="text-teal font-mono mr-2">// skills</span>
                    <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
                </h2>
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no errors. Skills renders 5 groups, Backend & Distributed Systems first.

- [ ] **Step 3: Prepared commit**

```bash
git add src/components/Skills.tsx
git commit -m "style(portfolio): match skills header to section style

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 9: New "How I Work With AI" strip

**Files:**
- Create: `src/components/AiWorkflow.tsx`
- Modify: `src/pages/index.tsx`

- [ ] **Step 1: Create AiWorkflow.tsx**

```tsx
import React from 'react';

const uses = [
  'iterate & prototype faster',
  'debug & explore edge cases',
  'evaluate architecture & implementation options',
];

const tools = ['Claude Code', 'Cursor', 'Codex', 'OpenCode'];

const AiWorkflow = () => {
  return (
    <section id="ai" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-lightest mb-8 flex items-center">
          <span className="text-teal font-mono mr-2">// how I work with AI</span>
          <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
        </h2>

        <div className="rounded-xl border border-navy-700 bg-navy-800/60 shadow-xl overflow-hidden font-mono">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-navy-700 bg-navy-900/70">
            <span className="w-3 h-3 rounded-full bg-red-400/70"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400/70"></span>
            <span className="w-3 h-3 rounded-full bg-status-green/80"></span>
            <span className="ml-3 text-xs text-slate-light">~/ai-assisted-dev</span>
          </div>
          <div className="p-6 sm:p-8 text-sm leading-relaxed">
            <p className="text-slate-light"><span className="text-status-green">$</span> ai --use-for</p>
            <ul className="mt-2 mb-6 space-y-1">
              {uses.map((u) => (
                <li key={u} className="text-slate-lightest">
                  <span className="text-teal mr-2">›</span>{u}
                </li>
              ))}
            </ul>
            <p className="text-slate-light"><span className="text-status-green">$</span> ai --verify</p>
            <p className="text-slate-lightest font-sans mt-2 leading-relaxed">
              I critically review AI output, catch incorrect assumptions, and verify correctness before it
              reaches production — AI accelerates iteration and reasoning, it never replaces core reasoning or system design.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {tools.map((t) => (
                <span key={t} className="text-xs text-teal border border-teal/30 rounded px-2 py-1">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiWorkflow;
```

- [ ] **Step 2: Wire into index.tsx**

Replace the full file with:
```tsx
import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import Hero from "../components/Hero"
import About from "../components/About"
import Experience from "../components/Experience"
import Projects from "../components/Projects"
import Skills from "../components/Skills"
import AiWorkflow from "../components/AiWorkflow"
import Blog from "../components/Blog"
import Speaking from "../components/Speaking"
import Contact from "../components/Contact"

const IndexPage: React.FC<PageProps> = () => {
    return (
        <Layout>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <AiWorkflow />
            <Blog />
            <Speaking />
            <Contact />
        </Layout>
    )
}

export default IndexPage

export const Head: HeadFC = () => <title>Mahmudur Rahman | Portfolio</title>
```

- [ ] **Step 3: Type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Prepared commit**

```bash
git add src/components/AiWorkflow.tsx src/pages/index.tsx
git commit -m "feat(portfolio): add AI-assisted development section

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 10: Reframe Speaking around DMEXCO

**Files:**
- Rewrite: `src/components/Speaking.tsx`

- [ ] **Step 1: Replace file content (real DMEXCO talk led; keep image)**

```tsx
import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

const Speaking = () => {
    return (
        <section id="speaking" className="py-20 px-4 sm:px-6 lg:px-8 bg-content-surface/40">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
                    <span className="text-teal font-mono mr-2">// speaking</span>
                    <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
                </h2>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-teal/20 rounded-lg transform translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
                        <div className="relative rounded-lg overflow-hidden border-2 border-teal grayscale hover:grayscale-0 transition-all duration-300">
                            <StaticImage
                                src="../images/speaking.jpg"
                                alt="Mahmudur presenting"
                                placeholder="blurred"
                                layout="fullWidth"
                            />
                        </div>
                    </div>
                    <div>
                        <span className="inline-block text-xs font-mono text-status-green border border-status-green/30 rounded px-2 py-0.5 mb-4">DMEXCO</span>
                        <p className="text-slate-light text-lg leading-relaxed mb-6">
                            I presented the in-image widget architecture at DMEXCO — walking through how a distributed,
                            high-volume widget delivery system integrates across 26+ international publishers.
                        </p>
                        <h3 className="text-xl font-bold text-slate-lightest mb-4">Topics I speak on</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start text-slate-light">
                                <span className="text-teal mr-2 font-mono">▹</span>
                                <span>Scaling microservices and event-driven backends under production load</span>
                            </li>
                            <li className="flex items-start text-slate-light">
                                <span className="text-teal mr-2 font-mono">▹</span>
                                <span>Semantic search and caching for AI-driven content pipelines</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Speaking;
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no errors. (`speaking.jpg` already exists in `src/images/`.)

- [ ] **Step 3: Prepared commit**

```bash
git add src/components/Speaking.tsx
git commit -m "content(portfolio): lead speaking with real DMEXCO talk

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 11: Terminal-frame Contact + Blog header + nav

**Files:**
- Modify: `src/components/Contact.tsx`
- Modify: `src/components/Blog.tsx`
- Modify: `src/components/Layout.tsx`

- [ ] **Step 1: Contact — reframe intro as CLI prompt**

Find:
```tsx
                <p className="text-teal font-mono mb-4">What's Next?</p>
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-lightest mb-6">Get In Touch</h2>
```
Replace with:
```tsx
                <p className="text-teal font-mono mb-4"><span className="text-status-green">$</span> ./get-in-touch</p>
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-lightest mb-6">Get In Touch</h2>
```

- [ ] **Step 2: Blog — update header label to section style**

Find:
```tsx
          <span className="text-teal mr-2">Articles & Writing</span>
```
Replace with:
```tsx
          <span className="text-teal font-mono mr-2">// writing</span>
```

- [ ] **Step 3: Layout — add "AI" anchor to nav**

Find:
```tsx
                                {['About', 'Experience', 'Projects', 'Skills', 'Blog', 'Contact'].map((item) => (
```
Replace with:
```tsx
                                {['About', 'Experience', 'Projects', 'Skills', 'AI', 'Blog', 'Contact'].map((item) => (
```

- [ ] **Step 4: Type check**

Run: `npx tsc --noEmit`
Expected: no errors. Nav "AI" links to `#ai` (matches AiWorkflow section id).

- [ ] **Step 5: Prepared commit**

```bash
git add src/components/Contact.tsx src/components/Blog.tsx src/components/Layout.tsx
git commit -m "style(portfolio): terminal contact framing, section labels, AI nav anchor

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 12: Finalize removals + docs + full build

**Files:**
- Delete (make permanent): `src/components/SkillsGlobe3D.tsx`, `src/pages/ontenet.tsx` (already removed from working tree)
- Modify: `CLAUDE.md`

- [ ] **Step 1: Stage the deletions**

Run: `git rm --ignore-unmatch src/components/SkillsGlobe3D.tsx src/pages/ontenet.tsx`
Expected: git records both as deleted (or no-op if already staged).

- [ ] **Step 2: Update CLAUDE.md**

In the "Architecture" section, remove the `ontenet.tsx` bullet and the `SkillsGlobe3D` paragraph, and drop `SkillsGlobe3D` from the index.tsx section list. Replace the two-pages description:

Find:
```
**Gatsby static site** — single-page portfolio with section-based components. Two pages exist:

- `src/pages/index.tsx` — Main portfolio (Hero, About, Experience, Projects, Skills, SkillsGlobe3D, Blog, Speaking, Contact)
- `src/pages/ontenet.tsx` — Standalone page showcasing SkillsGlobe3D in isolation
```
Replace with:
```
**Gatsby static site** — single-page portfolio with section-based components. One page:

- `src/pages/index.tsx` — Main portfolio (Hero, About, Experience, Projects, Skills, AiWorkflow, Blog, Speaking, Contact)
```

Then find and delete the SkillsGlobe3D paragraph:
```
**SkillsGlobe3D** (`src/components/SkillsGlobe3D.tsx`): Interactive 3D skills visualization using `@react-three/fiber` and `@react-three/drei`. Uses `isBrowser` check for Gatsby SSR compatibility. Renders orbiting category spheres on a torus ring with click-to-select detail sidebar.
```
(remove entirely).

- [ ] **Step 3: Confirm no lingering references**

Run: `grep -rn "SkillsGlobe3D\|ontenet\|react-three" src/ CLAUDE.md`
Expected: no output (empty). If any hit remains, remove it.

- [ ] **Step 4: Full production build**

Run: `npm run build`
Expected: build completes successfully, no errors, `public/` regenerated. No `react-three` in the runtime bundle (component gone).

- [ ] **Step 5: Visual check**

Run: `npm run develop` then open `http://localhost:8000`.
Verify: terminal hero renders with 4 metric tiles + blinking cursor; About/Experience/Projects/Speaking use editorial cards on the warmer surface; Skills shows Backend & Distributed Systems first; the AI section renders as a terminal strip; nav shows the AI anchor and scrolls to it; Blog shows 3 articles; Contact shows the `$ ./get-in-touch` prompt.

- [ ] **Step 6: Prepared commit**

```bash
git add -A
git commit -m "chore(portfolio): remove 3D globe + ontenet page, update docs

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Design system tokens → Task 1 ✓
- Section structure & order (Hero…Contact + AI) → Tasks 4–11, index wiring Task 9 ✓
- Removals (globe, ontenet, docs) → Task 12 ✓
- Content rewrites (hero tiles, about, experience reframes, projects+forecasting, skills reorder) → Tasks 2–7 ✓
- "How I Work With AI" section → Task 9 ✓
- Blog kept, Speaking DMEXCO reframe → Tasks 11, 10 ✓
- Success criteria (senior read, distinct look, real content, clean build) → verified in Task 12 ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code. ✓

**Type consistency:** `Highlight` interface (`title/metric?/desc?/context?`) defined in Task 6 matches `experience.json` written in Task 2. `Project` interface (`+metric?`) in Task 7 matches `projects.json` in Task 3. AiWorkflow section `id="ai"` matches nav anchor `#ai` (Task 11) and index import name `AiWorkflow` (Task 9). ✓

**Note on TDD:** No test framework in repo; verification uses `tsc --noEmit`, `npm run build`, and a visual check, as stated in the header.
