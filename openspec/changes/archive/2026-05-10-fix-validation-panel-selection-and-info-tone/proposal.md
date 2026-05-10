## Why

The Validation Explorer currently has two UI regressions that make the panel harder to scan and trust:

- validation items with file-level `info` status render a muted/secondary row badge instead of an informational tone, even though the Validation header filter already uses the informational palette for `info`
- the Validation list does not mark the document already open in the Main Viewer as selected, even though other explorer-style lists do

Both issues break visual consistency with shared semantics and with the rest of the Explorer experience.

## What Changes

- add an informational badge tone that shared validation status/severity indicators can use in badge format
- update shared validation `info` mappings to use the informational badge tone instead of `secondary`
- make Validation Explorer rows derive their active state from the current Main Viewer tab path
- keep existing validation navigation, filters, and persistent panel behavior unchanged

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `explorer-pane`: Validation rows reflect the active Main Viewer tab selection.
- `shared-ui-parts`: shared validation badge surfaces can render `info` with a dedicated informational tone.

## Impact

- Affected frontend areas include `frontend/src/lib/components/shared/explorer-section/validation-explorer-section.svelte`, `frontend/src/lib/state/tabs.svelte.ts`, `frontend/src/lib/visualSemantics.ts`, and `frontend/src/lib/components/ui/badge/badge.svelte`.
- No backend or CLI behavior changes are expected.
- Regression coverage should verify both the `info` badge tone and active-row synchronization in the Validation panel.
