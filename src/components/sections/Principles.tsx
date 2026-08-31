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
