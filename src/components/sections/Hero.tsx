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
              href="#contact"
              className="px-6 py-3 bg-teal text-navy-900 rounded border border-teal hover:bg-teal/80 transition-colors duration-300 font-bold text-sm"
            >
              Let's Work Together
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
