import React from 'react';
import { cn } from '../../utils/cn';

type Tone = 'default' | 'green' | 'teal' | 'amber';

const tones: Record<Tone, string> = {
  default: 'text-slate-light/80 border-navy-700',
  green: 'text-status-green border-status-green/30',
  teal: 'text-teal border-teal/30',
  amber: 'text-todo-amber border-todo-amber/40',
};

interface TagProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, tone = 'default', className }) => (
  <span
    className={cn(
      'inline-block text-xs font-mono border rounded px-2 py-0.5',
      tones[tone],
      className
    )}
  >
    {children}
  </span>
);

export default Tag;
