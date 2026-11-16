import React from 'react';
import { Link } from 'gatsby';
import { cn } from '../../utils/cn';

interface MoreLinkProps {
  label: string;
  to: string;
  className?: string;
  /** Trailing arrow. Turn off for back links that carry their own. */
  arrow?: boolean;
}

const base =
  'font-display text-base font-bold text-ink hover:text-accent transition-colors whitespace-nowrap';

/** Small mono link with an arrow. Internal paths use Gatsby's router. */
const MoreLink: React.FC<MoreLinkProps> = ({ label, to, className, arrow = true }) =>
  /^https?:/.test(to) ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className={cn(base, className)}>
      {label}{arrow && ' ↗'}
    </a>
  ) : (
    <Link to={to} className={cn(base, className)}>
      {label}{arrow && ' →'}
    </Link>
  );

export default MoreLink;
