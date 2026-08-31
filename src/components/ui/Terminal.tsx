import React from 'react';
import { cn } from '../../utils/cn';

interface TerminalProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

const Terminal: React.FC<TerminalProps> = ({ title, children, className, bodyClassName }) => (
  <div
    className={cn(
      'rounded-xl border border-navy-700 bg-navy-800/60 shadow-2xl overflow-hidden font-mono',
      className
    )}
  >
    <div className="flex items-center gap-2 px-4 py-3 border-b border-navy-700 bg-navy-900/70">
      <span className="w-3 h-3 rounded-full bg-red-400/70" />
      <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
      <span className="w-3 h-3 rounded-full bg-status-green/80" />
      <span className="ml-3 text-xs text-slate-light">{title}</span>
    </div>
    <div className={cn('p-5 sm:p-8 text-sm sm:text-base leading-relaxed', bodyClassName)}>
      {children}
    </div>
  </div>
);

export default Terminal;
