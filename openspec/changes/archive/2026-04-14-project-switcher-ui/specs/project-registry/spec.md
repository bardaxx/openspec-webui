## MODIFIED Requirements

### Requirement: Project registry persistence
The system SHALL maintain a project registry file at `${XDG_CONFIG_HOME:-~/.config}/openspec-webui/projects.json`. The file SHALL contain a versioned JSON object with a `version` field, a `projects` array, and an `activeProjectId` string or null. Each project entry SHALL include `id` (UUID), `path` (absolute normalized project-root path), `label` (auto-derived from directory name), `addedAt` (timestamp), and `lastOpenedAt` (timestamp). The system SHALL create the config directory and file if they do not exist at server startup. The system SHALL NOT allow duplicate paths in the registry. The system SHALL write the file atomically.

#### Scenario: First startup with no config directory
- **WHEN** the server starts and `~/.config/openspec-webui/` does not exist
- **THEN** the system creates the directory and an empty `projects.json` with the current supported `version`, an empty `projects` array, and `activeProjectId` set to null

### Requirement: List projects via API
The system SHALL provide a `GET /api/projects` endpoint that returns all project entries in the registry with the active project's `id` flagged.

#### Scenario: List multiple projects
- **WHEN** a GET request is sent to `/api/projects`
- **THEN** the response contains a `projects` array with all registered project entries
- **AND** an `activeProjectId` field indicating the currently active project
