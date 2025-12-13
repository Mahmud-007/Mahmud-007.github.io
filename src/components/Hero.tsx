import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-0">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-teal font-mono mb-5 text-lg">Hi, my name is</p>
          <h1 className="text-5xl sm:text-7xl font-bold text-slate-lightest mb-4 tracking-tight">
            Mahmudur Rahman.
          </h1>
          <h2 className="text-4xl sm:text-6xl font-bold text-slate-light mb-8 tracking-tight">
            I build scalable backend systems.
          </h2>
          <p className="max-w-xl text-lg text-slate-light mb-12 leading-relaxed">
            I'm a backend-focused full-stack software engineer specializing in designing and implementing scalable, cost-efficient systems with Node.js, React, and AWS for millions of users.
          </p>
          <div className="flex gap-5">
            <a
              href="https://github.com/Mahmud-007"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 border border-teal text-teal rounded hover:bg-teal/10 transition-colors duration-300 font-mono text-sm"
            >
              Check out my code
            </a>
            <a
               href="#contact"
               className="px-8 py-4 bg-teal text-navy-900 rounded border border-teal hover:bg-teal/80 transition-colors duration-300 font-mono font-bold text-sm"
            >
              Contact Me
            </a>
          </div>
        </div>
        <div className="hidden md:block relative group max-w-sm mx-auto">
            <div className="absolute inset-0 bg-teal rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-2xl"></div>
            <div className="relative rounded-full overflow-hidden border-4 border-teal/50 shadow-2xl aspect-square">
               <StaticImage
                 src="../images/profile.png"
                 alt="Mahmudur Rahman"
                 placeholder="none"
                 layout="constrained"
                 quality={95}
                 className="h-full w-full object-cover"
               />
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
