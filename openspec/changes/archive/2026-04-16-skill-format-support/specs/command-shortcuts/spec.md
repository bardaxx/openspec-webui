## MODIFIED Requirements

### Requirement: Generate command text from the active workflow preference
The system SHALL generate OpenSpec commands with `/opsx-<workflow>` when the workflow preference is `standard`, SHALL generate OpenSpec commands with `/opsx:<workflow>` when the workflow preference is `Claude Code`, SHALL generate skill invocation text with `/openspec-<skill-name>` when the workflow preference is `skill`, SHALL append no positional arguments for workspace-scoped commands, and SHALL append `<change-name>` only for change-scoped commands. The skill name for each supported workflow SHALL be resolved through a lookup table that maps workflow IDs to their corresponding OpenSpec skill names (e.g., `apply` → `openspec-apply-change`, `sync` → `openspec-sync-specs`, `propose` → `openspec-propose`).

#### Scenario: Generate a workspace command with the standard syntax
- **WHEN** the operator uses a workspace-scoped command while the workflow preference is `standard`
- **THEN** the system generates a command such as `/opsx-propose`
- **AND** does not append a change argument

#### Scenario: Generate a change-scoped command with the Claude Code syntax
- **WHEN** the operator uses a change-scoped command while the workflow preference is `Claude Code`
- **THEN** the system generates a command such as `/opsx:apply <change-name>`
- **AND** does not append a task label or other extra argument

#### Scenario: Generate a workspace command with the skill workflow
- **WHEN** the operator uses a workspace-scoped command while the workflow preference is `skill`
- **THEN** the system generates a skill invocation such as `/openspec-explore`
- **AND** does not append a change argument

#### Scenario: Generate a change-scoped command with the skill workflow
- **WHEN** the operator uses a change-scoped command while the workflow preference is `skill`
- **THEN** the system generates a skill invocation such as `/openspec-apply-change <change-name>`
- **AND** resolves the workflow ID to the correct skill name via the lookup table

#### Scenario: Skill name lookup resolves irregular mappings
- **WHEN** the workflow preference is `skill` and the operator invokes the `sync` workflow
- **THEN** the system generates `/openspec-sync-specs` (not `/openspec-sync`)

#### Scenario: Generate a representative expanded workflow in skill mode
- **WHEN** the workflow preference is `skill`
- **AND** the operator invokes `continue` for a change named `my-change`
- **THEN** the system generates `/openspec-continue-change my-change`

### Requirement: Show workspace command buttons on Dashboard and Changes
The system SHALL render copy-command buttons inline within the ACTIVE CHANGES section header surface using the `CommandChip` component from `$lib/components/ui/command-chip/`, whether that surface is shown in the persistent Explorer Pane or the temporary narrow-width Home drawer. The system SHALL include the core workspace commands `propose` and `explore` only when their visibility preferences are enabled, SHALL include `new` only when that expanded command is both available and enabled, SHALL include `bulk-archive` only when at least one active change is fully complete and that expanded command is both available and enabled, and SHALL include `continue` and `ff` only when at least one active change remains incomplete and those expanded commands are both available and enabled. The row SHALL remain compact, SHALL wrap when many commands are visible, and SHALL preserve command-emphasis styling distinct from standard action buttons.

#### Scenario: Hide a workspace core command that is toggled off
- **WHEN** the operator disables the visibility toggle for `explore`
- **THEN** the UI does not show the `explore` `CommandChip` in workspace command rows

#### Scenario: Show expanded workspace commands in the skill workflow
- **WHEN** the workflow preference is `skill`
- **AND** at least one active change remains incomplete
- **THEN** the UI may show `continue` and `ff` in the workspace command row when they are enabled and available

### Requirement: Show change-scoped command buttons in ChangeViewer
The system SHALL render change-scoped copy-command buttons inline within the ChangeViewer header using `CommandChip` components. The system SHALL also render change-scoped copy-command buttons within each Dashboard Active Changes list item using `CommandChip` components via `CommandShortcutBar`. The system SHALL show `apply` when the change still has incomplete tasks and that core command is enabled, SHALL show `archive` when the change has no incomplete tasks and that core command is enabled, SHALL show `continue` and `ff` for incomplete changes only when those commands are both available and enabled, and SHALL show `verify` and `sync` for complete changes only when those commands are both available and enabled. In Dashboard list items, the command chips SHALL be visually separated from the primary open-change action, SHALL be preceded by a `Next Step` cue label, and activating a command chip SHALL NOT trigger navigation into the change.

#### Scenario: Hide a change core command that is toggled off
- **WHEN** the operator disables the visibility toggle for `apply`
- **THEN** incomplete change command rows do not show the `apply` `CommandChip`

#### Scenario: Show expanded change commands in the skill workflow
- **WHEN** the workflow preference is `skill`
- **AND** the operator views an active change with incomplete tasks
- **THEN** the UI shows `apply`, `continue`, and `ff` when they are enabled and available
