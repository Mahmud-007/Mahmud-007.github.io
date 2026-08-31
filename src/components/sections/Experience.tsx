import React from 'react';
import experienceData from '../../data/experience.json';

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
                  {job.role} <span className="text-teal">@{job.company}</span>
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
