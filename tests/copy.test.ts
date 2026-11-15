import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findBanned } from '../src/utils/copy.ts';

test('flags each banned phrase, case-insensitively', () => {
  assert.deepEqual(findBanned('An AI Engineer with 5 years of experience'), ['AI engineer', 'years of experience']);
  assert.deepEqual(findBanned('AI-native builder, ~4 years owning systems'), ['AI-Native', 'years owning']);
});

test('clean copy returns empty', () => {
  assert.deepEqual(findBanned('How one article becomes visuals, summaries and polls'), []);
});
