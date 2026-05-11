## MODIFIED Requirements

### Requirement: Context menu on viewer markdown content
The system SHALL display a context menu when the operator right-clicks on the markdown content area in ChangeViewer or SpecViewer. The context menu SHALL use the project's existing ContextMenu component from `$lib/components/ui/context-menu/`. The context menu SHALL appear within the content area. The context menu position SHALL be clamped to the viewport.

#### Scenario: Right-click on ChangeViewer markdown content shows viewer text actions
- **WHEN** the operator right-clicks anywhere on the markdown content area in ChangeViewer
- **THEN** a context menu appears at the cursor position
- **AND** the menu contains `Copy`, `Quote Copy`, and `Search` items

#### Scenario: Context menu appears for ChangeViewer spec delta content
- **WHEN** the operator right-clicks on a spec delta's markdown content in ChangeViewer
- **THEN** a context menu appears with the same items
- **AND** the quoted copy uses the spec delta capability name as context

#### Scenario: Right-click on SpecViewer markdown content shows viewer text actions
- **WHEN** the operator right-clicks anywhere on the markdown content area in SpecViewer
- **THEN** a context menu appears at the cursor position
- **AND** the menu contains `Copy`, `Quote Copy`, and `Search` items

### Requirement: Search from viewer selection context menu
The system SHALL provide a `Search` item in the viewer markdown context menu. The item SHALL use the current `window.getSelection()` text as its source selection, but SHALL only be enabled when the trimmed selection is a valid search keyword. A valid search keyword SHALL be 2 to 80 characters long after trimming outer whitespace and SHALL NOT contain newline, carriage-return, or tab characters. When the selection is invalid, the `Search` item SHALL be disabled and cannot be clicked.

#### Scenario: Enable Search for a valid ChangeViewer selection
- **WHEN** the operator selects a single-line phrase in ChangeViewer whose trimmed length is between 2 and 80 characters and contains no tab characters
- **AND** right-clicks inside the markdown content area
- **THEN** the `Search` item is enabled

#### Scenario: Enable Search for a valid ChangeViewer spec delta selection
- **WHEN** the operator selects a single-line phrase inside ChangeViewer spec delta content whose trimmed length is between 2 and 80 characters and contains no tab characters
- **AND** right-clicks inside that markdown content area
- **THEN** the `Search` item is enabled

#### Scenario: Enable Search for a valid SpecViewer selection
- **WHEN** the operator selects a single-line phrase in SpecViewer whose trimmed length is between 2 and 80 characters and contains no tab characters
- **AND** right-clicks inside the markdown content area
- **THEN** the `Search` item is enabled

#### Scenario: Disable Search for multiline or tabbed selection
- **WHEN** the current viewer selection contains a newline, carriage return, or tab character
- **AND** the operator right-clicks inside the markdown content area
- **THEN** the `Search` item is disabled and cannot be clicked

#### Scenario: Disable Search for too-short or too-long selection
- **WHEN** the trimmed viewer selection is shorter than 2 characters or longer than 80 characters
- **AND** the operator right-clicks inside the markdown content area
- **THEN** the `Search` item is disabled and cannot be clicked
