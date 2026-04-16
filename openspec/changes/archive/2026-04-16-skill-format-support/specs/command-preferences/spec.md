## MODIFIED Requirements

### Requirement: Two-column settings layout
The settings dialog SHALL use a two-column layout with a left sidebar listing setting categories (General, Workflow, Commands) and a right content area showing the selected category's settings. Selecting a category in the sidebar SHALL update the right content area without closing the dialog. The General category SHALL include both theme settings and preview-tab behavior settings.

#### Scenario: Show General settings by default
- **WHEN** the settings dialog opens
- **THEN** the General category is selected in the left sidebar
- **AND** the right content area shows the Appearance (theme) settings
- **AND** the right content area shows the preview-tab mode toggle

#### Scenario: Switch to Workflow settings
- **WHEN** the user clicks the Workflow category in the sidebar navigation
- **THEN** the right content area shows the Workflow settings with three radio options: Standard, Claude Code, and Skill

### Requirement: Persist workflow preferences in the browser
The system SHALL let the operator choose between `standard`, `Claude Code`, and `skill` workflow options, SHALL interpret `standard` as `/opsx-<command>`, SHALL interpret `Claude Code` as `/opsx:<command>`, SHALL interpret `skill` as `/openspec-<skill-name>`, and SHALL persist the selected workflow value in browser localStorage. The system SHALL treat the legacy value `default` as equivalent to `standard` when loading stored preferences.

#### Scenario: Save the standard workflow preference
- **WHEN** the operator selects the `standard` workflow option
- **THEN** the system stores `standard` in localStorage
- **AND** generated commands use the `/opsx-<command>` format

#### Scenario: Save the skill workflow preference
- **WHEN** the operator selects the `skill` workflow option
- **THEN** the system stores `skill` in localStorage
- **AND** generated commands use the `/openspec-<skill-name>` format

#### Scenario: Migrate legacy default preference
- **WHEN** localStorage contains `aiTool: 'default'` from a previous version
- **THEN** the system loads it as the `standard` workflow preference
- **AND** subsequent saves write `standard`

### Requirement: Persist independent expanded-command visibility preferences
The system SHALL provide independent visibility controls for the expanded commands `new`, `continue`, `ff`, `verify`, `sync`, and `bulk-archive`, SHALL persist each visibility value independently in browser localStorage.

#### Scenario: Update one expanded command without changing others
- **WHEN** the operator changes the visibility setting for one expanded command
- **THEN** the system updates only that command's saved visibility value

## ADDED Requirements

### Requirement: Persist independent core-command visibility preferences
The system SHALL provide independent visibility controls for the core commands `propose`, `explore`, `apply`, and `archive`. Each core command SHALL default to visible. The system SHALL persist each visibility value independently in browser localStorage. Core commands SHALL always be considered available regardless of CLI workflow detection. Each saved visibility preference SHALL affect only the command rows where that core command would normally appear.

#### Scenario: Toggle a workspace core command off
- **WHEN** the operator disables the visibility toggle for `propose`
- **THEN** the system persists that preference in localStorage
- **AND** the `propose` command chip no longer appears in workspace command rows

#### Scenario: Toggle a change core command off
- **WHEN** the operator disables the visibility toggle for `apply`
- **THEN** the system persists that preference in localStorage
- **AND** the `apply` command chip no longer appears for incomplete change command rows

#### Scenario: Core commands default to visible
- **WHEN** no saved visibility preference exists for core commands
- **THEN** all core commands are visible by default

#### Scenario: Core command visibility is independent of CLI availability
- **WHEN** the operator toggles a core command visibility
- **THEN** the toggle is always enabled regardless of OpenSpec CLI workflow detection status
