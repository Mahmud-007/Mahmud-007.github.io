import React from 'react';
import { cn } from '../../utils/cn';

interface RuleProps {
  variant?: 'hair' | 'double';
  className?: string;
}

/** A printed rule: a hairline, or the double rule that sits under a masthead. */
const Rule: React.FC<RuleProps> = ({ variant = 'hair', className }) => (
  <hr
    aria-hidden="true"
    className={cn(
      'border-0 border-ink m-0',
      variant === 'double' ? 'border-t-[3px] border-double' : 'border-t',
      className
    )}
  />
);

export default Rule;
