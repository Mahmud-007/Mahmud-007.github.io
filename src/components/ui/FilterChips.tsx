import React from 'react';
import { cn } from '../../utils/cn';

interface FilterChipsProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
  counts?: Record<string, number>;
}

const FilterChips: React.FC<FilterChipsProps> = ({ options, active, onChange, counts }) => (
  <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter work by category">
    {options.map((option) => {
      const isActive = option === active;
      return (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={isActive}
          className={cn(
            'font-mono text-xs rounded border px-3 py-1.5 transition-colors duration-200',
            isActive
              ? 'border-teal text-teal bg-teal/10'
              : 'border-navy-700 text-slate-light hover:border-teal/40 hover:text-teal'
          )}
        >
          {option}
          {counts && counts[option] !== undefined && (
            <span className="ml-2 text-slate-light/50">{counts[option]}</span>
          )}
        </button>
      );
    })}
  </div>
);

export default FilterChips;
