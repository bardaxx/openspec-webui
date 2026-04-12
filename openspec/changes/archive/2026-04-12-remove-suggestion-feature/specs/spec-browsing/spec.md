## MODIFIED Requirements

### Requirement: Change lastModified includes spec delta file updates
The system SHALL include markdown files under `changes/<name>/specs/` when computing a change's `lastModified`, so ExplorerPane and ChangeViewer surface the newest relevant change update even when only a spec delta file changed.

#### Scenario: Spec delta file is the newest file in a change
- **WHEN** a change's newest modified file is `changes/<name>/specs/<capability>/spec.md`
- **THEN** the parsed change `lastModified` equals that spec delta file's modification time
- **AND** the change still renders spec deltas in the dedicated UI area rather than the regular file groups
