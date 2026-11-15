import React from 'react';
import { Link } from 'gatsby';
import { cn } from '../../utils/cn';

interface MoreLinkProps {
  label: string;
  to: string;
  className?: string;
}

const base =
  'font-mono text-[11px] uppercase tracking-[0.14em] text-ink hover:text-red transition-colors whitespace-nowrap';

/** Small mono link with an arrow. Internal paths use Gatsby's router. */
const MoreLink: React.FC<MoreLinkProps> = ({ label, to, className }) =>
  /^https?:/.test(to) ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className={cn(base, className)}>
      {label} ↗
    </a>
  ) : (
    <Link to={to} className={cn(base, className)}>
      {label} →
    </Link>
  );

export default MoreLink;
