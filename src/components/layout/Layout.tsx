import React from 'react';
import Masthead from './Masthead';
import SectionBar from './SectionBar';
import profile from '../../data/profile.json';
import { useHiddenSections } from '../../hooks/useHiddenSections';

interface LayoutProps {
  children: React.ReactNode;
  /** Extra section ids to leave out of the navigation, on top of the ones with nothing to show. */
  hidden?: string[];
}

/**
 * Two columns from `lg` up: the masthead stays put on the left while stories scroll on the right.
 * Below `lg` the masthead sits on top and a sticky section bar takes over navigation.
 */
const Layout: React.FC<LayoutProps> = ({ children, hidden = [] }) => {
  const allHidden = [...useHiddenSections(), ...hidden];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[320px_minmax(0,1fr)] max-w-[1180px] mx-auto">
      <div className="px-5 pt-6 pb-4 lg:p-8 lg:border-r lg:border-ink lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:overflow-x-hidden">
        <Masthead hidden={allHidden} />
      </div>

      <SectionBar hidden={allHidden} />

      <div className="min-w-0">
        <main className="px-5 py-8 lg:px-12 lg:py-10 max-w-3xl">{children}</main>
        <footer className="px-5 lg:px-12 py-6 border-t border-ink/25 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
          {profile.name} · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default Layout;
