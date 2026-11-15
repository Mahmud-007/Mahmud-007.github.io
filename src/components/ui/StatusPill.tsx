import React from 'react';
import { cn } from '../../utils/cn';

interface StatusPillProps {
  status: string;
  tone: 'green' | 'amber';
  className?: string;
}

/** A plain mono fact with a small filled dot. */
const StatusPill: React.FC<StatusPillProps> = ({ status, tone, className }) => (
  <span className={cn('inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink', className)}>
    <span
      aria-hidden="true"
      className={cn('w-1.5 h-1.5 rounded-full', tone === 'green' ? 'bg-status-green' : 'bg-todo-amber')}
    />
    {status}
  </span>
);

export default StatusPill;
