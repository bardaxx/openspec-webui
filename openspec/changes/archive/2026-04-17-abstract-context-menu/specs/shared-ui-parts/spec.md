## ADDED Requirements

### Requirement: ItemContextMenu shared component
The system SHALL provide an `ItemContextMenu` component in `$lib/components/ui/item-context-menu/` as part of the shared UI parts. The component SHALL be importable via `$lib/components/ui/item-context-menu`.

#### Scenario: Import ItemContextMenu
- **WHEN** a component imports from `$lib/components/ui/item-context-menu`
- **THEN** the `ItemContextMenu` component is available for use

### Requirement: Shared item context menu definitions
The system SHALL provide a shared helper in `$lib/itemContextMenu.ts` that builds consistent menu item definitions for `active-change`, `archived-change`, and `spec` items from their kind and required callbacks.

#### Scenario: Build change context menu items
- **WHEN** a consumer builds menu items for an `active-change` or `archived-change` with a name and an open callback
- **THEN** the resulting menu contains `Open in New Tab` and `Copy Name`

#### Scenario: Build spec context menu items
- **WHEN** a consumer builds menu items for a `spec` with a name, an open callback, and a search callback
- **THEN** the resulting menu contains `Open in New Tab`, `Copy Name`, and `Search Related Changes`

### Requirement: Clipboard copy utility
The system SHALL provide a `copyToClipboard` function in `$lib/utils.ts` (or equivalent shared utility module) that accepts a text string and a label, copies the text to the system clipboard, and shows a success or error toast notification.

#### Scenario: Copy text to clipboard successfully
- **WHEN** `copyToClipboard("my-change", "Change name")` is called
- **THEN** the text "my-change" is written to the system clipboard
- **AND** a success toast is shown with "Change name copied"

#### Scenario: Copy fails gracefully
- **WHEN** the clipboard API fails
- **THEN** an error toast is shown with "Failed to copy"
