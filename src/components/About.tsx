import React from 'react';

const About = () => {
  const highlights = [
    "Own services end-to-end — design, deploy, monitor, and keep them stable in production.",
    "Cut LLM-pipeline latency and cost with semantic caching: 70% hit rate, sub-second p50, 300%+ ROI.",
    "Hardened data pipelines with async queuing and exponential backoff, eliminating dropped feeds at peak.",
    "Operate high-concurrency microservices under strict SLAs, supporting 32.4% MAU growth.",
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-content-surface/40">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-lightest mb-8 flex items-center">
          <span className="text-teal font-mono mr-2">// about</span>
          <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
        </h2>
        <div className="text-slate-light text-lg leading-relaxed">
          <p className="mb-6">
            I'm a backend-focused full-stack engineer with ~4 years of experience owning systems in
            production. My strength is designing scalable, cost-efficient services and being accountable
            for how they behave under load — not just shipping endpoints. I care about bottlenecks,
            trade-offs, and failure modes, and I use AI tools to move faster without outsourcing the reasoning.
          </p>
          <div className="mb-6">
            <h3 className="text-slate-lightest font-bold mb-4 font-mono">Key highlights</h3>
            <ul className="space-y-2">
              {highlights.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-status-green mr-2 mt-1 font-mono">▹</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
