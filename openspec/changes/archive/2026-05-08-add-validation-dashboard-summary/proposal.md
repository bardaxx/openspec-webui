## Why

After validation exists as a dedicated panel, the Dashboard should provide a lightweight project-health glance so operators can notice validation problems without first opening the Validate Activity Bar panel. This keeps the Dashboard as a status surface while preserving the Validation panel as the detailed issue index.

## What Changes

- Add a Validation summary card to the Dashboard top summary card row.
- Show the latest validation status, failed-item count, passed/unknown/stale state, and last-run hint when available.
- Clicking the card opens the Validation panel in the Explorer Pane rather than opening a new Main Viewer route.
- Reuse the validation state/result introduced by V1; do not run validation automatically from the Dashboard in this change.

## Capabilities

### New Capabilities
- `validation-dashboard-summary`: Dashboard validation health card and navigation into the Validation panel.

### Modified Capabilities
- None.

## Impact

- `frontend/src/lib/views/Dashboard.svelte` — Add Validation card to summary grid and wire click behavior to the Validate Explorer preset.
- `frontend/src/lib/state/validation.svelte.ts` or final V1 validation state module — Read latest result and derive Dashboard summary values.
- `frontend/src/lib/state/layout.svelte.ts` — Reuse `validate` preset from V1 for card navigation.
- Tests for Dashboard card rendering, status states, counts, and click navigation.
