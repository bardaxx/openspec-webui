# project-context Specification

## Purpose
TBD - created by archiving change capture-baseline-specs. Update Purpose after archive.
## Requirements
### Requirement: Expose project identity and documentation
The system SHALL derive the displayed project name from the parent directory name of the loaded OpenSpec directory, SHALL read `project.md` from that directory, SHALL expose the full markdown content, and SHALL derive the short description from the first paragraph after the top heading.

#### Scenario: Load project metadata from project.md
- **WHEN** the target OpenSpec directory contains a readable `project.md`
- **THEN** the system exposes the derived project name
- **AND** returns the full `project.md` content
- **AND** returns the first paragraph after the heading as the project description

#### Scenario: Fall back when project.md is missing
- **WHEN** the target OpenSpec directory does not contain `project.md`
- **THEN** the system still derives the project name from the directory name
- **AND** exposes an empty project content body
- **AND** uses `No project.md file found` as the fallback description

### Requirement: Provide dashboard and primary navigation context
The web UI SHALL provide top-level Home, Changes, and Specs views, SHALL show the current project name in navigation linking to the Home page, SHALL show counts for specs and archived changes in navigation badges, and SHALL render the Home page with an Active Changes section (with a count badge in its header) and project documentation when available. The navigation SHALL NOT include a separate Dashboard link; the project logo/title SHALL link to the Home page. The navigation SHALL highlight the active section using direct reactive store access in the template expression to ensure reactivity. The navigation settings icon SHALL use the `Icon` component instead of inline SVG.

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

#### Scenario: Navigation uses Icon component for settings
- **WHEN** the navigation bar renders the settings button
- **THEN** the settings icon is rendered via the `Icon` component with `name="gear"`

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
