import assert from 'node:assert/strict';
import test from 'node:test';

import { collectServerArgs, resolveDevHost, resolveDevPort } from './dev-args.mjs';

test('dev args preserve host and port overrides for the server', () => {
  assert.deepEqual(
    collectServerArgs(['--host', '0.0.0.0', '--port', '4444', '--no-open']),
    ['--host', '0.0.0.0', '--port', '4444', '--no-open']
  );
  assert.deepEqual(
    collectServerArgs(['--host=192.168.100.17', '--port=3002']),
    ['--host=192.168.100.17', '--port=3002']
  );
});

test('dev args resolve defaults and explicit host/port values', () => {
  assert.equal(resolveDevHost([]), '127.0.0.1');
  assert.equal(resolveDevHost(['--host', '0.0.0.0']), '0.0.0.0');
  assert.equal(resolveDevHost(['--host=192.168.100.17']), '192.168.100.17');

  assert.equal(resolveDevPort([]), '3001');
  assert.equal(resolveDevPort(['--port', '4444']), '4444');
  assert.equal(resolveDevPort(['--port=3002']), '3002');
});
