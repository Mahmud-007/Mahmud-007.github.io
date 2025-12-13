import React from 'react';

const About = () => {
  const highlights = [
    "Designed microservices serving millions of football fans.",
    "Improved app engagement and active users with React Native and Node.js.",
    "Built data pipelines, dashboards, and internal tools across AWS and ELK."
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-lightest mb-8 flex items-center">
          <span className="text-teal mr-2">About Me</span>
          <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
        </h2>
        <div className="text-slate-light text-lg leading-relaxed">
          <p className="mb-6">
            I am a backend-focused full-stack software engineer for almost 4 years of experience.
            My strength lies in designing and implementing scalable, cost-efficient systems using Node.js, React, and AWS.
            I thrive in building distributed systems and designing robust APIs that serve millions of users.
          </p>
          <div className="mb-6">
            <h3 className="text-slate-lightest font-bold mb-4">Key Highlights:</h3>
            <ul className="space-y-2">
              {highlights.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-teal mr-2 mt-1">▹</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
