import React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import Layout from '../components/layout/Layout';
import MoreLink from '../components/ui/MoreLink';
import Dateline from '../components/ui/Dateline';
import Tag from '../components/ui/Tag';
import TodoBadge from '../components/ui/TodoBadge';
import Reveal from '../components/ui/Reveal';
import ImpactStrip from '../components/case-study/ImpactStrip';
import DecisionTable from '../components/case-study/DecisionTable';
import CostBlock from '../components/case-study/CostBlock';
import RiskBlock from '../components/case-study/RiskBlock';
import ArchFlow from '../components/case-study/ArchFlow';
import PipelineDiagram from '../components/ui/PipelineDiagram';
import { hasStepNotes, normalizeSteps, parseRate } from '../utils/pipeline';
import { IS_DEV, allTodo, field, isTodo, listField } from '../utils/todo';
import type { CaseStudy } from '../types';

interface StudyRef {
  slug: string;
  title: string;
}

interface CaseStudyContext {
  study: CaseStudy;
  prev: StudyRef | null;
  next: StudyRef | null;
}

/** A titled part of the story. Renders nothing when `show` is false, so empty parts leave no heading behind. */
const Part: React.FC<{ title: string; show: boolean; children: React.ReactNode }> = ({ title, show, children }) => {
  if (!show) return null;
  return (
    <Reveal>
      <section className="mt-10">
        <h2 className="border-t-2 border-ink pt-2 mb-4 font-mono text-xs font-medium uppercase tracking-[0.18em]">
          {title}
        </h2>
        {children}
      </section>
    </Reveal>
  );
};

const Text: React.FC<{ value?: string; className?: string }> = ({ value, className }) => {
  const resolved = field(value);
  if (!resolved) return null;
  return resolved.todo ? <TodoBadge /> : <p className={className}>{resolved.value}</p>;
};

const prose = 'm-0 mb-3 text-[19px] leading-relaxed max-w-[62ch]';

const CaseStudyPage: React.FC<PageProps<object, CaseStudyContext>> = ({ pageContext }) => {
  const { study, prev, next } = pageContext;
  const stack = listField(study.stack).filter((s) => !isTodo(s));
  const dateline = [study.category, study.period, study.status].filter((v) => v && !isTodo(v));
  const measured = study.impact.metrics.filter((m) => field(m.howMeasured) || field(m.baseline));
  const standfirst = field(study.oneLiner);
  const steps = normalizeSteps(study.architecture.steps);
  const interactive = hasStepNotes(steps, IS_DEV);
  const cacheMetric = study.impact.metrics.find((m) => /cache/i.test(m.label));
  const hitRate = cacheMetric ? parseRate(cacheMetric.value) : null;

  const decisionEmpty =
    allTodo(study.decision.chose, study.decision.rejected, study.decision.why) &&
    (study.decision.options ?? []).length === 0;
  const riskEmpty =
    allTodo(study.risk.operational) &&
    listField(study.risk.failureModes).length === 0 &&
    listField(study.risk.mitigations).length === 0;

  return (
    <Layout>
      <article className="pb-12">
        <MoreLink label="← All work" to="/#work" arrow={false} />

        <Dateline items={dateline} className="mt-6 text-red" />
        <h1 className="mt-3 font-display font-black tracking-[-0.03em] leading-[0.95] text-4xl sm:text-5xl lg:text-6xl">
          {study.headline ?? study.title}
        </h1>
        {standfirst && !standfirst.todo && (
          <p className="mt-4 mb-0 text-xl leading-snug italic text-ink-soft max-w-[58ch]">{standfirst.value}</p>
        )}
        {stack.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        )}

        <ImpactStrip metrics={study.impact.metrics} />

        <Part title="The problem" show={!allTodo(study.problem.context, study.problem.trigger)}>
          <Text value={study.problem.context} className={`${prose} drop-cap`} />
          <Text value={study.problem.trigger} className={prose} />
        </Part>

        <Part title={interactive ? 'How it works' : 'Architecture'} show={steps.length > 0}>
          {interactive ? <PipelineDiagram steps={steps} hitRate={hitRate} /> : <ArchFlow steps={steps} />}
        </Part>

        <Part title="The decision" show={!decisionEmpty}>
          <DecisionTable decision={study.decision} />
        </Part>

        <Part title="What it cost" show={!allTodo(study.cost.engineering, study.cost.run, study.cost.timeline)}>
          <CostBlock cost={study.cost} />
        </Part>

        <Part title="Operational risk" show={!riskEmpty}>
          <RiskBlock risk={study.risk} />
        </Part>

        <Part title="Impact" show={measured.length > 0 || !allTodo(study.impact.businessOutcome)}>
          {measured.length > 0 && (
            <ul className="list-none m-0 mb-4 p-0 border-t border-ink/25">
              {measured.map((m) => {
                const baseline = field(m.baseline);
                const how = field(m.howMeasured);
                return (
                  <li key={m.label} className="py-2.5 border-b border-ink/25 text-[17px] leading-snug">
                    <span className="font-display font-black">{m.value}</span> {m.label}
                    {baseline && !baseline.todo && <span className="text-ink-soft">, from {baseline.value}</span>}
                    {how && !how.todo && <span className="block text-ink-soft">Measured by: {how.value}</span>}
                    {(baseline?.todo || how?.todo) && <TodoBadge label="baseline / method TODO" />}
                  </li>
                );
              })}
            </ul>
          )}
          <Text value={study.impact.businessOutcome} className={prose} />
        </Part>


        <Part title="What I'd do differently" show={!allTodo(study.retro)}>
          <Text value={study.retro} className={prose} />
        </Part>

        {study.links.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2">
            {study.links.map((link) => (
              <MoreLink key={link.url} label={link.label} to={link.url} />
            ))}
          </div>
        )}

        <nav aria-label="More work" className="mt-12 pt-4 border-t border-ink flex justify-between gap-6">
          {prev ? <MoreLink label={`← ${prev.title}`} to={`/work/${prev.slug}/`} arrow={false} /> : <span />}
          {next ? <MoreLink label={next.title} to={`/work/${next.slug}/`} /> : <span />}
        </nav>
      </article>
    </Layout>
  );
};

export default CaseStudyPage;

export const Head: HeadFC<object, CaseStudyContext> = ({ pageContext }) => {
  const { study } = pageContext;
  const description = field(study.oneLiner);
  return (
    <>
      <title>{`${study.title} — Mahmudur Rahman`}</title>
      {description && !description.todo && <meta name="description" content={description.value} />}
    </>
  );
};
