import React from 'react';
import SectionHead from '../ui/SectionHead';
import experience from '../../data/experience.json';
import type { Job } from '../../types';

/** A plain dated record. The detail of each piece of work lives in Work and the case studies. */
const Experience = () => {
  const jobs = experience as Job[];
  if (jobs.length === 0) return null;

  return (
    <section className="pb-12">
      <SectionHead id="experience" title="Experience" />
      {jobs.map((job) => (
        <article
          key={`${job.company}-${job.period}`}
          className="grid sm:grid-cols-[9.5rem_1fr] gap-x-6 gap-y-2 py-5 border-b border-ink/25"
        >
          <p className="m-0 font-body text-sm text-ink-soft sm:pt-1.5">
            {job.period}
            <br />
            {job.type}
          </p>
          <div>
            <h3 className="font-display text-2xl sm:text-[30px] font-extrabold leading-[1.02]">
              {job.role}, <span className="font-normal italic">{job.company}</span>
            </h3>
            <ul className="list-none m-0 mt-3 p-0">
              {job.highlights.map((h) => (
                <li key={h.title} className="flex items-baseline justify-between gap-4 py-1 text-[17px] leading-snug">
                  <span>{h.title}</span>
                  {h.metric && <span className="font-mono text-xs text-ink-soft shrink-0 text-right">{h.metric}</span>}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
  );
};

export default Experience;
