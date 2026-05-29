import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('RoadmapViewer renders roadmap summary, slice panels, and search-driven slice scrolling', async () => {
  const source = await readFile(new URL('./RoadmapViewer.svelte', import.meta.url), 'utf8');

  assert.match(source, /project\.value\?\.roadmap/);
  assert.match(source, /matchLocation\?\.roadmapSliceId/);
  assert.match(source, /scrollIntoView\(\{ behavior: 'auto', block: 'center' \}\)/);
  assert.match(source, /FIXED_LABELS\.dashboard\.roadmapSummary/);
  assert.match(source, /FIXED_LABELS\.viewer\.roadmap\.recommendedOrder/);
  assert.match(source, /FIXED_LABELS\.viewer\.roadmap\.dependencies/);
  assert.match(source, /FIXED_LABELS\.viewer\.roadmap\.progressLog/);
  assert.match(source, /id=\{`roadmap-slice-\$\{slice\.id\}`\}/);
});
