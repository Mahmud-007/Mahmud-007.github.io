/**
 * Pure helpers for the pipeline diagram. Imports nothing so it can be unit-tested with `node --test`.
 */

export interface StepLike {
  id: string;
  label: string;
  does?: string;
  costs?: string;
  fails?: string;
  cacheNode?: boolean;
}

export type NoteLabel = 'Does' | 'Costs' | 'Fails';

const isTodo = (value?: string) => typeof value === 'string' && value.trim().toUpperCase() === 'TODO';

/** Case studies may list steps as plain strings or as full objects. Always return objects. */
export function normalizeSteps(steps: Array<string | StepLike>): StepLike[] {
  if (!Array.isArray(steps)) return [];
  return steps.map((step) =>
    typeof step === 'string'
      ? { id: step.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), label: step }
      : step
  );
}

/** The notes a reader can open on a step. TODO fields are kept only when `showTodo` is on (develop). */
export function stepNotes(step: StepLike, showTodo: boolean): Array<{ label: NoteLabel; text: string }> {
  const fields: Array<[NoteLabel, string | undefined]> = [
    ['Does', step.does],
    ['Costs', step.costs],
    ['Fails', step.fails],
  ];
  const notes: Array<{ label: NoteLabel; text: string }> = [];
  for (const [label, text] of fields) {
    if (!text || !text.trim()) continue;
    if (isTodo(text) && !showTodo) continue;
    notes.push({ label, text: text.trim() });
  }
  return notes;
}

/** "70%" -> 0.7. Anything that is not a plain percentage between 0 and 100 -> null. */
export function parseRate(value: string): number | null {
  const match = /^\s*(\d+(?:\.\d+)?)\s*%\s*$/.exec(value ?? '');
  if (!match) return null;
  const rate = Number(match[1]) / 100;
  return rate >= 0 && rate <= 1 ? rate : null;
}

/** A repeating sequence of cache hits (true) and misses, with hits spread evenly rather than bunched. */
export function hitPattern(rate: number, length = 10): boolean[] {
  const pattern: boolean[] = [];
  let acc = 0;
  for (let i = 0; i < length; i++) {
    acc += rate;
    if (acc >= 1 - 1e-9) {
      pattern.push(true);
      acc -= 1;
    } else {
      pattern.push(false);
    }
  }
  return pattern;
}
