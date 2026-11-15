import React from 'react';
import SectionHead from '../ui/SectionHead';
import StoryRow from '../ui/StoryRow';
import projects from '../../data/projects.json';
import { PRODUCT_CATEGORY, projectRow } from './Work';
import type { Project } from '../../types';

/** Things built on his own initiative. Always "Products": never "startups" or "founder". */
const Products = () => {
  const rows = (projects as unknown as Project[]).filter((p) => p.category === PRODUCT_CATEGORY);
  if (rows.length === 0) return null;

  return (
    <section className="pb-12">
      <SectionHead id="products" title="Products" />
      {rows.map((project) => (
        <StoryRow key={project.title} {...projectRow(project, project.status ?? project.year)} />
      ))}
    </section>
  );
};

export default Products;
