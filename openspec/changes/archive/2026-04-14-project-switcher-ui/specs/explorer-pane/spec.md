## MODIFIED Requirements

### Requirement: Explorer Pane is collapsible
The system SHALL allow the operator to collapse the entire Explorer Pane by clicking the currently active Activity Bar section icon or the dedicated Explorer toggle control. When collapsed, the Activity Bar icon for the current section SHALL still be highlighted, the Explorer toggle SHALL remain visible at the top of the Activity Bar, and the Main Viewer SHALL expand to fill the space. The system SHALL NOT render an independent expand button when the Explorer Pane is collapsed.

#### Scenario: Collapse entire Explorer Pane via Activity Bar toggle
- **WHEN** the operator clicks the currently active icon in the Activity Bar while the Explorer Pane is expanded
- **THEN** the Explorer Pane collapses to zero width
- **AND** the Main Viewer expands to fill the space
- **AND** the active Activity Bar icon remains highlighted
- **AND** the Explorer toggle remains visible at the top of the Activity Bar

#### Scenario: Expand collapsed Explorer Pane via Activity Bar
- **WHEN** the operator clicks any Activity Bar section icon while the Explorer Pane is collapsed
- **THEN** the Explorer Pane expands back to its previous width
- **AND** the corresponding section is expanded and focused
- **AND** the current-project header content is rendered again

#### Scenario: No independent expand button when collapsed
- **WHEN** the Explorer Pane is collapsed
- **THEN** no expand button is rendered in the Main Viewer area
- **AND** the Main Viewer fills the available space without any explorer-related controls

## ADDED Requirements

### Requirement: Explorer Pane renders current-project header content
When the Explorer Pane is visible, the system SHALL render current-project header content within the pane header itself. The header SHALL display a folder icon, SHALL display the active project name, and SHALL provide a `folder-pen` button that opens the project selector. The header SHALL NOT render a project avatar or project appearance editor affordance. In narrow layout, the drawer SHALL open to the right of the Activity Bar so the rail remains visible.

#### Scenario: Explorer Pane shows project header content
- **WHEN** the Explorer Pane is visible with an active project
- **THEN** the top row of the pane displays a folder icon and the active project name together
- **AND** the row includes a `folder-pen` project selector button

#### Scenario: ExplorerPane selector button opens selector
- **WHEN** the operator activates the `folder-pen` button in the current-project header
- **THEN** the project selector opens
- **AND** the collapse state of the Explorer Pane does not change

#### Scenario: Narrow drawer keeps the Activity Bar visible
- **WHEN** the application is in narrow layout and the operator opens the Explorer drawer
- **THEN** the drawer appears to the right of the 48px Activity Bar
- **AND** the Activity Bar remains visible and interactive
