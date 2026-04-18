import assert from 'node:assert/strict';
import test from 'node:test';
import { join } from 'node:path';

import { repoRoot, resolveLocalBin, withFlag } from './dev-utils.mjs';

test('withFlag adds a missing flag only once', () => {
  assert.deepEqual(withFlag(['--port', '4444'], '--no-open'), ['--port', '4444', '--no-open']);
  assert.deepEqual(withFlag(['--no-open'], '--no-open'), ['--no-open']);
});

test('resolveLocalBin points to repo-local node_modules binaries', () => {
  const expectedSuffix = process.platform === 'win32' ? 'vite.cmd' : 'vite';
  assert.equal(resolveLocalBin('vite'), join(repoRoot, 'node_modules', '.bin', expectedSuffix));
});
