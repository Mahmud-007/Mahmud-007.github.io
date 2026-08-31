import React from 'react';
import CountUp from '../ui/CountUp';
import TodoBadge from '../ui/TodoBadge';
import { field } from '../../utils/todo';
import type { Metric } from '../../types';

const ImpactStrip: React.FC<{ metrics: Metric[] }> = ({ metrics }) => {
  const usable = metrics.filter((m) => field(m.value) !== null);
  if (usable.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-8">
      {usable.map((metric, i) => {
        const value = field(metric.value);
        const baseline = field(metric.baseline);
        return (
          <div key={`${metric.label}-${i}`} className="rounded-lg border border-navy-700 bg-navy-900/50 p-4">
            <div className="text-status-green text-2xl font-bold font-mono">
              {value?.todo ? <TodoBadge /> : <CountUp value={metric.value} />}
            </div>
            <div className="text-slate-light text-xs mt-1">{metric.label}</div>
            {baseline && (
              <div className="text-slate-light/50 text-[11px] font-mono mt-2">
                {baseline.todo ? <TodoBadge label="baseline TODO" /> : `from ${baseline.value}`}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImpactStrip;
