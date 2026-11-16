import React from 'react';
import MoreLink from './MoreLink';

interface SectionHeadProps {
  id: string;
  title: string;
  more?: { label: string; to: string };
}

/** Newspaper section flag: white on a black bar over a heavy rule, so it never reads like a story headline. */
export const sectionFlag =
  'inline-block bg-ink text-paper font-display font-bold uppercase text-[15px] tracking-[0.08em] leading-none px-2.5 py-1.5';

const SectionHead: React.FC<SectionHeadProps> = ({ id, title, more }) => (
  <header className="flex items-end justify-between gap-4 border-b-2 border-ink mb-2">
    <h2 id={id} className={`${sectionFlag} scroll-mt-24 lg:scroll-mt-8`}>
      {title}
    </h2>
    {more && <MoreLink label={more.label} to={more.to} className="pb-1" />}
  </header>
);

export default SectionHead;
