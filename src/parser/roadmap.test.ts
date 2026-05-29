import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, test } from 'node:test';

import { parseRoadmap } from './roadmap.js';

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

async function createRoadmapFixture(content: string) {
  const root = await mkdtemp(join(tmpdir(), 'openspec-webui-roadmap-'));
  tempDirs.push(root);
  const openspecPath = join(root, 'openspec');
  await mkdir(openspecPath, { recursive: true });
  await writeFile(join(openspecPath, 'roadmap.md'), content, 'utf8');
  return openspecPath;
}

test('parseRoadmap returns normalized slice and dependency metadata', async () => {
  const openspecPath = await createRoadmapFixture(`# Roadmap

PRD: roadmap support

## Status Model

\`Ready -> Spec Proposed -> Applying -> Applied -> Archived\`

## Slices

### F01 - Register Roadmap
Status: \`Spec Proposed\`
Goal: Add roadmap visibility to the app.
Candidate OpenSpec change id: \`f01-register-roadmap\`
Spec link: \`openspec/changes/f01-register-roadmap/\`
Files:
- \`src/parser/index.ts\`
- \`frontend/src/lib/views/RoadmapViewer.svelte\`
Notes: Read-only viewer.
Progress:
- Proposed: 2026-05-29
- Applying: pending

## Dependencies

### F01
Depends on: none
Blocks: F02
Can run in parallel: no

## Recommended Execution Order

1. F01 - Register Roadmap

## Compacted history

- pending
`);

  const result = await parseRoadmap(openspecPath);

  assert.equal(result.errors.length, 0);
  assert.equal(result.data?.title, 'Roadmap');
  assert.equal(result.data?.prd, 'roadmap support');
  assert.equal(result.data?.statusModel, 'Ready -> Spec Proposed -> Applying -> Applied -> Archived');
  assert.deepEqual(result.data?.recommendedExecutionOrder, ['F01 - Register Roadmap']);
  assert.equal(result.data?.slices.length, 1);
  assert.deepEqual(result.data?.slices[0], {
    id: 'F01',
    title: 'Register Roadmap',
    status: 'Spec Proposed',
    goal: 'Add roadmap visibility to the app.',
    candidateChangeId: 'f01-register-roadmap',
    specLink: 'openspec/changes/f01-register-roadmap/',
    files: ['src/parser/index.ts', 'frontend/src/lib/views/RoadmapViewer.svelte'],
    notes: 'Read-only viewer.',
    progress: [
      { label: 'Proposed', value: '2026-05-29', pending: false },
      { label: 'Applying', value: 'pending', pending: true },
    ],
    dependency: {
      sliceId: 'F01',
      dependsOn: [],
      blocks: ['F02'],
      canRunInParallel: false,
    },
  });
});

test('parseRoadmap returns null when roadmap.md is absent', async () => {
  const root = await mkdtemp(join(tmpdir(), 'openspec-webui-roadmap-missing-'));
  tempDirs.push(root);
  const openspecPath = join(root, 'openspec');
  await mkdir(openspecPath, { recursive: true });

  const result = await parseRoadmap(openspecPath);

  assert.equal(result.data, null);
  assert.equal(result.errors.length, 0);
});
