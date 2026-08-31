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
