import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  EMPTY_SELECTION_MESSAGE,
  buildCopySelectionResult,
  buildQuotedCopySelectionResult,
  getChangeViewerContextLabel,
  getSpecViewerContextLabel,
  validateSearchKeyword,
} from './contextCopy';
import { FIXED_LABELS } from './uiText';

test('buildQuotedCopySelectionResult formats single-line quoted text', () => {
  assert.deepEqual(
    buildQuotedCopySelectionResult({
      sourceName: 'add-context-menu-copy',
      contextLabel: 'Specification',
      selection: 'Selected line',
    }),
    {
      ok: true,
      text: '> [add-context-menu-copy] Specification\n> Selected line',
    },
  );
});

test('buildQuotedCopySelectionResult formats multiline quoted text', () => {
  assert.deepEqual(
    buildQuotedCopySelectionResult({
      sourceName: 'add-context-menu-copy',
      contextLabel: 'Specification',
      selection: 'Line one\nLine two',
    }),
    {
      ok: true,
      text: '> [add-context-menu-copy] Specification\n> Line one\n> Line two',
    },
  );
});

test('copy selection helpers report empty selection', () => {
  assert.deepEqual(buildCopySelectionResult(''), {
    ok: false,
    error: EMPTY_SELECTION_MESSAGE,
  });

  assert.deepEqual(
    buildQuotedCopySelectionResult({
      sourceName: 'add-context-menu-copy',
      contextLabel: 'Specification',
      selection: '',
    }),
    {
      ok: false,
      error: EMPTY_SELECTION_MESSAGE,
    },
  );
});

test('getChangeViewerContextLabel prefers spec delta capability', () => {
  assert.equal(
    getChangeViewerContextLabel({
      activeFileName: 'proposal.md',
      deltaCapability: 'context-copy',
    }),
    'context-copy',
  );
});

test('getChangeViewerContextLabel falls back to active file name', () => {
  assert.equal(getChangeViewerContextLabel({ activeFileName: 'design.md' }), 'design.md');
});

test('getSpecViewerContextLabel always returns the specification label', () => {
  assert.equal(getSpecViewerContextLabel(), FIXED_LABELS.viewer.specification);
});

// --- validateSearchKeyword ---

test('validateSearchKeyword accepts a valid keyword', () => {
  assert.deepEqual(validateSearchKeyword('hello world'), { valid: true, keyword: 'hello world' });
});

test('validateSearchKeyword accepts exactly 2 characters', () => {
  assert.deepEqual(validateSearchKeyword('ab'), { valid: true, keyword: 'ab' });
});

test('validateSearchKeyword accepts exactly 80 characters', () => {
  const keyword = 'a'.repeat(80);
  assert.deepEqual(validateSearchKeyword(keyword), { valid: true, keyword });
});

test('validateSearchKeyword rejects a single character', () => {
  assert.deepEqual(validateSearchKeyword('a'), { valid: false, keyword: 'a' });
});

test('validateSearchKeyword rejects empty string', () => {
  assert.deepEqual(validateSearchKeyword(''), { valid: false, keyword: '' });
});

test('validateSearchKeyword rejects 81 characters', () => {
  const keyword = 'a'.repeat(81);
  assert.deepEqual(validateSearchKeyword(keyword), { valid: false, keyword });
});

test('validateSearchKeyword rejects newline', () => {
  assert.deepEqual(validateSearchKeyword('hello\nworld'), { valid: false, keyword: 'hello\nworld' });
});

test('validateSearchKeyword rejects carriage return', () => {
  assert.deepEqual(validateSearchKeyword('hello\rworld'), { valid: false, keyword: 'hello\rworld' });
});

test('validateSearchKeyword rejects tab', () => {
  assert.deepEqual(validateSearchKeyword('hello\tworld'), { valid: false, keyword: 'hello\tworld' });
});

test('validateSearchKeyword trims outer whitespace before validation', () => {
  assert.deepEqual(validateSearchKeyword('  valid keyword  '), { valid: true, keyword: 'valid keyword' });
});

test('validateSearchKeyword rejects whitespace-only input (too short after trim)', () => {
  assert.deepEqual(validateSearchKeyword('   '), { valid: false, keyword: '' });
});

test('validateSearchKeyword rejects null', () => {
  assert.deepEqual(validateSearchKeyword(null), { valid: false, keyword: '' });
});

test('validateSearchKeyword rejects undefined', () => {
  assert.deepEqual(validateSearchKeyword(undefined), { valid: false, keyword: '' });
});
