## MODIFIED Requirements

### Requirement: Initial project from current working directory
The system SHALL evaluate the current working directory at startup. If it is a valid directory containing an `openspec/` subdirectory, the system SHALL add it to the registry and set it as active, equivalent to a `POST /api/projects` call. If the current working directory is not a valid OpenSpec project, the system SHALL start normally without adding a project from startup context.

#### Scenario: Startup with a valid current working directory
- **WHEN** the server starts from `/home/user/my-repo`
- **AND** that directory is a valid OpenSpec project
- **THEN** the project is added to the registry and becomes active

#### Scenario: Startup with a non-project current working directory
- **WHEN** the server starts from a directory that does not contain an `openspec/` subdirectory
- **THEN** the server starts normally
- **AND** the registry remains unchanged by startup bootstrap
