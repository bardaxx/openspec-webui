## MODIFIED Requirements

### Requirement: Watch relevant OpenSpec files and directories
The system SHALL watch the OpenSpec project directory for each active session's project. Each session SHALL have its own independent chokidar watcher. The watcher SHALL treat supported markdown files, `project.md`, `AGENTS.md`, and `config.yaml` as relevant project files. Each watcher SHALL ignore dotfiles, `node_modules`, and other unsupported files. Each watcher SHALL classify relevant updates as affecting `project`, `specs`, or `changes`. Watchers SHALL be created on session activation and closed when the session's reference count reaches zero.

#### Scenario: Ignore unsupported file changes
- **WHEN** a file event occurs for a file other than supported markdown files or `config.yaml` in any watched project
- **THEN** the watcher ignores the event

#### Scenario: Classify a config change as project-scoped
- **WHEN** a file event occurs for `config.yaml` in a watched project
- **THEN** the system classifies the update as affecting `project`

#### Scenario: Classify a spec file change
- **WHEN** a file event occurs under `specs/<capability>/` in a watched project
- **THEN** the system classifies the update as affecting `specs`
- **AND** uses the capability directory name as the affected entity ID

#### Scenario: Classify a change directory event
- **WHEN** a directory is added or removed under `changes/` or `changes/archive/` in a watched project
- **THEN** the system classifies the update as affecting `changes`

#### Scenario: Multiple watchers for multiple active projects
- **WHEN** project A and project B both have active sessions with bound clients
- **THEN** both projects have independent chokidar watchers running simultaneously
- **AND** file changes in project A do not trigger events for project B's clients

### Requirement: Reparse and broadcast refresh events
On every relevant watcher event for an active session's project, the system SHALL reparse that project's full workspace, SHALL retain the fresh in-memory data set when parsing succeeds, and SHALL route a `data:refresh` WebSocket message only to clients bound to that project. The message SHALL identify the affected entity and entity ID. When a client binds to a project via `project:bind`, the system SHALL send a `project:bound` WebSocket message containing the new project ID and current data to the requesting client only. When a WebSocket client connects or reconnects, the system SHALL send a `connection:init` WebSocket message containing the client's bound project ID.

#### Scenario: Broadcast a change refresh after a markdown edit
- **WHEN** a markdown file changes inside a change directory in project A
- **THEN** the system reparses project A's workspace
- **AND** sends a `data:refresh` event for the `changes` entity only to clients bound to project A

#### Scenario: Broadcast a project refresh after config change
- **WHEN** `config.yaml` changes in project A
- **THEN** the system reparses project A's workspace
- **AND** sends a `data:refresh` event for the `project` entity only to clients bound to project A

#### Scenario: Keep prior data on failed reparses
- **WHEN** a watcher-triggered reparse fails for a project
- **THEN** the system does not replace the previously loaded in-memory data

#### Scenario: Client switches project via bind message
- **WHEN** a client sends a `project:bind` WebSocket message with a valid project ID
- **THEN** the system sends a `project:bound` event to that client only with the new project ID and data
- **AND** other clients are unaffected

#### Scenario: Send bound project on websocket connect
- **WHEN** a websocket client connects
- **THEN** the system sends a `connection:init` websocket event containing the client's bound `activeProjectId`
