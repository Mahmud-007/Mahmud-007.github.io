/** Front-page sections, in reading order. Ids match the SectionHead id of each section. */
export const SECTIONS: Array<{ id: string; label: string }> = [
  { id: 'work', label: 'Work' },
  { id: 'products', label: 'Products' },
  { id: 'videos', label: 'Videos' },
  { id: 'writing', label: 'Writing' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export const visibleSections = (hidden: string[] = []) => SECTIONS.filter((s) => !hidden.includes(s.id));
