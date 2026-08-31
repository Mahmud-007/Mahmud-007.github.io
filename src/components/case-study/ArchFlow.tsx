import React from 'react';
import { listField } from '../../utils/todo';

const ArchFlow: React.FC<{ steps: string[] }> = ({ steps }) => {
  const usable = listField(steps);
  if (usable.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
      {usable.map((step, i) => (
        <React.Fragment key={step}>
          <span className="rounded border border-navy-700 bg-navy-900/60 px-3 py-2 text-slate-lightest">
            {step}
          </span>
          {i < usable.length - 1 && <span className="text-teal">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ArchFlow;
