## Why

The Search Explorer currently has two gaps that make it feel less intentional than the Validation panel:

- when a search has no results, the list body is blank and all guidance lives in the sticky header instead of a visible placeholder in the content area
- the backend search only matches document body text, so spec/change/project names and source paths are not reliably searchable unless the same term also appears inside the markdown content

This makes empty states harder to understand and makes filename-oriented lookup feel unreliable.

## What Changes

- move Search panel explanatory copy for initial, short-query, and no-results states into body placeholders instead of a persistent header description
- keep the Search header compact by removing the always-visible descriptive paragraph while preserving sticky search controls
- extend workspace search so project/spec/change results can match source metadata such as document names and paths in addition to markdown body content
- preserve existing debounce, clear, archived-vs-active change rendering, and result-navigation behavior

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `explorer-pane`: the Search panel uses Validation-style body placeholders for empty states and no longer relies on header prose for explanation
- `search`: search can match supported document metadata (names/paths) as well as supported markdown content sources

## Impact

- Affected frontend areas include `frontend/src/lib/components/shared/explorer-section/search-explorer-section.svelte`, search i18n messages, and Search panel regression coverage.
- Affected search logic includes `src/parser/index.ts` and the shared/internal search result contract used by the frontend API.
- No database or CLI workflow changes are expected.
