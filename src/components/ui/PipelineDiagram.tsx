import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import TodoBadge from './TodoBadge';
import { cn } from '../../utils/cn';
import { IS_DEV, isTodo } from '../../utils/todo';
import { hitPattern, stepNotes, type StepLike } from '../../utils/pipeline';

const STEP_MS = 750;

interface LoopState {
  request: number;
  at: number;
  viaCache: boolean;
}

/** Walks one request after another through the steps. A cache hit jumps from the cache step to the last step. */
function useRequestLoop(count: number, cacheIndex: number, pattern: boolean[], enabled: boolean): LoopState {
  const [state, setState] = React.useState<LoopState>({ request: 0, at: 0, viaCache: false });

  React.useEffect(() => {
    if (!enabled || count < 2) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setState((prev) => {
        if (prev.at >= count - 1) return { request: prev.request + 1, at: 0, viaCache: false };
        const hit = pattern[prev.request % pattern.length];
        const canSkip = cacheIndex >= 0 && cacheIndex < count - 2;
        if (hit && canSkip && prev.at === cacheIndex) return { ...prev, at: count - 1, viaCache: true };
        return { ...prev, at: prev.at + 1 };
      });
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [count, cacheIndex, pattern, enabled]);

  return state;
}

interface PipelineDiagramProps {
  steps: StepLike[];
  /** Share of requests answered by the cache step, 0..1. Null hides everything that depends on it. */
  hitRate: number | null;
}

const PipelineDiagram: React.FC<PipelineDiagramProps> = ({ steps, hitRate }) => {
  const reduced = useReducedMotion();
  // Open on the cache step when it has something to say, so the notes are never empty on arrival.
  const initial = steps.find((s) => s.cacheNode && stepNotes(s, IS_DEV).length > 0)?.id ?? null;
  const [selected, setSelected] = React.useState<string | null>(initial);

  const pattern = React.useMemo(() => hitPattern(hitRate ?? 0), [hitRate]);
  const cacheIndex = steps.findIndex((s) => s.cacheNode);
  // Stay static until mounted: the server cannot know the visitor's motion preference, and the
  // first client render has to match what the server sent.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const animate = mounted && !reduced && steps.length > 1;
  const loop = useRequestLoop(steps.length, cacheIndex, pattern, animate);

  if (steps.length === 0) return null;

  const active = steps.find((s) => s.id === selected) ?? null;
  const notes = active ? stepNotes(active, IS_DEV) : [];
  const hits = pattern.filter(Boolean).length;
  const skipped = (i: number) => animate && loop.viaCache && i > cacheIndex && i < steps.length - 1;

  let status = 'in flight';
  if (loop.viaCache) status = 'cache hit, model skipped';
  else if (loop.at > cacheIndex) status = 'cache miss, model called';

  return (
    <div>
      <ol className="list-none m-0 p-0 flex flex-col md:flex-row md:items-center font-mono text-xs">
        {steps.map((step, i) => {
          const interactive = stepNotes(step, IS_DEV).length > 0;
          const isSelected = step.id === selected;
          const live = animate && loop.at === i;
          const nodeCls = cn(
            'relative block w-full md:w-auto text-left md:text-center border px-3 py-2 transition-colors',
            step.cacheNode ? 'border-accent bg-accent text-paper' : 'border-ink bg-paper text-ink',
            isSelected && 'outline outline-2 outline-offset-2 outline-ink',
            skipped(i) && 'opacity-30'
          );
          const marker = live ? (
            <span aria-hidden="true" className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-ink ring-2 ring-paper" />
          ) : null;
          // The dot runs along the connector that leads into the step the request has just reached.
          const arriving = animate && loop.at === i + 1 && !loop.viaCache;

          return (
            <React.Fragment key={step.id}>
              <li className="md:shrink-0">
                {interactive ? (
                  <button
                    type="button"
                    className={cn(nodeCls, 'cursor-pointer hover:bg-ink hover:text-paper hover:border-ink')}
                    aria-pressed={isSelected}
                    onClick={() => setSelected(step.id)}
                    onMouseEnter={() => setSelected(step.id)}
                    onFocus={() => setSelected(step.id)}
                  >
                    {step.label}
                    {marker}
                  </button>
                ) : (
                  <span className={nodeCls}>
                    {step.label}
                    {marker}
                  </span>
                )}
              </li>
              {i < steps.length - 1 && (
                <li
                  aria-hidden="true"
                  className={cn(
                    'relative self-start md:self-center ml-5 md:ml-0 w-px h-5 md:h-px md:w-auto md:flex-1 md:min-w-4 bg-ink',
                    (skipped(i) || skipped(i + 1)) && 'opacity-30'
                  )}
                >
                  {arriving && (
                    <>
                      <motion.span
                        key={`h-${loop.request}-${loop.at}`}
                        className="hidden md:block absolute top-1/2 -mt-1 -ml-1 w-2 h-2 rounded-full bg-ink"
                        initial={{ left: '0%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: STEP_MS / 1000, ease: 'linear' }}
                      />
                      <motion.span
                        key={`v-${loop.request}-${loop.at}`}
                        className="md:hidden absolute left-1/2 -ml-1 -mt-1 w-2 h-2 rounded-full bg-ink"
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: STEP_MS / 1000, ease: 'linear' }}
                      />
                    </>
                  )}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>

      {hitRate !== null && cacheIndex >= 0 && (
        <p className="mt-3 mb-0 font-body text-sm text-ink-soft flex flex-wrap gap-x-4 gap-y-1">
          <span>
            {hits} of {pattern.length} requests answered from cache
          </span>
          {animate && (
            <span aria-hidden="true" className="text-ink">
              Request {loop.request + 1}: {status}
            </span>
          )}
        </p>
      )}

      <div aria-live="polite" className="mt-4 min-h-[10rem] md:min-h-[7rem] border-t border-ink/25 pt-3">
        {active && notes.length > 0 ? (
          <dl className="m-0 grid gap-2">
            {notes.map((note) => (
              <div key={note.label} className="grid grid-cols-[4.5rem_1fr] gap-2 items-baseline">
                <dt className="font-body text-sm text-ink-soft">{note.label}</dt>
                <dd className="m-0 text-[17px] leading-snug">
                  {isTodo(note.text) ? <TodoBadge label={`${note.label.toLowerCase()} TODO`} /> : note.text}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="m-0 italic text-ink-soft text-[17px]">
            Pick a step to see what it does, what it costs and how it fails.
          </p>
        )}
      </div>
    </div>
  );
};

export default PipelineDiagram;
