import React from 'react';
import SectionHead from '../ui/SectionHead';
import StoryRow from '../ui/StoryRow';
import projects from '../../data/projects.json';
import type { Project } from '../../types';

export const PRODUCT_CATEGORY = 'Product';

/** Turns a project into the props of a StoryRow. Case studies link inside the site; the rest link out. */
export const projectRow = (project: Project, meta?: string) => ({
  title: project.title,
  summary: project.summary,
  meta,
  tags: project.tags,
  href: project.caseStudySlug ? `/work/${project.caseStudySlug}/` : project.link,
  internal: Boolean(project.caseStudySlug),
});

/** Work done on the job. Own-initiative products live in the Products section. */
const Work = () => {
  const rows = (projects as unknown as Project[]).filter((p) => p.category !== PRODUCT_CATEGORY);
  if (rows.length === 0) return null;

  return (
    <section className="pb-12">
      <SectionHead id="work" title="Work" />
      {rows.map((project) => (
        <StoryRow key={project.title} {...projectRow(project, project.metric)} />
      ))}
    </section>
  );
};

export default Work;
