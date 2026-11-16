import React from 'react';
import TodoBadge from '../ui/TodoBadge';
import { field } from '../../utils/todo';
import type { Metric } from '../../types';

/** Headline numbers for a story, set large like a pull-quote, divided by rules. */
const ImpactStrip: React.FC<{ metrics: Metric[] }> = ({ metrics }) => {
  const usable = metrics.filter((m) => field(m.value) !== null);
  if (usable.length === 0) return null;

  return (
    <dl className="my-8 grid grid-cols-2 sm:grid-cols-3 border-y border-ink divide-x divide-ink/25">
      {usable.map((metric, i) => {
        const value = field(metric.value);
        const baseline = field(metric.baseline);
        return (
          <div key={`${metric.label}-${i}`} className="px-4 py-4 first:pl-0">
            <dd className="font-display text-4xl font-black leading-none m-0">
              {value?.todo ? <TodoBadge /> : metric.value}
            </dd>
            <dt className="mt-2 font-body text-sm text-ink-soft">{metric.label}</dt>
            {baseline && (
              <div className="mt-1 font-mono text-[11px] text-ink-soft">
                {baseline.todo ? <TodoBadge label="baseline TODO" /> : `from ${baseline.value}`}
              </div>
            )}
          </div>
        );
      })}
    </dl>
  );
};

export default ImpactStrip;
