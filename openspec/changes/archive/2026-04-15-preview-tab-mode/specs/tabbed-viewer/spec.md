## ADDED Requirements

### Requirement: Preview tab mode
The system SHALL support a preview tab mode in which single-clicking an item in the Explorer Pane opens the content in a reusable preview tab instead of creating a new tab each time. A tab SHALL have an optional `preview` boolean property. When `preview` is `true`, the tab is considered a preview tab. Preview tabs SHALL be visually distinguished from confirmed tabs using italic text style in the TabBar. The system SHALL provide an `openPreview(path)` method on the tab store with the following behavior: (1) If a confirmed tab (non-preview) with the same path already exists, the system SHALL focus that tab without creating a new one. (2) If a preview tab already exists and is not pinned, the system SHALL replace that preview tab's content (id, type, name, path) with the new path's content. (3) If neither condition applies, the system SHALL create a new tab with `preview: true`. Pinned tabs SHALL NOT be replaced by preview tab reuse logic — the system SHALL skip pinned tabs when searching for a reusable preview slot. The preview-tab mode SHALL be operator-configurable from Settings and SHALL default to enabled.

#### Scenario: Single click opens preview tab
- **WHEN** the operator single-clicks a spec item in the Explorer Pane
- **THEN** a new tab is opened with `preview: true`
- **AND** the tab name is displayed in italic style in the TabBar

#### Scenario: Preview tab reuse on subsequent single click
- **WHEN** a preview tab exists (e.g., showing "spec-a")
- **AND** the operator single-clicks a different item (e.g., "spec-b")
- **THEN** the existing preview tab's content is replaced to show "spec-b"
- **AND** no additional tab is created

#### Scenario: Single click on already-open confirmed tab focuses it
- **WHEN** a confirmed tab for "spec-a" exists (preview is false or undefined)
- **AND** the operator single-clicks "spec-a" in the Explorer Pane
- **THEN** the existing confirmed tab is focused
- **AND** no new tab or preview tab is created

#### Scenario: Pinned tab is not replaced by preview
- **WHEN** the only non-active tab is a pinned tab
- **AND** the operator single-clicks a spec item in the Explorer Pane
- **THEN** a new preview tab is created
- **AND** the pinned tab remains unchanged

#### Scenario: Dashboard Home tab is never overwritten by preview
- **WHEN** the operator single-clicks an item in the Explorer Pane
- **THEN** the Home (Dashboard) tab is not affected
- **AND** it remains pinned and unchanged

#### Scenario: Preview tab becomes confirmed on pin
- **WHEN** the operator pins a preview tab via context menu
- **THEN** the tab's `preview` property is set to `false`
- **AND** the tab is treated as a confirmed (pinned) tab

#### Scenario: Preview tab becomes confirmed on TabBar double-click
- **WHEN** the operator double-clicks a preview tab in the TabBar
- **THEN** the tab's `preview` property is set to `false`
- **AND** the tab name returns to normal (non-italic) style

#### Scenario: Disabling preview mode confirms existing preview tabs
- **WHEN** preview-tab mode is turned off in Settings
- **THEN** any existing preview tabs are converted to confirmed tabs
- **AND** their tab names return to normal (non-italic) style

### Requirement: Explorer confirmed-tab actions
When preview-tab mode is enabled, the system SHALL provide non-delayed actions for opening Explorer items as confirmed tabs (non-preview). Ctrl+Click or Cmd+Click on an item SHALL execute the confirmed-tab flow. The item context menu SHALL provide an "Open in New Tab" action that executes the same confirmed-tab flow. If a preview tab for the same path already exists, the confirmed-tab flow SHALL convert that tab into a confirmed tab by setting `preview` to `false`. Otherwise, the confirmed-tab flow SHALL use the same behavior as the existing `open()` method (focus an existing confirmed tab with the same path or create a new confirmed tab).

#### Scenario: Ctrl+Click or Cmd+Click opens confirmed tab
- **WHEN** the operator Ctrl+Clicks or Cmd+Clicks a change item in the Explorer Pane
- **THEN** a tab is opened with `preview: false`
- **AND** the tab name is displayed in normal (non-italic) style

#### Scenario: Ctrl+Click or Cmd+Click confirms an existing preview tab
- **WHEN** a preview tab for "spec-a" exists
- **AND** the operator Ctrl+Clicks or Cmd+Clicks "spec-a" in the Explorer Pane
- **THEN** the preview tab is converted to a confirmed tab (`preview: false`)
- **AND** the tab name changes from italic to normal style

#### Scenario: Explorer context menu opens confirmed tab
- **WHEN** the operator opens an item context menu in the Explorer Pane
- **AND** selects "Open in New Tab"
- **THEN** the confirmed-tab flow is executed for that item's path
- **AND** the opened tab is not marked as preview

#### Scenario: Reused preview tab remains active
- **WHEN** a preview tab exists
- **AND** the operator single-clicks a different item in the Explorer Pane
- **THEN** the existing preview tab is reused for the new item
- **AND** that reused preview tab remains the active tab

### Requirement: Explorer Pane click behavior
The Explorer Pane SHALL open preview content immediately on item single-click when preview-tab mode is enabled. No delay or double-click discrimination SHALL be required for preview opening. When preview-tab mode is disabled, item single-click SHALL open the item as a confirmed tab. Non-item interactions (e.g., section toggle, project selector) SHALL remain unaffected.

#### Scenario: Single-click triggers preview immediately
- **WHEN** the operator clicks an Explorer Pane item once
- **THEN** `openPreview()` is called for that item's path

#### Scenario: Single-click opens confirmed tab when preview mode is disabled
- **WHEN** preview-tab mode is disabled in Settings
- **AND** the operator clicks an Explorer Pane item once
- **THEN** the system opens that item as a confirmed tab
- **AND** no preview tab is created

### Requirement: Preview tab visual distinction
The TabBar SHALL render preview tabs with italic font style (`italic`) to visually distinguish them from confirmed tabs. Confirmed tabs SHALL use normal font style. The tab's tooltip or aria-label SHALL indicate "Preview" for preview tabs.

#### Scenario: Preview tab displayed in italic
- **WHEN** a tab with `preview: true` is rendered in the TabBar
- **THEN** the tab name is displayed in italic style
- **AND** the tab has an aria-label or tooltip indicating "Preview"

#### Scenario: Confirmed tab displayed in normal style
- **WHEN** a tab with `preview: false` or `preview: undefined` is rendered
- **THEN** the tab name is displayed in normal (non-italic) style

## MODIFIED Requirements

### Requirement: Tab management system
The system SHALL provide a tab management store that maintains an ordered list of open tabs. Each tab SHALL have a unique ID, type (spec, change, or dashboard), display name, URL path, optional pinned state, and optional preview state. The store SHALL support operations: open tab, close tab, focus tab, reorder tabs, pin/unpin tab, and open preview tab. The Dashboard tab SHALL be pinned by default, SHALL always be present, and SHALL NOT be closable or unpinnable. The tab store SHALL materialize tabs for the Dashboard route (`/`) and detail routes such as `/specs/<name>` and `/changes/<name>`. The system SHALL NOT create standalone list tabs for `/specs` or `/changes`; section browsing for Specs and Archive SHALL be handled by the Explorer Pane while the Main Viewer remains on the Dashboard or detail tabs. The ChangeViewer and SpecViewer SHALL use the `UnderlineTabs` component from `$lib/components/ui/underline-tabs/` for their internal sub-tab navigation instead of inline underline tab implementations. The `UnderlineTabs` API SHALL support optional badge counts so ChangeViewer can render file group counts and spec delta counts without feature-specific badge markup. The MainViewer SHALL NOT contain any suggestion panel or suggestion mode sidebar logic. The ChangeViewer SHALL use the project's ContextMenu component to provide a right-click context menu on the markdown content area, enabling text copy and quoted copy operations with change and file context. The store SHALL provide an `openPreview(path)` method that reuses an existing non-pinned preview tab or creates a new preview tab. When a preview tab is pinned or double-clicked in the TabBar, its `preview` property SHALL be set to `false`.

#### Scenario: MainViewer renders content without suggestion panel
- **WHEN** the operator views any tab content
- **THEN** the Main Viewer renders only the content area with tab bar
- **AND** no suggestion panel sidebar or suggestion sheet overlay is present

#### Scenario: ChangeViewer provides context menu on markdown content
- **WHEN** the operator views a change tab and right-clicks on the markdown content area
- **THEN** a context menu appears with copy-related actions
- **AND** the menu uses the ContextMenu component from `$lib/components/ui/context-menu/`

#### Scenario: openPreview reuses existing preview tab
- **WHEN** a preview tab showing "spec-a" exists
- **AND** the store's `openPreview("/specs/spec-b")` is called
- **THEN** the preview tab's content is updated to show "spec-b"
- **AND** no additional tab is created

#### Scenario: openPreview creates new preview tab when none exists
- **WHEN** no preview tab exists
- **AND** the store's `openPreview("/specs/spec-a")` is called
- **THEN** a new tab is created with `preview: true`
- **AND** the new tab becomes active
