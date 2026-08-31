import React from 'react';
import certificationsData from '../../data/certifications.json';

interface Certification {
  title: string;
  issuer: string;
  issued: string;
  credentialId: string;
  skills: string[];
  link?: string;
}

const Certifications = () => {
  return (
    <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
          <span className="text-teal font-mono mr-2">// certifications</span>
          <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {(certificationsData as Certification[]).map((cert, index) => (
            <div key={index} className="rounded-lg border border-navy-700 bg-content-surface/70 p-5 hover:border-teal/40 transition-colors duration-300 flex flex-col h-full">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="text-slate-lightest font-bold leading-snug">{cert.title}</h3>
                <span className="text-xs font-mono text-slate-light whitespace-nowrap mt-1">{cert.issued}</span>
              </div>
              <p className="text-teal text-sm mb-3">{cert.issuer}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {cert.skills.map((skill) => (
                  <span key={skill} className="text-xs font-mono text-status-green border border-status-green/30 rounded px-2 py-0.5">
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-xs font-mono text-slate-light/70 mt-auto">
                Credential ID: {cert.credentialId}
              </p>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-teal hover:text-teal/80 transition-colors mt-3"
                >
                  Show credential
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
