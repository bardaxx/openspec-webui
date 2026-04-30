import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { mkdir, mkdtemp, rm, utimes, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { parseChangeByName, parseChanges } from './changes.js';

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true }))
  );
});

async function createChangeFixture(name: string) {
  const root = await mkdtemp(join(tmpdir(), 'openspec-webui-changes-'));
  tempDirs.push(root);

  const changePath = join(root, 'changes', name);
  await mkdir(changePath, { recursive: true });

  const proposalPath = join(changePath, 'proposal.md');
  const tasksPath = join(changePath, 'tasks.md');

  await writeFile(proposalPath, '## Why\n\nTest proposal\n');
  await writeFile(tasksPath, '- [x] completed task\n- [ ] pending task\n');

  return { root, changePath, proposalPath, tasksPath };
}

async function setFileMtime(path: string, iso: string) {
  const date = new Date(iso);
  await utimes(path, date, date);
}

test('parseChangeByName uses the newest root change file for lastModified', async () => {
  const fixture = await createChangeFixture('root-mtime-change');

  await setFileMtime(fixture.proposalPath, '2026-04-10T08:00:00.000Z');
  await setFileMtime(fixture.tasksPath, '2026-04-11T09:30:00.000Z');

  const result = await parseChangeByName(fixture.root, 'root-mtime-change');

  assert.equal(result.errors.length, 0);
  assert.equal(result.data?.lastModified, '2026-04-11T09:30:00.000Z');
});

test('parseChangeByName includes files under changes/<name>/specs in lastModified', async () => {
  const fixture = await createChangeFixture('spec-delta-mtime-change');
  const specDeltaDir = join(fixture.changePath, 'specs', 'explorer-pane');
  const specDeltaPath = join(specDeltaDir, 'spec.md');

  await mkdir(specDeltaDir, { recursive: true });
  await writeFile(specDeltaPath, '## MODIFIED Requirements\n\n### Requirement: Example\n');

  await setFileMtime(fixture.proposalPath, '2026-04-10T08:00:00.000Z');
  await setFileMtime(fixture.tasksPath, '2026-04-11T09:30:00.000Z');
  await setFileMtime(specDeltaPath, '2026-04-12T07:45:00.000Z');

  const result = await parseChangeByName(fixture.root, 'spec-delta-mtime-change');

  assert.equal(result.errors.length, 0);
  assert.equal(result.data?.specDeltas.length, 1);
  assert.equal(result.data?.lastModified, '2026-04-12T07:45:00.000Z');
});

test('parseChanges sorts archived changes by newest lastModified first', async () => {
  const root = await mkdtemp(join(tmpdir(), 'openspec-webui-archive-sort-'));
  tempDirs.push(root);

  const olderPath = join(root, 'changes', 'archive', '2026-04-10-older-change');
  const newerPath = join(root, 'changes', 'archive', '2026-04-10-newer-change');

  await mkdir(olderPath, { recursive: true });
  await mkdir(newerPath, { recursive: true });

  const olderTasksPath = join(olderPath, 'tasks.md');
  const newerTasksPath = join(newerPath, 'tasks.md');

  await writeFile(olderTasksPath, '- [x] done\n');
  await writeFile(newerTasksPath, '- [x] done\n');

  await setFileMtime(olderTasksPath, '2026-04-10T08:00:00.000Z');
  await setFileMtime(newerTasksPath, '2026-04-10T09:00:00.000Z');

  const result = await parseChanges(root);

  assert.equal(result.errors.length, 0);
  assert.deepEqual(result.data?.archived.map((change) => change.name), [
    '2026-04-10-newer-change',
    '2026-04-10-older-change',
  ]);
});
