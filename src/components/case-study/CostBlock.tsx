import React from 'react';
import TodoBadge from '../ui/TodoBadge';
import { field } from '../../utils/todo';
import type { CaseStudy } from '../../types';

const LABELS: Array<[keyof CaseStudy['cost'], string]> = [
  ['engineering', 'Engineering'],
  ['run', 'Running'],
  ['timeline', 'Timeline'],
];

const CostBlock: React.FC<{ cost: CaseStudy['cost'] }> = ({ cost }) => {
  const rows = LABELS.map(([key, label]) => ({ label, resolved: field(cost[key]) })).filter(
    (row) => row.resolved !== null
  );

  if (rows.length === 0) return null;

  return (
    <dl className="m-0 grid gap-3">
      {rows.map((row) => (
        <div key={row.label} className="grid sm:grid-cols-[6rem_1fr] gap-x-4 gap-y-0.5 items-baseline">
          <dt className="font-body text-sm text-ink-soft">{row.label}</dt>
          <dd className="m-0 text-[19px] leading-snug">
            {row.resolved?.todo ? <TodoBadge /> : row.resolved?.value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default CostBlock;
