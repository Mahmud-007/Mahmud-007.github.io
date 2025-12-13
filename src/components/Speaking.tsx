import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

const Speaking = () => {
    return (
        <section id="speaking" className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-800/30">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
                    <span className="text-teal mr-2">Speaking & Community</span>
                    <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
                </h2>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-teal/20 rounded-lg transform translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
                        <div className="relative rounded-lg overflow-hidden border-2 border-teal grayscale hover:grayscale-0 transition-all duration-300">
                            <StaticImage
                                src="../images/speaking.jpg"
                                alt="Mahmudur Speaking"
                                placeholder="blurred"
                                layout="fullWidth"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-light text-lg leading-relaxed mb-6">
                            I’m passionate about sharing knowledge and connecting with the community. I'm actively preparing to share my insights on backend scalability, cloud architecture, and building robust systems.
                        </p>
                        <h3 className="text-xl font-bold text-slate-lightest mb-4">Topics I'm Excited to Discuss</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start text-slate-light">
                                <span className="text-teal mr-2">▹</span>
                                <span>Building Scalable Microservices with Node.js</span>
                            </li>
                            <li className="flex items-start text-slate-light">
                                <span className="text-teal mr-2">▹</span>
                                <span>Cloud Native Architecture & AWS Best Practices</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Speaking;
