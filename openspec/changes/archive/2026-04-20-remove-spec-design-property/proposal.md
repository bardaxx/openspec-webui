## Why

The WebUI treats `design.md` as an optional sibling of `spec.md` inside `specs/<capability>/` directories — with dedicated type fields (`Spec.designContent`, `SpecSummary.hasDesign`), parser logic, API properties, UI badges, sub-tabs, and dashboard labels. However, the OpenSpec workflow rules define `design.md` as a **change-level core artifact** only (`changes/<name>/design.md`). No main spec directory contains a `design.md` file. This architectural mismatch causes the Dashboard and UI to display misleading information ("Spec + Design" labels, Design badges) and propagates incorrect assumptions through translations and spec descriptions. The spec-as-design concept must be removed entirely to align the application with the actual OpenSpec data model.

## What Changes

- **BREAKING**: Remove `designContent` from the `Spec` type and `hasDesign` from `SpecSummary` / `ActivityItem` types (server + frontend)
- Remove `specs/<capability>/design.md` reading from the spec parser (`src/parser/specs.ts`)
- Remove spec design content from the search index (`src/parser/index.ts`)
- Remove spec `hasDesign` from API responses (`src/server/routes/api.ts`)
- Remove the Design sub-tab from `SpecViewer.svelte`
- Remove the Design badge from the specs explorer section
- Remove "Spec + Design" / "Spec only" labeling from the Dashboard
- Remove Design tab references from context-copy logic (`contextCopy.ts`)
- Remove design-related dashboard/search label helpers from `frontend/src/lib/uiText.ts`
- Update `spec-browsing`, `explorer-pane`, `search`, and `context-copy` specs to remove all design-as-spec-property requirements and scenarios

## Capabilities

### New Capabilities

_None_

### Modified Capabilities

- `spec-browsing`: Remove design document indication from catalog requirement; remove Design sub-tab from render requirement; simplify scenarios to single spec-only flow
- `explorer-pane`: Remove Design badge from SPECS section scenario
- `search`: Remove "spec design markdown" from searchable sources; remove spec design match scenario
- `context-copy`: Remove Design tab context menu scenario and Design tab label from quote copy

## Impact

- **Types**: `src/shared/types.ts`, `frontend/src/lib/types/api.ts` — field removal
- **Parser**: `src/parser/specs.ts` — remove design.md reading; `src/parser/index.ts` — remove design from search index
- **API**: `src/server/routes/api.ts` — remove `hasDesign` from spec summaries
- **UI**: `SpecViewer.svelte` — remove design tab; `specs-explorer-section.svelte` — remove Design badge; `Dashboard.svelte` — simplify spec labels; `contextCopy.ts` — remove design tab type; `SearchDialog.svelte` / `uiText.ts` — remove `(design)` suffix handling and design-related spec labels
- **Tests**: Update `commandShortcuts.test.ts` mock data and any design-related test cases
