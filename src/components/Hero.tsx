import React from 'react';

const metrics = [
  { value: '70%', label: 'cache hit rate' },
  { value: '32.4%', label: 'MAU growth' },
  { value: '<100ms', label: 'search retrieval' },
  { value: '30m→2m', label: 'ops automation' },
];

const Hero = () => {
  return (
    <section id="home" className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="max-w-4xl w-full mx-auto">
        <div className="rounded-xl border border-navy-700 bg-navy-800/60 shadow-2xl overflow-hidden font-mono">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-navy-700 bg-navy-900/70">
            <span className="w-3 h-3 rounded-full bg-red-400/70"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400/70"></span>
            <span className="w-3 h-3 rounded-full bg-status-green/80"></span>
            <span className="ml-3 text-xs text-slate-light">mahmud: ~/production</span>
          </div>

          <div className="p-5 sm:p-10 text-sm sm:text-base leading-relaxed">
            <p className="text-slate-light">
              <span className="text-status-green">$</span> whoami
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-slate-lightest mt-2 font-sans tracking-tight">
              Mahmudur Rahman
            </h1>
            <p className="text-teal font-sans text-lg sm:text-xl mt-1">
              Software Engineer — I own systems in production, not just features.
            </p>

            <p className="text-slate-light mt-4 sm:mt-6">
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

            <p className="hidden sm:block text-slate-light mt-4 sm:mt-6">
              <span className="text-status-green">$</span> cat ./intro.txt
            </p>
            <p className="hidden sm:block text-slate-light font-sans max-w-2xl mt-2 leading-relaxed">
              Backend-focused full-stack engineer. I design, deploy, monitor, and keep services
              stable under real production traffic — distributed systems, fault tolerance, and
              measurable performance and cost wins, with AI tools to move faster without outsourcing reasoning.
            </p>

            <div className="flex flex-wrap gap-4 mt-5 sm:mt-8 font-sans">
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

            <p className="text-slate-light mt-5 sm:mt-8">
              <span className="text-status-green">$</span> cat ./case-studies/ <span className="cursor-blink">▊</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
