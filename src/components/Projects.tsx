import React from 'react';
import projectsData from '../data/projects.json';

interface Project {
  title: string;
  summary: string;
  tags: string[];
  link?: string;
}

const Projects = () => {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-800/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
          <span className="text-teal mr-2">Some Things I've Built</span>
          <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(projectsData as Project[]).map((project, index) => (
            <div key={index} className="bg-navy-800 p-6 rounded-lg shadow-lg hover:-translate-y-2 transition-transform duration-300 border border-navy-700 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-4">
                <div className="text-teal">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="flex gap-4">
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" className="text-slate-light hover:text-teal transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-lightest mb-2 group-hover:text-teal transition-colors">{project.title}</h3>
              <p className="text-slate-light mb-4 flex-grow text-sm leading-relaxed">
                {project.summary}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono text-slate-light/80 mr-2">
                    {tag}
                  </span>
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
