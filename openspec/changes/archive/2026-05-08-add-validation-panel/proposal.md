## Why

Operators can run `openspec validate` in the terminal, but the WebUI currently gives no in-app way to see whether the active workspace's specs and changes are valid. Validation failures are cross-cutting: operators need an issue index that quickly shows which spec or change needs attention, then opens the existing document context for repair.

## What Changes

- Add a project-scoped validation API that runs `openspec validate --all --strict --json` for the active OpenSpec workspace and normalizes the result into UI-friendly status, counts, and per-item issues.
- Add validation state and typed frontend API access for manual validation runs, loading state, last-run metadata, and failure reporting.
- Add a Validate control to the Activity Bar and a dedicated Validation panel in the Explorer Pane.
- The Validation panel shows a summary, a Run Validate button, and a list of failed spec/change items.
- Selecting a failed validation item opens or focuses the existing spec/change tab in the Main Viewer; it does not introduce a standalone validation route or validation-only document view.
- Keep validation manual in V1; no file-watch-triggered auto-validation or polling is added.

## Capabilities

### New Capabilities
- `validation`: Project validation execution, result normalization, and cross-cutting validation issue navigation.

### Modified Capabilities
- `activity-bar`: Add a Validate icon that opens the Validation Explorer Pane panel.
- `explorer-pane`: Add a dedicated Validation panel alongside the existing Search panel pattern.

## Impact

- `src/server/routes/api.ts` — Add validation route using active project context and consistent error handling.
- `src/shared/types.ts` and `frontend/src/lib/types/api.ts` — Add validation result DTOs shared by server and client.
- `frontend/src/lib/api.ts` — Add typed validation request function.
- `frontend/src/lib/state/validation.svelte.ts` or equivalent state module — Store validation result, loading/error state, and last run metadata.
- `frontend/src/lib/state/layout.svelte.ts` — Add `validate` Activity/Explorer preset wiring.
- `frontend/src/lib/components/layout/ActivityBar.svelte` — Add Validate icon and optional failed-count badge.
- `frontend/src/lib/components/layout/ExplorerPane.svelte` and shared explorer-section components — Add Validation panel UI.
- Tests for server normalization, frontend state/API wiring, and Activity Bar/Explorer Pane behavior.
