## Why

The dashboard currently presents Active Changes and Recent Activity in fixed date order, while the explorer panel already lets users switch between date and name sorting. Aligning these lists reduces context switching and makes it easier to find changes by either recency or name.

## What Changes

- Add date/name sorting controls to the dashboard Active Changes list.
- Add date/name sorting controls to the dashboard Recent Activity list so both dashboard change-oriented lists use the same default and interaction model.
- Keep date sorting as the default for both dashboard lists.
- Extract or reuse a shared sorting foundation so dashboard and explorer sorting behavior stay consistent.
- Do not introduce breaking API or data model changes.

## Capabilities

### New Capabilities
- `dashboard-change-sorting`: Dashboard Active Changes and Recent Activity sorting behavior.

### Modified Capabilities
- `explorer-pane`: Explorer panel sorting uses a shared sorting base with the dashboard while preserving existing behavior.

## Impact

- Affects dashboard UI and derived list ordering in `frontend/src/lib/views/Dashboard.svelte`.
- Affects explorer sorting helpers/control wiring in `frontend/src/lib/components/shared/explorer-section/` and `frontend/src/lib/components/layout/ExplorerPane.svelte` if shared foundations are extracted.
- No server API, persistence, or dependency changes expected.
