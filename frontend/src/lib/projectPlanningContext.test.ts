import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getPlanningContextNotice } from './projectPlanningContext';
import { FIXED_LABELS } from './uiText';

test('getPlanningContextNotice returns warning for migration-needed state', () => {
  assert.deepEqual(getPlanningContextNotice({ migrationState: 'migration-needed' }), {
    variant: 'warning',
    title: FIXED_LABELS.dashboard.migrationNeeded,
  });
});

test('getPlanningContextNotice returns info for legacy-present state', () => {
  assert.deepEqual(getPlanningContextNotice({ migrationState: 'legacy-present' }), {
    variant: 'info',
    title: FIXED_LABELS.dashboard.legacyDetected,
  });
});

test('getPlanningContextNotice returns null variant for config-only state', () => {
  assert.deepEqual(getPlanningContextNotice({ migrationState: 'config-only' }), {
    variant: null,
    title: '',
  });
});
