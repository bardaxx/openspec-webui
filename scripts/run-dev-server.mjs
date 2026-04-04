#!/usr/bin/env node

import {
  ensureLocalBins,
  spawnInRepo,
  waitForExit,
  withDefaultProjectPath,
} from './dev-utils.mjs';

ensureLocalBins(['tsx']);

const serverArgs = withDefaultProjectPath(process.argv.slice(2));
const child = spawnInRepo(process.execPath, ['--watch', '--import', 'tsx', 'src/cli/index.ts', ...serverArgs]);
const result = await waitForExit(child, 'node');
process.exit(result.code);
