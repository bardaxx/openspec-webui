# explorer-item Specification

## Purpose
Define the ExplorerItem component that wraps a list item with context menu support, click handling, and selection state styling for the Explorer Pane.

## Requirements
### Requirement: ExplorerItem component
The system SHALL provide an `ExplorerItem` component in `$lib/components/shared/explorer-item/` that wraps a list item with context menu support, click handling, and selection state styling. The component SHALL accept `path` (string for tab path identification), `menuItems` (MenuItem[] for context menu), `class` (optional string for additional styling), and a `children` snippet for item content. The component SHALL internally determine the active selection state by comparing `path` with the active tab in `tabStore`.

#### Scenario: Render item with context menu
- **WHEN** an ExplorerItem is rendered with `menuItems=[{label:"Open",icon:FileText,onSelect:fn}]` and children containing item text
- **THEN** right-clicking the item opens a context menu showing the provided items
- **AND** left-clicking the item triggers the internal click handler

#### Scenario: Active item styling
- **WHEN** an ExplorerItem is rendered with `path="/changes/my-change"` and that path matches the active tab
- **THEN** the item shows active background styling (`bg-primary/10 text-foreground`)

#### Scenario: Inactive item styling
- **WHEN** an ExplorerItem is rendered with `path="/changes/my-change"` and that path does NOT match the active tab
- **THEN** the item shows inactive styling (`text-muted-foreground hover:bg-secondary/70 hover:text-foreground`)

#### Scenario: Click opens preview tab
- **WHEN** the operator clicks an ExplorerItem and preview tabs are enabled
- **THEN** a preview tab is opened for the item's path via `tabStore.openPreview`
- **AND** the corresponding section is focused in the layout store

#### Scenario: Click opens confirmed tab
- **WHEN** the operator clicks an ExplorerItem and preview tabs are disabled OR Ctrl is held
- **THEN** a confirmed tab is opened for the item's path via `tabStore.openConfirmed`
- **AND** the corresponding section is focused in the layout store

### Requirement: ExplorerItem uses ItemContextMenu internally
The ExplorerItem component SHALL use the existing `ItemContextMenu` component from `$lib/components/shared/item-context-menu/` to render the context menu. The ExplorerItem SHALL NOT directly use `ContextMenu.Root`.

#### Scenario: ExplorerItem delegates to ItemContextMenu
- **WHEN** ExplorerItem source code is inspected
- **THEN** it imports and uses `ItemContextMenu` from `$lib/components/shared/item-context-menu`
- **AND** it passes `menuItems` as the `items` prop to ItemContextMenu

### Requirement: ExplorerItem root element is a semantic element
The ExplorerItem component SHALL render its trigger element as a `<button>` element for accessibility. The button SHALL have `type="button"` and appropriate text styling.

#### Scenario: ExplorerItem renders as button
- **WHEN** an ExplorerItem is rendered
- **THEN** the outer clickable element is a `<button type="button">`
- **AND** the button contains the children snippet content
