## MODIFIED Requirements

### Requirement: Client-project binding on project switch
The system SHALL provide a WebSocket message type `project:bind` that a client can send to switch or confirm its bound project. Upon receiving `project:bind` with a valid project ID, the system SHALL increment the new project session's reference count (creating the session on demand if needed), decrement the old project session's reference count when the target differs from the current binding, update the client's binding, and send a `project:bound` message to the requesting client with the new project ID as `activeProjectId` and the project's current data. The `project:bound` message SHALL remain the authoritative acknowledgment that the client's project binding has changed, even when a REST workflow has already updated the global default project or the client's local selection state.

#### Scenario: Client switches to a different project
- **WHEN** a client sends `{ type: 'project:bind', projectId: 'def456' }`
- **AND** `def456` is a registered project
- **THEN** the new project's session refCount increments (session created if needed)
- **AND** the old project's session refCount decrements
- **AND** the client receives `{ type: 'project:bound', activeProjectId: 'def456', data: ... }`

#### Scenario: Client switches to an unregistered project
- **WHEN** a client sends `{ type: 'project:bind', projectId: 'nonexistent' }`
- **THEN** the client receives an error message
- **AND** the client's current binding remains unchanged

#### Scenario: Client confirms binding after API-driven project addition
- **WHEN** a client adds or reactivates a project through REST
- **AND** that workflow makes the same project the global default before the client has received `project:bound`
- **THEN** the client still sends `project:bind` for the created or reactivated project
- **AND** the server responds with `project:bound` containing that project's current data
- **AND** the client's project-scoped refresh runs only after that acknowledgment
