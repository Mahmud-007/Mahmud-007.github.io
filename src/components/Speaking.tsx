import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

const Speaking = () => {
    return (
        <section id="speaking" className="py-20 px-4 sm:px-6 lg:px-8 bg-content-surface/40">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
                    <span className="text-teal font-mono mr-2">// speaking</span>
                    <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
                </h2>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-teal/20 rounded-lg transform translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
                        <div className="relative rounded-lg overflow-hidden border-2 border-teal grayscale hover:grayscale-0 transition-all duration-300">
                            <StaticImage
                                src="../images/speaking.jpg"
                                alt="Mahmudur presenting"
                                placeholder="blurred"
                                layout="fullWidth"
                            />
                        </div>
                    </div>
                    <div>
                        <span className="inline-block text-xs font-mono text-status-green border border-status-green/30 rounded px-2 py-0.5 mb-4">DMEXCO</span>
                        <p className="text-slate-light text-lg leading-relaxed mb-6">
                            I presented the in-image widget architecture at DMEXCO — walking through how a distributed,
                            high-volume widget delivery system integrates across 26+ international publishers.
                        </p>
                        <h3 className="text-xl font-bold text-slate-lightest mb-4">Topics I speak on</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start text-slate-light">
                                <span className="text-teal mr-2 font-mono">▹</span>
                                <span>Scaling microservices and event-driven backends under production load</span>
                            </li>
                            <li className="flex items-start text-slate-light">
                                <span className="text-teal mr-2 font-mono">▹</span>
                                <span>Semantic search and caching for AI-driven content pipelines</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Speaking;
