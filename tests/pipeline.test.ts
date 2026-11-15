import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSteps, stepNotes, parseRate, hitPattern } from '../src/utils/pipeline.ts';

test('normalizeSteps converts strings and keeps objects', () => {
  assert.deepEqual(normalizeSteps(['cache lookup', { id: 'llm', label: 'LLM' }]), [
    { id: 'cache-lookup', label: 'cache lookup' },
    { id: 'llm', label: 'LLM' },
  ]);
});

test('normalizeSteps tolerates a missing list', () => {
  assert.deepEqual(normalizeSteps(undefined as any), []);
});

test('stepNotes drops TODO and empty fields in production', () => {
  const s = { id: 'x', label: 'x', does: 'Looks up prompt', costs: 'TODO', fails: '' };
  assert.deepEqual(stepNotes(s, false), [{ label: 'Does', text: 'Looks up prompt' }]);
});

test('stepNotes keeps TODO fields when showTodo is on', () => {
  const s = { id: 'x', label: 'x', does: 'Looks up prompt', costs: 'TODO', fails: '' };
  assert.equal(stepNotes(s, true).length, 2);
});

test('stepNotes is empty when every field is TODO, in any casing', () => {
  assert.deepEqual(stepNotes({ id: 'y', label: 'y', does: 'todo', costs: ' TODO ' }, false), []);
});

test('parseRate reads a percentage and rejects everything else', () => {
  assert.equal(parseRate('70%'), 0.7);
  assert.equal(parseRate('fast'), null);
  assert.equal(parseRate('TODO'), null);
  assert.equal(parseRate('300%+'), null);
});

test('hitPattern has the right share of hits and does not clump them first', () => {
  const p = hitPattern(0.7);
  assert.equal(p.length, 10);
  assert.equal(p.filter(Boolean).length, 7);
  assert.notDeepEqual(p.slice(0, 7), Array(7).fill(true));
});

test('hitPattern handles the extremes', () => {
  assert.deepEqual(hitPattern(0), Array(10).fill(false));
  assert.deepEqual(hitPattern(1), Array(10).fill(true));
});
