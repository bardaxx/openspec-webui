## MODIFIED Requirements

### Requirement: Explorer Pane renders a persistent Validation panel
The system SHALL render Validation as a dedicated Explorer Pane panel separate from the Active Changes, Archive, and Specs section group. When Validation is active, the Explorer Pane SHALL show only the Validation panel above the existing project selector footer. The panel SHALL follow the existing Explorer visual language while using a compact header, initial list placeholder with prominent Run Validate action, compact post-run reload action, last-run metadata, loading and error states, result-visible compact file-status count filters, validation status, and persistent validation item list. The title row SHALL show the Validation title and a compact action that opens Settings to the Validation section. The title row SHALL NOT show the validation result status badge. Before a result exists, explanatory content and the prominent Run Validate action SHALL live in the list placeholder. After a result exists, the compact reload action SHALL appear in the title-row action cluster beside the Settings action, and file-status count filters SHALL appear in a compact status row below. The panel SHALL keep persistent validation preferences out of the Explorer header, SHALL avoid duplicating summary counts between the header and result list, SHALL place last-run metadata on its own line so the run button loading spinner does not cause horizontal layout shift, SHALL remain visible after a validation item opens a Main Viewer tab, and SHALL mark the row for the currently active validation document as selected when that item is navigable.

#### Scenario: Validation result selection preserves panel
- **WHEN** the operator selects a validation item in the Validation panel
- **THEN** the corresponding document opens or focuses in the Main Viewer when the item is navigable
- **AND** the Validation panel remains visible with the same result state so the operator can continue selecting other validation items

#### Scenario: Validation list reflects active Main Viewer tab
- **WHEN** a navigable validation item corresponds to the document currently active in the Main Viewer
- **THEN** that validation row renders the explorer selected-state styling
- **AND** other validation rows remain unselected unless they match the active tab path
