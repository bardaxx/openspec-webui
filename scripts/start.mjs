#!/usr/bin/env node

import { existsSync } from 'fs';
import { join } from 'path';
import { repoRoot, spawnInRepo, waitForExit, withDefaultProjectPath } from './dev-utils.mjs';

const builtServerEntry = join(repoRoot, 'dist', 'cli', 'index.js');
const builtFrontendDir = join(repoRoot, 'dist-frontend');

if (!existsSync(builtServerEntry) || !existsSync(builtFrontendDir)) {
  console.error('Build output is missing. Run `npm run build` before `npm start`.');
  process.exit(1);
}

const runtimeArgs = withDefaultProjectPath(process.argv.slice(2));
const child = spawnInRepo(process.execPath, ['dist/cli/index.js', ...runtimeArgs]);
const result = await waitForExit(child, 'node');
process.exit(result.code);
