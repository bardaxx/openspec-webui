## MODIFIED Requirements

### Requirement: Initial project from current working directory
The system SHALL evaluate the current working directory at startup. If the registry contains no projects and `activeProjectId` is null, and the current working directory is a valid directory containing an `openspec/` subdirectory, the system SHALL add it to the registry and set it as active, equivalent to a `POST /api/projects` call. If registered projects already exist, the system SHALL NOT change the global default based on the startup working directory. If the current working directory is not a valid OpenSpec project, the system SHALL start normally without adding a project from startup context.

#### Scenario: First startup with a valid current working directory
- **WHEN** the server starts from `/home/user/my-repo`
- **AND** that directory is a valid OpenSpec project
- **AND** the registry is empty
- **THEN** the project is added to the registry and becomes active

#### Scenario: Startup with a valid CWD but existing projects
- **WHEN** the server starts from `/home/user/my-repo`
- **AND** that directory is a valid OpenSpec project
- **AND** one or more projects are already registered
- **THEN** the server starts normally
- **AND** the global default project remains unchanged

#### Scenario: Startup with a non-project current working directory
- **WHEN** the server starts from a directory that does not contain an `openspec/` subdirectory
- **THEN** the server starts normally
- **AND** the registry remains unchanged by startup bootstrap
