import React from 'react';
import TodoBadge from '../ui/TodoBadge';
import { field, listField, isTodo } from '../../utils/todo';
import type { CaseStudy } from '../../types';

const List: React.FC<{ title: string; items: string[]; marker: string; tone: string }> = ({
  title,
  items,
  marker,
  tone,
}) => {
  const usable = listField(items);
  if (usable.length === 0) return null;
  return (
    <div>
      <p className="font-mono text-xs text-slate-light/60 mb-3">{title}</p>
      <ul className="space-y-2">
        {usable.map((item, i) => (
          <li key={`${item}-${i}`} className="flex items-start text-sm text-slate-light">
            <span className={`mr-2 font-mono ${tone}`}>{marker}</span>
            {isTodo(item) ? <TodoBadge /> : <span>{item}</span>}
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
        <p className="text-slate-light text-sm leading-relaxed">
          {operational.todo ? <TodoBadge /> : operational.value}
        </p>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <List title="failure modes" items={risk.failureModes} marker="✗" tone="text-orange-soft" />
        <List title="mitigations" items={risk.mitigations} marker="✓" tone="text-status-green" />
      </div>
    </div>
  );
};

export default RiskBlock;
