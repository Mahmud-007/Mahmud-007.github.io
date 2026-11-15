import React from 'react';
import { cn } from '../../utils/cn';

type Tone = 'default' | 'amber';

interface TagProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

/** Square mono label with a hairline border. Amber is reserved for TODO badges in develop. */
const Tag: React.FC<TagProps> = ({ children, tone = 'default', className }) => (
  <span
    className={cn(
      'inline-block font-mono text-[10px] uppercase tracking-[0.08em] border px-1.5 py-0.5',
      tone === 'amber' ? 'text-todo-amber border-todo-amber' : 'text-ink-soft border-ink/40',
      className
    )}
  >
    {children}
  </span>
);

export default Tag;
