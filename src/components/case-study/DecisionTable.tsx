import React from 'react';
import Tag from '../ui/Tag';
import TodoBadge from '../ui/TodoBadge';
import { field } from '../../utils/todo';
import type { CaseStudy } from '../../types';

const verdictTone = { chosen: 'green', rejected: 'default', considered: 'teal' } as const;

const Cell: React.FC<{ value: string }> = ({ value }) => {
  const resolved = field(value);
  if (!resolved) return null;
  return resolved.todo ? <TodoBadge /> : <>{resolved.value}</>;
};

const DecisionTable: React.FC<{ decision: CaseStudy['decision'] }> = ({ decision }) => {
  const chose = field(decision.chose);
  const rejected = field(decision.rejected);
  const why = field(decision.why);
  const options = decision.options ?? [];

  if (!chose && !rejected && !why && options.length === 0) return null;

  return (
    <div className="space-y-6">
      {options.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-navy-700">
          <table className="w-full text-sm font-mono">
            <thead className="bg-navy-900/70 text-slate-light/70">
              <tr>
                <th className="text-left p-3 font-normal">option</th>
                <th className="text-left p-3 font-normal">cost</th>
                <th className="text-left p-3 font-normal">risk</th>
                <th className="text-left p-3 font-normal">verdict</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option, i) => (
                <tr key={`${option.name}-${i}`} className="border-t border-navy-700">
                  <td className="p-3 text-slate-lightest"><Cell value={option.name} /></td>
                  <td className="p-3 text-slate-light"><Cell value={option.cost} /></td>
                  <td className="p-3 text-slate-light"><Cell value={option.risk} /></td>
                  <td className="p-3">
                    <Tag tone={verdictTone[option.verdict]}>{option.verdict}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(chose || rejected || why) && (
        <dl className="space-y-4 text-sm">
          {chose && (
            <div>
              <dt className="font-mono text-xs text-status-green mb-1">chose</dt>
              <dd className="text-slate-light">{chose.todo ? <TodoBadge /> : chose.value}</dd>
            </div>
          )}
          {rejected && (
            <div>
              <dt className="font-mono text-xs text-slate-light/60 mb-1">rejected</dt>
              <dd className="text-slate-light">{rejected.todo ? <TodoBadge /> : rejected.value}</dd>
            </div>
          )}
          {why && (
            <div>
              <dt className="font-mono text-xs text-teal mb-1">why</dt>
              <dd className="text-slate-light">{why.todo ? <TodoBadge /> : why.value}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
};

export default DecisionTable;
