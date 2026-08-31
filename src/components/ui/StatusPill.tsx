import React from 'react';
import { cn } from '../../utils/cn';

interface StatusPillProps {
  status: string;
  tone: 'green' | 'amber';
}

const StatusPill: React.FC<StatusPillProps> = ({ status, tone }) => (
  <span
    className={cn(
      'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono',
      tone === 'green'
        ? 'border-status-green/40 text-status-green'
        : 'border-todo-amber/40 text-todo-amber'
    )}
  >
    <span
      className={cn(
        'w-2 h-2 rounded-full',
        tone === 'green' ? 'bg-status-green' : 'bg-todo-amber'
      )}
    />
    {status}
  </span>
);

export default StatusPill;
