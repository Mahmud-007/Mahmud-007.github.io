import React from 'react';

import skillsData from '../data/skills.json';

const skills = skillsData;

const Skills = () => {
    return (
        <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-800/30">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
                    <span className="text-teal mr-2">Skills</span>
                    <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {Object.entries(skills).map(([category, items]) => (
                        <div key={category} className="bg-navy-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-navy-700">
                            <h3 className="text-xl font-bold text-teal mb-4">{category}</h3>
                            <div className="flex flex-wrap gap-2">
                                {items.map((skill) => (
                                    <span key={skill} className="px-3 py-1 bg-navy-700 text-slate-light rounded-full text-sm font-mono hover:text-teal hover:bg-navy-600 transition-colors cursor-default">
                                        {skill}
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

export default Skills;
