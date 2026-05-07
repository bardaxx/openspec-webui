## Why

Settings is currently a modal overlay that blocks interaction with the rest of the UI. Making it a main tab enables the settings page to use a left-menu + scrollable-section layout that is more extensible (easy to add new sections), more responsive-friendly (handles narrow widths naturally), and consistent with the existing tab-based navigation model.

## What Changes

- Add `settings` as a new `TabType` alongside `dashboard`, `spec`, and `change`
- Extract the settings content from `SettingsModal.svelte` into a standalone `SettingsView.svelte` component with a left section menu and right scrollable single-page layout
- Section menu buttons scroll to the corresponding section in the right panel
- Add `/settings` route handling in `MainViewer.svelte`
- Add settings tab icon in `TabBar.svelte`
- Change Activity Bar Settings button to open a settings tab instead of a modal overlay
- Remove settings from the overlay system (`LayoutOverlay`)

## Capabilities

### New Capabilities
- `settings-view`: Left-menu + scrollable-section settings page component rendered as a main tab

### Modified Capabilities
- `tabbed-viewer`: Extend tab type system and routing to support `settings` tabs
- `activity-bar`: Change Settings icon behavior from overlay toggle to tab navigation

## Impact

- `frontend/src/lib/state/tabs.svelte.ts` — TabType union, createTabForPath, tab icon mapping
- `frontend/src/lib/components/layout/SettingsModal.svelte` — Refactor into SettingsView component
- `frontend/src/lib/components/layout/MainViewer.svelte` — Add /settings route
- `frontend/src/lib/components/layout/TabBar.svelte` — Add settings tab icon
- `frontend/src/lib/components/layout/ActivityBar.svelte` — Change settings button behavior
- `frontend/src/lib/state/layout.svelte.ts` — Remove settings from LayoutOverlay
- `frontend/src/lib/components/layout/AppLayout.svelte` — Remove SettingsModal from overlays
