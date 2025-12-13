import React from 'react';
import experienceData from '../data/experience.json';

interface Highlight {
  title: string;
  desc: string;
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
          <span className="text-teal mr-2">Where I've Worked</span>
          <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
        </h2>
        <div className="relative border-l border-slate-700 ml-3 space-y-12">
          {(experienceData as Job[]).map((job, index) => (
            <div key={index} className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-navy-900 rounded-full -left-3 ring-8 ring-navy-900">
                <span className="w-3 h-3 bg-teal rounded-full"></span>
              </span>
              <div className="bg-navy-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-navy-700">
                <h3 className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                  <span className="text-xl font-bold text-slate-lightest">
                    {job.role} <span className="text-teal">@ {job.company}</span>
                  </span>
                  <span className="text-sm font-mono text-slate-light mt-1 sm:mt-0">{job.period}</span>
                </h3>
                <p className="text-sm font-mono text-teal mb-4">{job.type}</p>
                
                <div className="mb-4">
                  <ul className="space-y-4">
                    {job.highlights.map((highlight, i) => (
                      <li key={i} className="text-slate-light">
                        <span className="font-bold text-slate-lightest block mb-1">▹ {highlight.title}</span>
                        <span className="text-sm">{highlight.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {job.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-navy-900 text-teal rounded-full text-xs font-mono border border-teal/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
