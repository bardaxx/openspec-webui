## MODIFIED Requirements

### Requirement: Explorer Pane renders collapsible sections
The system SHALL render an Explorer Pane between the Activity Bar and the Main Viewer. The Explorer Pane SHALL contain three collapsible sections in this order: ACTIVE CHANGES, ARCHIVE, and SPECS. Each section header SHALL display an icon, a title, and a count badge. Each section SHALL display a list of items without individual item icons, and all section headers SHALL remain visible together so the operator can scan the full list structure.

#### Scenario: Explorer Pane shows three sections on load
- **WHEN** the application loads with data
- **THEN** the Explorer Pane shows three collapsible sections in order: ACTIVE CHANGES, ARCHIVE, SPECS
- **AND** each section header shows an icon, a title, and a count badge with the number of items
- **AND** list items display name and metadata without individual icons

#### Scenario: Empty section displays placeholder
- **WHEN** a section has no items
- **THEN** the section body shows a placeholder message (e.g., `No active changes`)

### Requirement: Explorer Pane is collapsible
The system SHALL allow the operator to collapse the entire Explorer Pane by clicking the currently active Activity Bar section icon. When collapsed, the Activity Bar icon for the current section SHALL still be highlighted and the Main Viewer SHALL expand to fill the space. The system SHALL NOT render an independent expand button when the Explorer Pane is collapsed.

#### Scenario: Collapse entire Explorer Pane via Activity Bar toggle
- **WHEN** the operator clicks the currently active icon in the Activity Bar while the Explorer Pane is expanded
- **THEN** the Explorer Pane collapses to zero width
- **AND** the Main Viewer expands to fill the space
- **AND** the active Activity Bar icon remains highlighted

#### Scenario: Expand collapsed Explorer Pane via Activity Bar
- **WHEN** the operator clicks any Activity Bar section icon while the Explorer Pane is collapsed
- **THEN** the Explorer Pane expands back to its previous width
- **AND** the corresponding section is expanded and focused

#### Scenario: No independent expand button when collapsed
- **WHEN** the Explorer Pane is collapsed
- **THEN** no expand button is rendered in the Main Viewer area
- **AND** the Main Viewer fills the available space without any explorer-related controls
