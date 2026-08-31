import React from 'react';

interface SectionHeadingProps {
  label: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ label }) => (
  <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
    <span className="text-teal font-mono mr-2">{`// ${label}`}</span>
    <span className="h-px bg-rule flex-grow ml-4 max-w-xs" />
  </h2>
);

export default SectionHeading;
