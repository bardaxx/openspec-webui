## MODIFIED Requirements

### Requirement: Client-project binding on WebSocket connect
When a WebSocket client connects, the system SHALL assign the client to the global default project. The system SHALL send a `connection:init` message containing `activeProjectId` (the client's bound project ID). The system SHALL increment the reference count of the bound project session.

#### Scenario: First client connects with a global default project
- **WHEN** a WebSocket client connects
- **AND** the global default project has an active session
- **THEN** the client is bound to that project
- **AND** the session's reference count increments
- **AND** the client receives `connection:init` with the bound project ID

#### Scenario: Client connects with no active sessions
- **WHEN** a WebSocket client connects
- **AND** no project sessions exist
- **THEN** the client is bound to the global default project ID (which may be null)
- **AND** the client receives `connection:init` with `activeProjectId: null`

### Requirement: Client reconnection restores binding context
When a WebSocket client reconnects, the system SHALL treat it as a new client bound to the global default project. The client SHALL read its last bound project ID from browser-local storage (`localStorage`). If a last bound project ID exists and differs from the `connection:init` value, the client SHALL send a `project:bind` message to restore its previous binding. If the stored project ID is absent from the current registry, the client SHALL discard it and use the `connection:init` value.

#### Scenario: Client reconnects after server restart
- **WHEN** a client reconnects after a server restart
- **AND** the client's `localStorage` contains a previously bound project ID
- **AND** that project is still registered
- **THEN** the client receives `connection:init` with the current global default project ID
- **AND** the client sends `project:bind` to switch to its last viewed project

#### Scenario: Client reconnects with a removed project in localStorage
- **WHEN** a client reconnects after a server restart
- **AND** the client's `localStorage` contains a project ID that is no longer registered
- **THEN** the client discards the stale localStorage value
- **AND** remains bound to the global default project from `connection:init`

#### Scenario: Client suppresses refreshes while restoring a prior binding
- **WHEN** a client reconnects and its local project differs from `connection:init`
- **AND** it immediately sends `project:bind` to restore the prior project
- **THEN** the client MAY ignore interim `data:refresh` messages until `project:bound` confirms the restored binding
