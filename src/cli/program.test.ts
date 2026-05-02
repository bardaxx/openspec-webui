import assert from 'node:assert/strict';
import test from 'node:test';

import { createCliProgram } from './program.js';

test('CLI defaults to localhost binding and normalizes the browser URL', async () => {
  const createServerCalls: Array<{ port: number; host: string }> = [];
  const openedUrls: string[] = [];

  const program = createCliProgram(
    {
      name: 'openspec-webui',
      description: 'Local-first browser UI for exploring OpenSpec projects',
      version: '0.1.1',
    },
    {
      createServer: async (options) => {
        createServerCalls.push(options);
        return {
          url: `http://${options.host}:${options.port}`,
          close: async () => {},
        };
      },
      open: async (url) => {
        openedUrls.push(url);
        return undefined;
      },
    }
  );

  await program.parseAsync([], { from: 'user' });

  assert.deepEqual(createServerCalls, [{ port: 3001, host: '127.0.0.1' }]);
  assert.deepEqual(openedUrls, ['http://127.0.0.1:3001']);
});

test('CLI accepts a host override and rewrites 0.0.0.0 browser URLs to localhost', async () => {
  const createServerCalls: Array<{ port: number; host: string }> = [];
  const openedUrls: string[] = [];

  const program = createCliProgram(
    {
      name: 'openspec-webui',
      description: 'Local-first browser UI for exploring OpenSpec projects',
      version: '0.1.1',
    },
    {
      createServer: async (options) => {
        createServerCalls.push(options);
        return {
          url: `http://${options.host}:${options.port}`,
          close: async () => {},
        };
      },
      open: async (url) => {
        openedUrls.push(url);
        return undefined;
      },
    }
  );

  await program.parseAsync(['--host', '0.0.0.0'], { from: 'user' });

  assert.deepEqual(createServerCalls, [{ port: 3001, host: '0.0.0.0' }]);
  assert.deepEqual(openedUrls, ['http://localhost:3001']);
});
