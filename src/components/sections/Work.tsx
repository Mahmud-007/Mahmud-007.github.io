import React from 'react';
import { Link } from 'gatsby';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import FilterChips from '../ui/FilterChips';
import Tag from '../ui/Tag';
import TodoBadge from '../ui/TodoBadge';
import projects from '../../data/projects.json';
import { isTodo, listField } from '../../utils/todo';
import type { Project } from '../../types';

const ALL = 'All';
const CATEGORIES = [ALL, 'Backend & Distributed', 'AI & LLM', 'Product', 'Tooling'];

const Work = () => {
  const [active, setActive] = React.useState(ALL);
  const reduced = useReducedMotion();
  const all = projects as unknown as Project[];

  const counts = React.useMemo(() => {
    const result: Record<string, number> = { [ALL]: all.length };
    for (const category of CATEGORIES.slice(1)) {
      result[category] = all.filter((p) => p.category === category).length;
    }
    return result;
  }, [all]);

  const visible = active === ALL ? all : all.filter((p) => p.category === active);

  return (
    <section id="work" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading label="work" />

        <FilterChips options={CATEGORIES} active={active} onChange={setActive} counts={counts} />

        <motion.div layout={!reduced} className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.article
                key={project.title}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="bg-navy-800 p-6 rounded-lg border border-navy-700 hover:border-teal/40 transition-colors duration-300 flex flex-col h-full group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  {project.metric &&
                    (isTodo(project.metric) ? <TodoBadge label="metric TODO" /> : <Tag tone="green">{project.metric}</Tag>)}
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-light/50 ml-auto">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-lightest mb-2 group-hover:text-teal transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-light mb-4 flex-grow text-sm leading-relaxed">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {listField(project.tags).map((tag) =>
                    isTodo(tag) ? (
                      <TodoBadge key={tag} label="tags TODO" />
                    ) : (
                      <span key={tag} className="text-xs font-mono text-slate-light/70">{tag}</span>
                    )
                  )}
                </div>

                <div className="mt-auto flex items-center gap-4 font-mono text-xs">
                  {project.caseStudySlug && (
                    <Link
                      to={`/work/${project.caseStudySlug}/`}
                      className="text-teal hover:text-teal/80 transition-colors"
                    >
                      read case study →
                    </Link>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-light hover:text-teal transition-colors"
                    >
                      visit ↗
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Work;
