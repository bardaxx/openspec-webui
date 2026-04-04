## MODIFIED Requirements

### Requirement: Show workspace command buttons on Dashboard and Changes
The system SHALL render copy-command buttons inline within the Active Changes section header on the Dashboard and Changes views, SHALL always include the core workspace commands `propose` and `explore`, SHALL include `new` only when that expanded command is both available and enabled, SHALL include `bulk-archive` only when at least one active change is fully complete and that expanded command is both available and enabled, and SHALL include `continue` and `ff` only when at least one active change remains incomplete and those expanded commands are both available and enabled. The command buttons SHALL be rendered as a compact button row without a surrounding card, title, or description block.

#### Scenario: Show the always-available workspace commands
- **WHEN** the operator views the Dashboard or Changes page
- **THEN** the UI shows copy buttons for `propose` and `explore` inline in the Active Changes section header

#### Scenario: Show incomplete-work workspace commands
- **WHEN** at least one active change still has incomplete tasks
- **THEN** the UI shows copy buttons for `continue` and `ff` only if those commands are available and enabled

#### Scenario: Show bulk archive when completed active changes exist
- **WHEN** at least one active change is fully complete
- **THEN** the UI shows a copy button for `bulk-archive` only if that command is available and enabled

#### Scenario: Copy a workspace command without arguments
- **WHEN** the operator activates a workspace command button
- **THEN** the system copies only the command text
- **AND** does not append a change name

### Requirement: Show change-scoped command buttons in ChangeViewer
The system SHALL render change-scoped copy-command buttons inline within the ChangeViewer header alongside existing actions, SHALL show `apply` when the change still has incomplete tasks, SHALL show `archive` when the change has no incomplete tasks, SHALL show `continue` and `ff` for incomplete changes only when those commands are both available and enabled, and SHALL show `verify` and `sync` for complete changes only when those commands are both available and enabled. The command buttons SHALL be rendered as a compact button row without a surrounding card, title, or description block.

#### Scenario: Show commands for an incomplete active change
- **WHEN** the operator opens an active change with incomplete tasks
- **THEN** the UI shows a copy button for `apply` inline in the header
- **AND** shows `continue` and `ff` only if those commands are available and enabled

#### Scenario: Show commands for a complete active change
- **WHEN** the operator opens an active change whose tasks are all complete
- **THEN** the UI shows a copy button for `archive` inline in the header
- **AND** shows `verify` and `sync` only if those commands are available and enabled

#### Scenario: Copy a change-scoped command with the change name only
- **WHEN** the operator activates a change-scoped command button
- **THEN** the system copies the command plus the current change name
- **AND** does not append a task label

#### Scenario: Hide change-scoped commands for archived changes
- **WHEN** the operator opens an archived change
- **THEN** the UI does not show change-scoped copy-command buttons
