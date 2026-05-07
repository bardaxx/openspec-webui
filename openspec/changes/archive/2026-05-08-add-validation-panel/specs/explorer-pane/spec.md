## ADDED Requirements

### Requirement: Explorer Pane renders a persistent Validation panel
The system SHALL render Validation as a dedicated Explorer Pane panel separate from the Active Changes, Archive, and Specs section group. When Validation is active, the Explorer Pane SHALL show only the Validation panel above the existing project selector footer. The panel SHALL follow the existing Explorer visual language while using a prominent header, explanatory description, Run Validate action, summary counts, validation status, and persistent failed-item list.

#### Scenario: Validation panel initial state
- **WHEN** the Explorer Pane is switched to Validation and no validation result exists
- **THEN** the Validation panel displays a prominent Validation header
- **AND** it displays explanatory text describing that validation checks the active project's specs and changes
- **AND** it displays a Run Validate action

#### Scenario: Validation panel loading state
- **WHEN** validation is running
- **THEN** the Validation panel displays a loading state
- **AND** the Run Validate action is disabled or indicates that a run is in progress

#### Scenario: Validation panel result list
- **WHEN** validation returns failed items
- **THEN** the Validation panel displays the number of failed items
- **AND** it renders each failed item as a selectable Explorer-style list item with type, name, severity, and issue count

#### Scenario: Validation result selection preserves panel
- **WHEN** the operator selects a failed validation item in the Validation panel
- **THEN** the corresponding document opens or focuses in the Main Viewer when the item is navigable
- **AND** the Validation panel remains visible with the same results so the operator can continue selecting other failures

#### Scenario: Validation panel pass state
- **WHEN** validation returns no failed items
- **THEN** the Validation panel displays a passing status
- **AND** it does not render an obsolete failed-item list

## MODIFIED Requirements

### Requirement: Activity Bar selection applies explorer focus presets
The system SHALL synchronize Activity Bar selection with Explorer Pane expansion presets. Selecting Home from the Activity Bar SHALL expand ACTIVE CHANGES and collapse ARCHIVE and SPECS. Selecting Archive from the Activity Bar SHALL expand ARCHIVE and collapse ACTIVE CHANGES and SPECS. Selecting Specs from the Activity Bar SHALL expand SPECS and collapse ACTIVE CHANGES and ARCHIVE. Selecting Search from the Activity Bar SHALL show the Search panel. Selecting Validate from the Activity Bar SHALL show the Validation panel. Manual section toggles inside the Explorer Pane SHALL remain allowed until the next Activity Bar preset change.

#### Scenario: Home preset expands active changes browsing
- **WHEN** the operator clicks the Home icon in the Activity Bar
- **THEN** the ACTIVE CHANGES section is expanded
- **AND** the ARCHIVE section is collapsed
- **AND** the SPECS section is collapsed

#### Scenario: Archive preset expands archive browsing
- **WHEN** the operator clicks the Archive icon in the Activity Bar
- **THEN** the ARCHIVE section is expanded
- **AND** the ACTIVE CHANGES section is collapsed
- **AND** the SPECS section is collapsed

#### Scenario: Specs preset expands only spec browsing
- **WHEN** the operator clicks the Specs icon in the Activity Bar
- **THEN** the SPECS section is expanded
- **AND** the ACTIVE CHANGES section is collapsed
- **AND** the ARCHIVE section is collapsed

#### Scenario: Search preset shows Search panel
- **WHEN** the operator clicks the Search icon in the Activity Bar
- **THEN** the Explorer Pane switches to the Search panel

#### Scenario: Validate preset shows Validation panel
- **WHEN** the operator clicks the Validate icon in the Activity Bar
- **THEN** the Explorer Pane switches to the Validation panel

#### Scenario: Activity Bar can restore a collapsed pane
- **WHEN** the Explorer Pane is collapsed and the operator clicks the Home icon in the Activity Bar
- **THEN** the Explorer Pane expands back to its previous width
- **AND** the ACTIVE CHANGES section is expanded
