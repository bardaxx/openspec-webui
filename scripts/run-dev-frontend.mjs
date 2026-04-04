#!/usr/bin/env node

import { ensureLocalBins, resolveLocalBin, spawnInRepo, waitForExit } from './dev-utils.mjs';

ensureLocalBins(['vite']);

const child = spawnInRepo(resolveLocalBin('vite'), ['--config', 'frontend/vite.config.ts', ...process.argv.slice(2)]);
const result = await waitForExit(child, 'vite');
process.exit(result.code);
