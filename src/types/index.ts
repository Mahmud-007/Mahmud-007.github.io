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

export interface PipelineStep {
  id: string;
  label: string;
  does?: string;
  costs?: string;
  fails?: string;
  cacheNode?: boolean;
}

export interface CaseStudy {
  slug: string;
  title: string;
  category: WorkCategory;
  role: string;
  period: string;
  status: string;
  oneLiner: string;
  /** Short front-page headline about what the system does. Falls back to title. */
  headline?: string;
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
  architecture: { steps: Array<string | PipelineStep> };
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

export interface Social {
  label: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  initials: string;
  location: string;
  email: string;
  resume: string;
  availability: { status: string; tone: 'green' | 'amber' };
  youtube: { handle: string; channelId: string };
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
  /** File name inside src/images/certificates/. Empty or missing renders a text row. */
  image?: string;
}

export interface Video {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
}

export interface ChannelStats {
  subscribers: number;
  views: number;
  videos: number;
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
