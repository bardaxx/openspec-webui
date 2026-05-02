#!/usr/bin/env node
import { createRequire } from 'node:module';
import { Command } from 'commander';
import open from 'open';
import { createServer } from '../server/index.js';
import { createCliProgram } from './program.js';

const require = createRequire(import.meta.url);
const packageJson = require('../../package.json') as {
  name: string;
  description: string;
  version: string;
};

const program = createCliProgram(packageJson, {
  createServer,
  open,
});

await program.parseAsync();
