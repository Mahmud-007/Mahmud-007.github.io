import React from 'react';
import { cn } from '../../utils/cn';

type Tone = 'default' | 'amber';

interface TagProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

/**
 * A plain inline label. Neighbouring tags read as "Node.js · AWS Lambda · LLM".
 * Amber is reserved for TODO badges in develop, which keep a border so they stand out.
 */
const Tag: React.FC<TagProps> = ({ children, tone = 'default', className }) => (
  <span
    className={cn(
      tone === 'amber'
        ? 'inline-block font-mono text-[11px] border border-todo-amber text-todo-amber px-1.5 py-0.5'
        : "font-body text-[14px] text-ink-soft after:content-['·'] after:mx-1.5 last:after:content-none",
      className
    )}
  >
    {children}
  </span>
);

export default Tag;
