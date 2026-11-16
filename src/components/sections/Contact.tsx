import React from 'react';
import SectionHead from '../ui/SectionHead';
import profile from '../../data/profile.json';
import type { Profile } from '../../types';

const me = profile as Profile;
const linkCls = 'font-display text-lg font-bold text-ink hover:text-accent transition-colors';

const Contact = () => (
  <section className="pb-12">
    <SectionHead id="contact" title="Contact" />
    <a
      href={`mailto:${me.email}`}
      className="block mt-5 font-display font-black leading-none text-3xl sm:text-5xl break-all hover:text-accent transition-colors"
    >
      {me.email}
    </a>
    <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
      {me.socials.map((s) => (
        <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className={linkCls}>
          {s.label} ↗
        </a>
      ))}
      <a href={me.resume} target="_blank" rel="noopener noreferrer" className={linkCls}>
        Résumé ↗
      </a>
    </div>
  </section>
);

export default Contact;
