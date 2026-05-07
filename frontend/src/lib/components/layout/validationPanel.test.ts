import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('layout state includes validate preset and section wiring', async () => {
  const source = await readFile(new URL('../../state/layout.svelte.ts', import.meta.url), 'utf8');

  assert.match(source, /ActivityPreset = 'home' \| 'archive' \| 'specs' \| 'search' \| 'validate'/);
  assert.match(source, /ExplorerSection = 'active-changes' \| 'archive' \| 'specs' \| 'search' \| 'validate'/);
  assert.match(source, /validate: 'validate'/);
});

test('ActivityBar includes a validate control with icon, tooltip, badge, and handler', async () => {
  const source = await readFile(new URL('./ActivityBar.svelte', import.meta.url), 'utf8');

  assert.match(source, /FlaskConical/);
  assert.match(source, /onclick=\{openValidate\}/);
  assert.match(source, /t\(m\.validation_activity_label\)/);
  assert.match(source, /validationStore\.failedCount > 0/);
  assert.match(source, /absolute bottom-1 right-1/);
});

test('ExplorerPane renders ValidationExplorerSection when validate preset is active', async () => {
  const source = await readFile(new URL('./ExplorerPane.svelte', import.meta.url), 'utf8');

  assert.match(source, /ValidationExplorerSection/);
  assert.match(source, /layoutStore\.activityPreset === 'validate'/);
});

test('validation panel wiring keeps navigation in existing tabs and shows non-navigable items safely', async () => {
  const source = await readFile(new URL('../shared/explorer-section/validation-explorer-section.svelte', import.meta.url), 'utf8');
  const storeSource = await readFile(new URL('../../state/validation.svelte.ts', import.meta.url), 'utf8');

  assert.match(source, /ItemContextMenu/);
  assert.match(source, /validationStore\.openItem/);
  assert.match(source, /copyToClipboard\(item\.name, t\(m\.copy_label_validation_item_name\)\)/);
  assert.match(source, /searchStore\.open\(item\.name\)/);
  assert.match(source, /t\(m\.validation_non_navigable\)/);
  assert.match(source, /t\(m\.validation_run\)/);
  assert.match(storeSource, /tabStore\.openConfirmed/);
  assert.match(storeSource, /tabStore\.openPreview/);
  assert.match(storeSource, /item\.type !== 'spec' && item\.type !== 'change'/);
});

test('validation panel text is localized through Paraglide messages', async () => {
  const source = await readFile(new URL('../shared/explorer-section/validation-explorer-section.svelte', import.meta.url), 'utf8');
  const messages = await readFile(new URL('../../../../messages/ja.json', import.meta.url), 'utf8');

  assert.match(source, /t\(m\.validation_panel_title\)/);
  assert.match(source, /t\(m\.validation_panel_description\)/);
  assert.match(source, /t\(m\.validation_summary_counts/);
  assert.match(messages, /"validation_panel_title"/);
  assert.match(messages, /"copy_label_validation_item_name"/);
});

test('validation store getters do not mutate state during render', async () => {
  const source = await readFile(new URL('../../state/validation.svelte.ts', import.meta.url), 'utf8');
  const gettersBlock = source.slice(source.indexOf('export const validationStore = {'), source.indexOf('  reset(projectId?: string | null)'));

  assert.doesNotMatch(gettersBlock, /controller\.syncProject\(\)/);
});
