## Context

OpenSpec validation returns items with a `valid` boolean and zero or more issues. Issues have severity levels `ERROR`, `WARNING`, and `INFO`. The current WebUI normalizes `failedItems` as `items.filter(item => !item.valid)`, so valid items with `WARNING` or `INFO` issues are omitted from the Explorer list. Meanwhile `ValidationViewerStatus` derives status from all `items`, and currently treats both `WARNING` and `INFO` issues as `warning` file status.

This creates three different layers without clear boundaries:

- Result status: whether the whole validation run passed or failed.
- File/item status: whether a specific spec/change/project is failed, warning, info, passed, stale, not-run, or unknown.
- Issue severity: whether a specific issue is `ERROR`, `WARNING`, or `INFO`.

## Goals / Non-Goals

**Goals:**

- Make the three validation layers explicit and testable.
- Ensure Explorer and individual page validation surfaces derive the same file-level status for the same item.
- Show issue-bearing valid items in the Explorer Validation list so `WARNING`/`INFO` items do not disappear.
- Keep issue severity labels available in issue details without using them as file-level status labels.

**Non-Goals:**

- Redesign the Validation Explorer header; that is handled by `redesign-validation-explorer-header`.
- Add filtering controls for validation issues.
- Change how the OpenSpec CLI emits validation JSON.
- Change validation execution preferences or settings UI.

## Decisions

### Decision 1: File status is derived from validity and highest issue severity

Define file-level status as:

- `failed`: item is invalid (`valid === false`) or has an `ERROR` issue.
- `warning`: item is valid, has no `ERROR` issue, and has at least one `WARNING` issue.
- `info`: item is valid, has no `ERROR`/`WARNING` issue, and has at least one `INFO` issue.
- `passed`: item is valid and has no issues.
- `stale`: latest validation result does not contain the current target.
- `not-run`: no validation result exists.
- `unknown`: validation state cannot be determined because execution failed or state is inconsistent.

Rationale: `Failed`/`Warning`/`Info` describe the file target. `ERROR`/`WARNING`/`INFO` describe individual issues.

### Decision 2: API exposes issue-bearing items separately from failed items

Keep `failedItems` for invalid/failed items and add `issueItems` (or equivalent) for all items with one or more issues. `issueItems` includes invalid items and valid items with warning/info issues. Summary data should include enough counts to render failed, warning, info, and issue totals without recomputing at every call site.

Rationale: the UI needs an attention list, not just invalid items. Keeping `failedItems` preserves the existing concept while avoiding semantic overload.

### Decision 3: Validation Explorer list renders non-passed items

The Explorer Validation list should render file targets whose derived file status is `failed`, `warning`, or `info`. It should not render `passed` items in the list by default.

Rationale: this matches the operator's need to see all items that require attention or review while preserving sidebar space.

### Decision 4: Issue severity remains visible only where issue details are shown

Explorer rows and inline status summaries should use file-level status. Issue detail rows should use issue-level severity.

Rationale: this prevents confusing pairs like a row saying `Warning` while its detail says `Info` for the only issue.

## Risks / Trade-offs

- [Risk] Additive API fields may be missed by existing consumers. → Mitigation: keep existing `failedItems` and add new fields rather than replacing in one step.
- [Risk] `valid === false` with only `WARNING`/`INFO` issues is possible if CLI semantics change. → Mitigation: file status treats invalid items as `failed` regardless of issue severity.
- [Risk] More Explorer list items could increase visual noise. → Mitigation: render only non-passed items and defer filters to a future change.
