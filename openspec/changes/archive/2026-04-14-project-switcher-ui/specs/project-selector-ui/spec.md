## MODIFIED Requirements

### Requirement: Project selector dialog
The web UI SHALL render a ProjectSelector dialog component when `layoutStore.overlay` is set to `'project-selector'`. The dialog SHALL display a list of registered projects with their labels, an `Add New Project` action that opens a dedicated add-project dialog, and a remove action for each project. The currently active project SHALL be visually distinguished. Selecting a project SHALL switch the active project via API and close the dialog.

#### Scenario: Open project selector
- **WHEN** the operator clicks the `folder-pen` button in the Dashboard header or the ExplorerPane header
- **THEN** the ProjectSelector dialog opens
- **AND** displays all registered projects
- **AND** the active project is visually distinguished

#### Scenario: Open add-project dialog from selector
- **WHEN** the operator clicks the `Add New Project` action in the ProjectSelector dialog
- **THEN** the ProjectSelector dialog closes
- **AND** the dedicated add-project dialog opens

### Requirement: Add-project dialog
The web UI SHALL render a dedicated AddProjectDialog component when `layoutStore.overlay` is set to `'add-project'`. The dialog SHALL prioritize directory browsing, SHALL show which subdirectories contain an `openspec/` folder, and SHALL provide a manual absolute-path fallback. Selecting the current directory or submitting a manual path SHALL add and activate that project.

#### Scenario: Open add-project dialog from empty state
- **WHEN** the operator clicks the primary add-project action from the empty project state
- **THEN** the dedicated add-project dialog opens
- **AND** a directory browser is shown immediately

#### Scenario: Browse and add current directory
- **WHEN** the operator navigates directories in the add-project dialog and chooses the currently displayed directory
- **THEN** a POST request is sent to `/api/projects`
- **AND** the selected directory becomes the active project
- **AND** the add-project dialog closes

#### Scenario: Manual path fallback
- **WHEN** the operator expands the manual path section in the add-project dialog and submits an absolute path
- **THEN** a POST request is sent to `/api/projects`
- **AND** the selected directory becomes the active project
- **AND** the add-project dialog closes

#### Scenario: Switch project via selector
- **WHEN** the operator clicks a non-active project in the ProjectSelector
- **THEN** a POST request is sent to `/api/projects/:id/activate`
- **AND** the dialog closes
- **AND** all frontend stores are reset and re-fetched
- **AND** all open tabs are closed and the Dashboard tab is focused

### Requirement: Project switch loading state
The web UI SHALL display a loading indicator during project switching. The loading indicator SHALL appear immediately when the operator selects a different project and SHALL disappear once the new project data is fully loaded.

#### Scenario: Loading during switch
- **WHEN** the operator switches to a different project
- **THEN** a loading indicator is shown
- **AND** the indicator disappears when the new project data is loaded

#### Scenario: Loading during initial add
- **WHEN** the operator adds a new project (which becomes active)
- **THEN** a loading indicator is shown during parsing
- **AND** the indicator disappears when the project data is loaded
