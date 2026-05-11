import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('ChangeViewer selection context menus expose Search and snapshot validated selections', async () => {
  const source = await readFile(new URL('./ChangeViewer.svelte', import.meta.url), 'utf8');

  assert.match(source, /import \{[\s\S]*validateSearchKeyword,[\s\S]*\} from '\$lib\/contextCopy';/);
  assert.match(source, /let snapshotSelection = \$state\(''\);/);
  assert.match(source, /snapshotSelection = window\.getSelection\(\)\?\.toString\(\) \?\? '';/);
  assert.match(source, /let canSearch = \$derived\(validateSearchKeyword\(snapshotSelection\)\.valid\);/);
  assert.match(source, /const \{ valid, keyword \} = validateSearchKeyword\(snapshotSelection\);/);
  assert.match(source, /if \(valid\) \{\s*searchStore\.open\(keyword\);\s*\}/);
  assert.match(source, /getChangeViewerContextLabel\(\{ deltaCapability: delta\.capability \}\)/);
  assert.match(source, /getChangeViewerContextLabel\(\{ activeFileName: activeFile\?\.name \}\)/);

  assert.match(source, /\{t\(m\.common_search\)\}/);
  const searchMenuItems = source.match(/<ContextMenu\.Item disabled=\{!canSearch\} onSelect=\{handleSearchFromSelection\}>[\s\S]*?\{t\(m\.common_search\)\}[\s\S]*?<\/ContextMenu\.Item>/g);
  assert.equal(searchMenuItems?.length, 2);
});

test('SpecViewer selection context menu exposes Search and routes valid keywords through Explorer search', async () => {
  const source = await readFile(new URL('./SpecViewer.svelte', import.meta.url), 'utf8');

  assert.match(source, /import \{[\s\S]*validateSearchKeyword,[\s\S]*\} from '\$lib\/contextCopy';/);
  assert.match(source, /let snapshotSelection = \$state\(''\);/);
  assert.match(source, /snapshotSelection = window\.getSelection\(\)\?\.toString\(\) \?\? '';/);
  assert.match(source, /let canSearch = \$derived\(validateSearchKeyword\(snapshotSelection\)\.valid\);/);
  assert.match(source, /const \{ valid, keyword \} = validateSearchKeyword\(snapshotSelection\);/);
  assert.match(source, /if \(valid\) \{\s*searchStore\.open\(keyword\);\s*\}/);
  assert.match(source, /<ContextMenu\.Item disabled=\{!canSearch\} onSelect=\{handleSearchFromSelection\}>[\s\S]*?\{t\(m\.common_search\)\}[\s\S]*?<\/ContextMenu\.Item>/);
});
