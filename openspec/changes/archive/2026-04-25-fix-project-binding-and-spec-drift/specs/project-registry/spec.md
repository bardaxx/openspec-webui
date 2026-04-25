## MODIFIED Requirements

### Requirement: WebSocket connection initialization reflects the active project
The system SHALL send a WebSocket message with `type: 'connection:init'` and the current `activeProjectId` only to the connecting client immediately after that client connects so reconnecting clients can validate their current project context.

#### Scenario: Client reconnects after the active project changed
- **WHEN** a client reconnects after the global default project changed while it was disconnected
- **THEN** the first WebSocket message includes the current `activeProjectId`
- **AND** the client can reinitialize project-scoped state against that id
