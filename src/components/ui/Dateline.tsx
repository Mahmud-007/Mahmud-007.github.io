import React from 'react';
import { cn } from '../../utils/cn';

interface DatelineProps {
  items: string[];
  className?: string;
}

/** Mono caps line of short facts, like the strip under a newspaper's name. */
const Dateline: React.FC<DatelineProps> = ({ items, className }) => (
  <p className={cn('font-body text-sm text-ink-soft', className)}>
    {items.filter(Boolean).join(' · ')}
  </p>
);

export default Dateline;
