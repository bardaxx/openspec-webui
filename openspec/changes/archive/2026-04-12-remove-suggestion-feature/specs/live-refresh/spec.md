## MODIFIED Requirements

### Requirement: Watch relevant OpenSpec files and directories
The system SHALL watch the loaded OpenSpec directory for markdown file changes, SHALL ignore dotfiles and `node_modules`, and SHALL classify relevant updates as affecting `project`, `specs`, or `changes`.

#### Scenario: Ignore unsupported file changes
- **WHEN** a file event occurs for a non-markdown file
- **THEN** the watcher ignores the event

#### Scenario: Classify a spec file change
- **WHEN** a file event occurs under `specs/<capability>/`
- **THEN** the system classifies the update as affecting `specs`
- **AND** uses the capability directory name as the affected entity ID

#### Scenario: Classify a change directory event
- **WHEN** a directory is added or removed under `changes/` or `changes/archive/`
- **THEN** the system classifies the update as affecting `changes`
