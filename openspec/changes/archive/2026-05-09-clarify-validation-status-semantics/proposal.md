## Why

Validation currently mixes item validity, file-level status, and issue severity in ways that make the UI inconsistent: Explorer lists only `failedItems`, while individual pages can show `Warning` for items that are not listed, and `INFO` issues are promoted to a warning-looking file status. The system needs explicit validation semantics before further UI refinements can be reliable.

## What Changes

- Define file-level validation status separately from issue-level severity.
- Introduce `info` as a file-level status distinct from `warning`.
- Distinguish invalid/failed items from issue-bearing items that still pass validation.
- Update validation result normalization so clients can render all attention-worthy items, not only invalid items.
- Update Explorer and inline validation displays to use the same file-level status derivation.
- Preserve validation execution behavior, strict/concurrency options, and tab navigation behavior.
- No breaking CLI behavior is expected; API response shape may be additively extended.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `validation`: Define validation file status vs issue severity, expose issue-bearing items, and align Explorer/inline status derivation.
- `shared-ui-parts`: Extend shared validation status semantics to include file-level `info` status.

## Impact

- Affected backend code: validation result normalization in `src/server/routes/api.ts` and shared validation types.
- Affected frontend code: validation API types, `validationCore.ts`, validation store consumers, `ValidationViewerStatus.svelte`, and Validation Explorer list rendering.
- Existing tests around validation summaries and API normalization will need updates for `info` status and issue-bearing items.
