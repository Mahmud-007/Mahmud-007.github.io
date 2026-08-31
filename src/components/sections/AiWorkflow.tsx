import React from 'react';
import Terminal from '../ui/Terminal';
import SectionHeading from '../ui/SectionHeading';
import Tag from '../ui/Tag';

const uses = [
  'iterate & prototype faster',
  'debug & explore edge cases',
  'evaluate architecture & implementation options',
];

const tools = ['Claude Code', 'Antigravity', 'Cursor', 'Codex', 'OpenCode'];

const AiWorkflow = () => {
  return (
    <section id="ai" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionHeading label="how I work with AI" />

        <Terminal title="~/ai-assisted-dev">
          <p className="text-slate-light"><span className="text-status-green">$</span> ai --use-for</p>
          <ul className="mt-2 mb-6 space-y-1">
            {uses.map((u) => (
              <li key={u} className="text-slate-lightest">
                <span className="text-teal mr-2">›</span>{u}
              </li>
            ))}
          </ul>
          <p className="text-slate-light"><span className="text-status-green">$</span> ai --verify</p>
          <p className="text-slate-lightest font-sans mt-2 leading-relaxed">
            I critically review AI output, catch incorrect assumptions, and verify correctness before it
            reaches production — AI accelerates iteration and reasoning, it never replaces core reasoning or system design.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {tools.map((t) => (
              <Tag key={t} tone="teal">{t}</Tag>
            ))}
          </div>
        </Terminal>
      </div>
    </section>
  );
};

export default AiWorkflow;
