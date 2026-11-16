import React from 'react';
import { Link } from 'gatsby';
import { visibleSections } from './sections';

/** Sticky section strip for small screens, where the masthead column is not on screen. */
const SectionBar: React.FC<{ hidden?: string[] }> = ({ hidden }) => (
  <nav
    aria-label="Sections"
    className="lg:hidden sticky top-0 z-20 bg-paper border-y border-ink"
  >
    <ul className="flex flex-wrap gap-x-5 gap-y-1.5 px-5 py-2.5 m-0 list-none">
      {visibleSections(hidden).map((s) => (
        <li key={s.id}>
          <Link to={`/#${s.id}`} className="font-display text-lg font-bold text-ink hover:text-accent">
            {s.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default SectionBar;
