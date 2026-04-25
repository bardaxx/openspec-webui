## MODIFIED Requirements

### Requirement: Add-project dialog
The web UI SHALL render a dedicated AddProjectDialog component when `layoutStore.overlay` is set to `'add-project'`. The dialog SHALL prioritize directory browsing, SHALL show which subdirectories contain an `openspec/` folder, and SHALL provide a manual path fallback. Selecting the current directory or submitting a manual path SHALL add and activate that project. After the API add or reactivate step completes, the client SHALL complete a WebSocket `project:bind` flow for the returned project before treating that project as ready. The manual path fallback SHALL accept any non-empty string without absolute-path validation; the server validates the path.

#### Scenario: Open add-project dialog from empty state
- **WHEN** the operator clicks the primary add-project action from the empty project state
- **THEN** the dedicated add-project dialog opens
- **AND** a directory browser is shown immediately

#### Scenario: Browse and add current directory
- **WHEN** the operator navigates directories in the add-project dialog and chooses the currently displayed directory
- **THEN** a POST request is sent to `/api/projects`
- **AND** the client sends WebSocket `project:bind` for the returned project id
- **AND** the selected directory becomes the active project after the `project:bound` response has reinitialized project-scoped data
- **AND** the add-project dialog closes

#### Scenario: Manual path fallback
- **WHEN** the operator expands the manual path section in the add-project dialog and submits a path
- **THEN** a POST request is sent to `/api/projects`
- **AND** the client sends WebSocket `project:bind` for the returned project id
- **AND** the selected directory becomes the active project after the `project:bound` response has reinitialized project-scoped data
- **AND** the add-project dialog closes

### Requirement: Project switch loading state
The web UI SHALL display a loading indicator during project switching. The loading indicator SHALL appear immediately when the operator selects a different project or adds/reactivates a project and SHALL disappear only after the new project's data has been fully loaded from the `project:bound`-triggered refresh.

#### Scenario: Loading during switch
- **WHEN** the operator switches to a different project
- **THEN** a loading indicator is shown
- **AND** the indicator disappears when the new project data is loaded

#### Scenario: Loading during initial add
- **WHEN** the operator adds a new project (which becomes active)
- **THEN** a loading indicator is shown during parsing and binding
- **AND** the indicator disappears when the project data is loaded
