## MODIFIED Requirements

### Requirement: Provide dashboard and primary navigation context
The web UI SHALL provide top-level Home, Changes, and Specs views, SHALL show the current project name in navigation linking to the Home page, SHALL show counts for specs and archived changes in navigation badges, and SHALL render the Home page with an Active Changes section (with a count badge in its header) and project documentation when available. The navigation SHALL NOT include a separate Dashboard link; the project logo/title SHALL link to the Home page. The navigation SHALL highlight the active section using direct reactive store access in the template expression to ensure reactivity.

#### Scenario: Render the Home page
- **WHEN** the browser loads the Home page (`/`)
- **THEN** the system shows the Active Changes section with a count badge in the header
- **AND** lists active changes with their progress summaries
- **AND** renders the project documentation markdown when project content exists

#### Scenario: Show an empty active changes state
- **WHEN** the workspace has no active changes
- **THEN** the Home page shows `No active changes`

#### Scenario: Navigation highlights active section
- **WHEN** the operator navigates to a route under `/specs`
- **THEN** the Specs navigation button is visually highlighted
- **WHEN** the operator navigates to a route under `/changes`
- **THEN** the Changes navigation button is visually highlighted
- **WHEN** the operator navigates to the Home page (`/`)
- **THEN** no navigation button is highlighted (the logo serves as the Home link)

### Requirement: Change viewer back navigation
The system SHALL provide a back link in the ChangeViewer that navigates to the Home page (`/`) when viewing an active change, and to the Changes page (`/changes`) when viewing an archived change.

#### Scenario: Back link from an active change
- **WHEN** the operator views an active change
- **THEN** the ChangeViewer shows a back link pointing to the Home page (`/`)

#### Scenario: Back link from an archived change
- **WHEN** the operator views an archived change
- **THEN** the ChangeViewer shows a back link pointing to the Changes page (`/changes`)

### Requirement: Spec viewer back navigation
The system SHALL provide a back link in the SpecViewer that navigates to the Specs page (`/specs`).

#### Scenario: Back link from a spec
- **WHEN** the operator views a spec
- **THEN** the SpecViewer shows a back link pointing to the Specs page (`/specs`)

## REMOVED Requirements

### Requirement: Summarize workspace metrics
**Reason**: Stats Cards removed from Home page. Counts are now available via navigation badges (specs count, archived changes count) and the Active Changes section header badge (active changes count). Overall task progress is visible per-change in the ActiveChangesList.
**Migration**: Navigation badges and section header badges provide equivalent information.
