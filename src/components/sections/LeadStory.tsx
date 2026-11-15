import React from 'react';
import PipelineDiagram from '../ui/PipelineDiagram';
import MoreLink from '../ui/MoreLink';
import caseStudies from '../../data/caseStudies.json';
import { normalizeSteps, parseRate } from '../../utils/pipeline';
import { field } from '../../utils/todo';
import type { CaseStudy } from '../../types';

const LEAD_SLUG = 'storylens';

/** The front page opens with a piece of work, not a biography (design doc, section 3). */
const LeadStory = () => {
  const study = (caseStudies as unknown as CaseStudy[]).find((c) => c.slug === LEAD_SLUG);
  if (!study) return null;

  const steps = normalizeSteps(study.architecture.steps);
  if (steps.length === 0) return null;

  const cacheMetric = study.impact.metrics.find((m) => /cache/i.test(m.label));
  const hitRate = cacheMetric ? parseRate(cacheMetric.value) : null;
  const standfirst = field(study.oneLiner);

  return (
    <section aria-labelledby="lead-story" className="pb-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-red m-0">Lead story · {study.title}</p>
      <h1
        id="lead-story"
        className="mt-3 font-display font-black tracking-[-0.03em] leading-[0.95] text-4xl sm:text-5xl lg:text-6xl"
      >
        {study.headline ?? study.title}
      </h1>
      {standfirst && !standfirst.todo && (
        <p className="mt-4 mb-0 text-xl leading-snug italic text-ink-soft max-w-[58ch]">{standfirst.value}</p>
      )}

      <div className="mt-8">
        <PipelineDiagram steps={steps} hitRate={hitRate} />
      </div>

      <MoreLink label="Read the full story" to={`/work/${study.slug}/`} className="inline-block mt-4" />
    </section>
  );
};

export default LeadStory;
