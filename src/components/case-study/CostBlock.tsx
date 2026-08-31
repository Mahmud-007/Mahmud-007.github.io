import React from 'react';
import TodoBadge from '../ui/TodoBadge';
import { field } from '../../utils/todo';
import type { CaseStudy } from '../../types';

const LABELS: Array<[keyof CaseStudy['cost'], string]> = [
  ['engineering', 'engineering cost'],
  ['run', 'run cost'],
  ['timeline', 'timeline'],
];

const CostBlock: React.FC<{ cost: CaseStudy['cost'] }> = ({ cost }) => {
  const rows = LABELS.map(([key, label]) => ({ label, resolved: field(cost[key]) })).filter(
    (row) => row.resolved !== null
  );

  if (rows.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {rows.map((row) => (
        <div key={row.label} className="rounded-lg border border-navy-700 bg-content-surface/70 p-4">
          <p className="font-mono text-xs text-slate-light/60 mb-2">{row.label}</p>
          <p className="text-sm text-slate-lightest">
            {row.resolved?.todo ? <TodoBadge /> : row.resolved?.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CostBlock;
