## MODIFIED Requirements

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
