import React from 'react';
import TodoBadge from '../ui/TodoBadge';
import { cn } from '../../utils/cn';
import { field } from '../../utils/todo';
import type { CaseStudy } from '../../types';

const Cell: React.FC<{ value: string }> = ({ value }) => {
  const resolved = field(value);
  if (!resolved) return null;
  return resolved.todo ? <TodoBadge /> : <>{resolved.value}</>;
};

const th = 'text-left py-2 pr-4 font-normal font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft';
const dt = 'font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft';

const DecisionTable: React.FC<{ decision: CaseStudy['decision'] }> = ({ decision }) => {
  const chose = field(decision.chose);
  const rejected = field(decision.rejected);
  const why = field(decision.why);
  const options = decision.options ?? [];

  if (!chose && !rejected && !why && options.length === 0) return null;

  const notes: Array<[string, typeof chose]> = [
    ['Chose', chose],
    ['Rejected', rejected],
    ['Why', why],
  ];

  return (
    <div className="space-y-6">
      {options.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-y border-ink text-[17px] leading-snug">
            <thead>
              <tr className="border-b border-ink">
                <th className={th}>Option</th>
                <th className={th}>Cost</th>
                <th className={th}>Risk</th>
                <th className={th}>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option, i) => (
                <tr key={`${option.name}-${i}`} className="border-t border-ink/25 align-top">
                  <td className="py-2.5 pr-4 font-display font-black"><Cell value={option.name} /></td>
                  <td className="py-2.5 pr-4 text-ink-soft"><Cell value={option.cost} /></td>
                  <td className="py-2.5 pr-4 text-ink-soft"><Cell value={option.risk} /></td>
                  <td
                    className={cn(
                      'py-2.5 font-mono text-[11px] uppercase tracking-[0.12em]',
                      option.verdict === 'chosen' ? 'text-red' : 'text-ink-soft'
                    )}
                  >
                    {option.verdict}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(chose || rejected || why) && (
        <dl className="m-0 grid gap-3">
          {notes.map(
            ([label, value]) =>
              value && (
                <div key={label} className="grid sm:grid-cols-[6rem_1fr] gap-x-4 gap-y-0.5 items-baseline">
                  <dt className={dt}>{label}</dt>
                  <dd className="m-0 text-[19px] leading-snug">{value.todo ? <TodoBadge /> : value.value}</dd>
                </div>
              )
          )}
        </dl>
      )}
    </div>
  );
};

export default DecisionTable;
