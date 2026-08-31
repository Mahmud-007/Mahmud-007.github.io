import React from 'react';
import projectsData from '../../data/projects.json';

interface Project {
  title: string;
  summary: string;
  tags: string[];
  link?: string;
  metric?: string;
}

const Projects = () => {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-content-surface/40">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
          <span className="text-teal font-mono mr-2">// projects</span>
          <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {(projectsData as Project[]).map((project, index) => (
            <div key={index} className="bg-navy-800 p-6 rounded-lg border border-navy-700 hover:-translate-y-1 hover:border-teal/40 transition-all duration-300 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-3">
                {project.metric ? (
                  <span className="text-xs font-mono text-status-green border border-status-green/30 rounded px-2 py-0.5">{project.metric}</span>
                ) : <span />}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" className="text-slate-light hover:text-teal transition-colors" aria-label={`Open ${project.title}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-lightest mb-2 group-hover:text-teal transition-colors">{project.title}</h3>
              <p className="text-slate-light mb-4 flex-grow text-sm leading-relaxed">{project.summary}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono text-slate-light/80">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
