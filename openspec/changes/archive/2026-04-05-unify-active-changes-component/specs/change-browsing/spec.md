## MODIFIED Requirements

### Requirement: List active and archived changes
The system SHALL list active changes alphabetically, SHALL list archived changes newest-first by leading archive date when available, and SHALL expose per-change summary data including task progress, spec delta count, design presence, file counts, and archive status. Active changes SHALL be rendered by a shared `ActiveChangesList` component that displays each change with an icon, name, spec delta count, design badge, and task progress bar, ensuring identical appearance across the Dashboard and Changes views.

#### Scenario: Show active change summaries
- **WHEN** the workspace contains active changes
- **THEN** the system lists them alphabetically
- **AND** each summary includes an icon, name, spec delta count, and task progress
- **AND** the UI marks changes with design content using a design badge
- **AND** the same component renders the list on both Dashboard and Changes pages

#### Scenario: Show archived change summaries
- **WHEN** the workspace contains archived changes stored with `YYYY-MM-DD-` prefixes
- **THEN** the system extracts the archive date from the folder name
- **AND** sorts archived entries newest-first
- **AND** the UI displays them as completed archived items
