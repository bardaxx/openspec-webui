## 1. Server Validation API

- [x] 1.1 Add shared validation DTOs for overall status, counts, item summaries, issue messages, timestamps, and command/API error context
- [x] 1.2 Add a project-scoped validation route in `src/server/routes/api.ts` that resolves the active project and runs `openspec validate --all --strict --json` in that project root
- [x] 1.3 Normalize passing CLI output into a `passed` validation result with zero failed items
- [x] 1.4 Normalize validation CLI failures into a `failed` validation result without treating them as HTTP 500 transport failures
- [x] 1.5 Preserve true execution failures through the existing structured API error path
- [x] 1.6 Add unit tests for pass, validation-fail, malformed-output, and execution-fail normalization paths

## 2. Frontend API and State

- [x] 2.1 Add frontend validation response types mirroring the shared DTO contract
- [x] 2.2 Add a typed validation API function in `frontend/src/lib/api.ts`
- [x] 2.3 Create validation state for latest result, loading, error, last run timestamp, and active project isolation
- [x] 2.4 Add stale-response protection so older validation requests cannot overwrite newer results
- [x] 2.5 Add tests for validation state loading, success, failure, API error, project change, and stale response behavior

## 3. Activity Bar and Explorer Preset Wiring

- [x] 3.1 Extend `ActivityPreset` and `ExplorerSection` with `validate`
- [x] 3.2 Update preset/section maps and Activity Bar controller behavior for the Validate preset
- [x] 3.3 Add a Validate icon button to `ActivityBar.svelte` with tooltip and active highlighting
- [x] 3.4 Optionally render a compact failed-count badge on the Validate icon when the latest result has failures
- [x] 3.5 Add tests covering Validate icon click, active highlighting, and explorer toggle behavior

## 4. Validation Explorer Panel UI

- [x] 4.1 Create a `ValidationExplorerSection` component following the Search panel / Explorer visual language
- [x] 4.2 Render initial, loading, pass, fail, and API error states
- [x] 4.3 Add the Run Validate action and wire it to validation state
- [x] 4.4 Render failed validation items with type, name, severity, issue count, and short message/excerpt when available
- [x] 4.5 Wire navigable validation items to open/focus existing spec and change tabs while preserving the Validation panel
- [x] 4.6 Handle unclassified/non-navigable validation items without creating invalid tabs

## 5. Verification

- [x] 5.1 Run frontend and server unit tests for validation behavior
- [x] 5.2 Run `npm test`
- [x] 5.3 Run `npm run typecheck`
- [x] 5.4 Run `openspec validate add-validation-panel --strict`
- [x] 5.5 Manually verify that clicking Validate opens the panel, Run Validate displays current failures, and selecting spec/change failures opens existing tabs
