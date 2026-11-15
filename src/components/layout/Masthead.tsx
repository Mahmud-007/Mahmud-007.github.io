import React from 'react';
import { Link } from 'gatsby';
import Rule from '../ui/Rule';
import Dateline from '../ui/Dateline';
import StatusPill from '../ui/StatusPill';
import PressPhoto from '../ui/PressPhoto';
import profile from '../../data/profile.json';
import { visibleSections } from './sections';
import type { Profile } from '../../types';

const me = profile as Profile;
const [firstName, ...rest] = me.name.split(' ');

const linkCls = 'font-mono text-[11px] uppercase tracking-[0.14em] text-ink hover:text-red transition-colors';

/** The paper's nameplate. Name only: no role and no tagline (design doc, section 3). */
const Masthead: React.FC<{ hidden?: string[] }> = ({ hidden }) => (
  <header className="flex flex-col gap-4 lg:h-full">
    <Link to="/" className="block font-display font-black tracking-[-0.035em] leading-[0.88] text-[2.75rem] sm:text-6xl lg:text-[2.9rem] hover:text-red transition-colors">
      {firstName}
      <br />
      {rest.join(' ')}
    </Link>

    <Rule variant="double" />

    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
      <Dateline items={[me.location]} />
      <StatusPill status={me.availability.status} tone={me.availability.tone} />
    </div>

    <PressPhoto className="hidden lg:block max-w-[220px]" caption={`${me.name}, ${me.location.split(',')[0]}`} />

    <nav aria-label="Sections" className="hidden lg:flex flex-col gap-1.5 mt-2">
      {visibleSections(hidden).map((s) => (
        <Link key={s.id} to={`/#${s.id}`} className={linkCls}>
          {s.label}
        </Link>
      ))}
    </nav>

    <div className="hidden lg:flex flex-wrap gap-x-3 gap-y-1 mt-auto pt-4 border-t border-ink/25">
      {me.socials.map((s) => (
        <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className={linkCls}>
          {s.label}
        </a>
      ))}
      <a href={me.resume} target="_blank" rel="noopener noreferrer" className={linkCls}>
        Résumé ↗
      </a>
    </div>
  </header>
);

export default Masthead;
