import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('RoadmapViewer renders roadmap summary, slice panels, and search-driven slice scrolling', async () => {
  const source = await readFile(new URL('./RoadmapViewer.svelte', import.meta.url), 'utf8');

  assert.match(source, /project\.value\?\.roadmap/);
  assert.match(source, /matchLocation\?\.roadmapSliceId/);
  assert.match(source, /scrollIntoView\(\{ behavior: 'auto', block: 'center' \}\)/);
  assert.match(source, /FIXED_LABELS\.viewer\.roadmap\.pipeline/);
  assert.match(source, /roadmapOverviewItems/);
  assert.match(source, /InteractiveCard/);
  assert.match(source, /focusSlice/);
  assert.match(source, /FIXED_LABELS\.viewer\.roadmap\.dependencies/);
  assert.match(source, /FIXED_LABELS\.viewer\.roadmap\.progressLog/);
  assert.match(source, /id=\{`roadmap-slice-\$\{slice\.id\}`\}/);
  assert.match(source, /min-w-0/);
  assert.match(source, /truncate/);
  assert.match(source, /break-words/);
  assert.match(source, /progressVariant/);
});
