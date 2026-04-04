#!/usr/bin/env node

import {
  ensureLocalBins,
  resolveLocalBin,
  spawnInRepo,
  waitForExit,
  withDefaultProjectPath,
} from './dev-utils.mjs';

ensureLocalBins(['tsc', 'vite']);

const runtimeArgs = withDefaultProjectPath(process.argv.slice(2));

console.log('Building release assets...');

for (const [label, command, args] of [
  ['tsc', resolveLocalBin('tsc'), []],
  ['vite build', resolveLocalBin('vite'), ['build', '--config', 'frontend/vite.config.ts']],
]) {
  const child = spawnInRepo(command, args);
  const result = await waitForExit(child, label);
  if (result.code !== 0) {
    process.exit(result.code);
  }
}

console.log('Starting release build...');
const child = spawnInRepo(process.execPath, ['dist/cli/index.js', ...runtimeArgs]);
const result = await waitForExit(child, 'node');
process.exit(result.code);
