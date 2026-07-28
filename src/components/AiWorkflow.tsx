import React from 'react';

const uses = [
  'iterate & prototype faster',
  'debug & explore edge cases',
  'evaluate architecture & implementation options',
];

const tools = ['Claude Code', 'Cursor', 'Codex', 'OpenCode'];

const AiWorkflow = () => {
  return (
    <section id="ai" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-lightest mb-8 flex items-center">
          <span className="text-teal font-mono mr-2">// how I work with AI</span>
          <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
        </h2>

        <div className="rounded-xl border border-navy-700 bg-navy-800/60 shadow-xl overflow-hidden font-mono">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-navy-700 bg-navy-900/70">
            <span className="w-3 h-3 rounded-full bg-red-400/70"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400/70"></span>
            <span className="w-3 h-3 rounded-full bg-status-green/80"></span>
            <span className="ml-3 text-xs text-slate-light">~/ai-assisted-dev</span>
          </div>
          <div className="p-6 sm:p-8 text-sm leading-relaxed">
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
                <span key={t} className="text-xs text-teal border border-teal/30 rounded px-2 py-1">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiWorkflow;
