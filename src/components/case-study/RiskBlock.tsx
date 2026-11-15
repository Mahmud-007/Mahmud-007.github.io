import React from 'react';
import TodoBadge from '../ui/TodoBadge';
import { field, listField, isTodo } from '../../utils/todo';
import type { CaseStudy } from '../../types';

const List: React.FC<{ title: string; items: string[] }> = ({ title, items }) => {
  const usable = listField(items);
  if (usable.length === 0) return null;
  return (
    <div>
      <p className="m-0 mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">{title}</p>
      <ul className="list-none m-0 p-0 border-t border-ink/25">
        {usable.map((item, i) => (
          <li key={`${item}-${i}`} className="py-2 border-b border-ink/25 text-[17px] leading-snug">
            {isTodo(item) ? <TodoBadge /> : item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const RiskBlock: React.FC<{ risk: CaseStudy['risk'] }> = ({ risk }) => {
  const operational = field(risk.operational);
  const modes = listField(risk.failureModes);
  const mitigations = listField(risk.mitigations);

  if (!operational && modes.length === 0 && mitigations.length === 0) return null;

  return (
    <div className="space-y-6">
      {operational && (
        <p className="m-0 text-[19px] leading-snug">{operational.todo ? <TodoBadge /> : operational.value}</p>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <List title="How it fails" items={risk.failureModes} />
        <List title="What guards it" items={risk.mitigations} />
      </div>
    </div>
  );
};

export default RiskBlock;
