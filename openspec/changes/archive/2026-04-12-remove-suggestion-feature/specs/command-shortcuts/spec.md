## MODIFIED Requirements

### Requirement: Show change-scoped command buttons in ChangeViewer
The system SHALL render change-scoped copy-command buttons inline within the ChangeViewer header using `CommandChip` components. The system SHALL also render change-scoped copy-command buttons within each Dashboard Active Changes list item using `CommandChip` components via `CommandShortcutBar`. The system SHALL show `apply` when the change still has incomplete tasks, SHALL show `archive` when the change has no incomplete tasks, SHALL show `continue` and `ff` for incomplete changes only when those commands are both available and enabled, and SHALL show `verify` and `sync` for complete changes only when those commands are both available and enabled. In Dashboard list items, the command chips SHALL be visually separated from the primary open-change action, SHALL be preceded by a `Next Step` cue label, and activating a command chip SHALL NOT trigger navigation into the change.

#### Scenario: Show commands for an incomplete active change in Dashboard
- **WHEN** the Dashboard surface renders an active change with incomplete tasks
- **THEN** that change item shows a `CommandChip` for `apply`
- **AND** shows `continue` and `ff` only if those commands are available and enabled

#### Scenario: Show commands for a complete active change in Dashboard
- **WHEN** the Dashboard surface renders an active change whose tasks are all complete
- **THEN** that change item shows a `CommandChip` for `archive`
- **AND** shows `verify` and `sync` only if those commands are available and enabled

#### Scenario: Dashboard command row shows next-step cue
- **WHEN** the Dashboard renders change-scoped command chips for an active change
- **THEN** the command row shows a `Next Step` label before the command chips
- **AND** the cue remains visible even if only one command chip is shown

#### Scenario: Dashboard command chips do not open the change
- **WHEN** the operator activates a change-scoped command chip in a Dashboard Active Changes item
- **THEN** the system copies the command text for that change
- **AND** the current tab remains on Dashboard

#### Scenario: Show commands for an incomplete active change in ChangeViewer
- **WHEN** the operator opens an active change with incomplete tasks
- **THEN** the UI shows a `CommandChip` for `apply` inline in the header
- **AND** shows `continue` and `ff` only if those commands are available and enabled

#### Scenario: Show commands for a complete active change in ChangeViewer
- **WHEN** the operator opens an active change whose tasks are all complete
- **THEN** the UI shows a `CommandChip` for `archive` inline in the header
- **AND** shows `verify` and `sync` only if those commands are available and enabled

#### Scenario: ChangeViewer header does not render suggestion actions
- **WHEN** the ChangeViewer header is rendered after suggestion feature removal
- **THEN** the header shows the command shortcut cluster without any Suggest / Exit button beside it

#### Scenario: Copy a change-scoped command with the change name only
- **WHEN** the operator activates a change-scoped command button
- **THEN** the system copies the command plus the current change name
- **AND** does not append a task label
