import React from 'react';
import MoreLink from './MoreLink';

interface SectionHeadProps {
  id: string;
  title: string;
  more?: { label: string; to: string };
}

/** Newspaper section header: mono caps label on a heavy top rule, optional link on the right. */
const SectionHead: React.FC<SectionHeadProps> = ({ id, title, more }) => (
  <header className="flex items-baseline justify-between gap-4 border-t-2 border-ink pt-2 mb-2">
    <h2 id={id} className="font-mono text-xs font-medium uppercase tracking-[0.18em] scroll-mt-24 lg:scroll-mt-8">
      {title}
    </h2>
    {more && <MoreLink label={more.label} to={more.to} />}
  </header>
);

export default SectionHead;
