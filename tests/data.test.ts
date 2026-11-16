import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { findBanned } from '../src/utils/copy.ts';

const DATA_DIR = path.resolve('src/data');
const read = (name: string) => fs.readFileSync(path.join(DATA_DIR, name), 'utf8');
const json = (name: string) => JSON.parse(read(name));

test('no data file contains banned copy', () => {
  for (const file of fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'))) {
    assert.deepEqual(findBanned(read(file)), [], `banned copy in ${file}`);
  }
});

test('profile has no tagline or intro and has youtube config', () => {
  const profile = json('profile.json');
  assert.equal('tagline' in profile, false);
  assert.equal('intro' in profile, false);
  assert.equal(profile.youtube.handle, '@mahmudurrahman8104');
  assert.match(profile.youtube.channelId, /^UC[\w-]{22}$/);
});

test('storylens steps are objects with exactly one cache node', () => {
  const steps = json('caseStudies.json').find((c: any) => c.slug === 'storylens').architecture.steps;
  assert.ok(steps.length >= 3);
  assert.ok(steps.every((s: any) => typeof s === 'object' && s.id && s.label));
  assert.equal(steps.filter((s: any) => s.cacheNode).length, 1);
});

test('every project with a caseStudySlug points at a real case study', () => {
  const slugs = new Set(json('caseStudies.json').map((c: any) => c.slug));
  for (const p of json('projects.json')) {
    if (p.caseStudySlug) assert.ok(slugs.has(p.caseStudySlug), `${p.title} -> ${p.caseStudySlug}`);
  }
});

test('at least three projects have category "Product"', () => {
  assert.ok(json('projects.json').filter((p: any) => p.category === 'Product').length >= 3);
});

test('videos.json fallback exists and is an array', () => {
  assert.ok(Array.isArray(json('videos.json')));
});

test('Work opens with Storylens, then Banglapapers', () => {
  const work = json('projects.json').filter((p: any) => p.category !== 'Product').map((p: any) => p.title);
  assert.deepEqual(work.slice(0, 2), ['Storylens', 'Banglapapers']);
});

test('Banglapapers is described as a context engine across newspapers and social media', () => {
  const p = json('projects.json').find((x: any) => x.title === 'Banglapapers');
  const c = json('caseStudies.json').find((x: any) => x.slug === 'banglapapers');
  for (const text of [p.summary, c.oneLiner]) {
    assert.match(text, /context engine/i);
    assert.match(text, /newspapers/i);
    assert.match(text, /social media/i);
  }
});

test('certificates are listed AI first, then LangChain, then Docker', () => {
  assert.deepEqual(json('certifications.json').map((c: any) => c.credentialId), [
    '2LALOO-CE000961', // AI Evals For Everyone
    'dak2cdqi5wto', // Building with the Claude API
    'b68cc13e-f3bc-4830-9d9e-a59d7252b826', // RAG & MCP Fundamentals
    'atmkkzjsqm', // Introduction to LangChain
    '7a0dac43-c4d0-4e12-9a96-235a6dbeb63e', // Docker Training Course
  ]);
});
