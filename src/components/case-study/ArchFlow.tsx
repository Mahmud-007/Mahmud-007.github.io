import React from 'react';
import TodoBadge from '../ui/TodoBadge';
import { IS_DEV, isTodo } from '../../utils/todo';
import { normalizeSteps, type StepLike } from '../../utils/pipeline';

/** The steps of a system as a numbered list. Accepts plain strings or full step objects. */
const ArchFlow: React.FC<{ steps: Array<string | StepLike> }> = ({ steps }) => {
  const usable = normalizeSteps(steps).filter((s) => IS_DEV || !isTodo(s.label));
  if (usable.length === 0) return null;

  return (
    <ol className="list-none m-0 p-0 border-t border-ink/25">
      {usable.map((step, i) => (
        <li key={`${step.id}-${i}`} className="grid grid-cols-[2.5rem_1fr] gap-2 py-2.5 border-b border-ink/25 items-baseline">
          <span className="font-mono text-[11px] text-ink-soft">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <span className="font-mono text-sm">{isTodo(step.label) ? <TodoBadge /> : step.label}</span>
            {step.does && !isTodo(step.does) && (
              <p className="m-0 mt-0.5 text-[17px] leading-snug text-ink-soft">{step.does}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ArchFlow;
