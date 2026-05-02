## MODIFIED Requirements

### Requirement: Start a local workspace session
The system SHALL start the WebUI without requiring a positional workspace path argument, SHALL default the port to `3001`, SHALL default the host to `127.0.0.1`, SHALL bind to the host specified by `--host <address>` when provided, SHALL bootstrap the current working directory when it points to a valid OpenSpec project root (or its `openspec/` directory). If the current working directory is not a valid OpenSpec project, the system SHALL still start normally and leave project selection to the UI. The user-facing `package.json` scripts surface SHALL be limited to the essential development commands: `dev`, `build`, `test`, and `typecheck`. npm lifecycle hooks such as `prepublishOnly` MAY remain. The CLI version displayed by `openspec-webui --version` SHALL match the current published package version defined by the package metadata source of truth.

#### Scenario: Start with default localhost binding
- **WHEN** the operator runs `openspec-webui` without `--host`
- **THEN** the system binds to `127.0.0.1`
- **AND** the browser opens to `http://127.0.0.1:3001`

#### Scenario: Bind to all interfaces for network access
- **WHEN** the operator runs `openspec-webui --host 0.0.0.0`
- **THEN** the system binds to `0.0.0.0`
- **AND** the browser opens to `http://localhost:3001` (not `0.0.0.0`)

#### Scenario: Start from a valid current working directory
- **WHEN** the operator runs `openspec-webui` from `/home/user/my-repo`
- **AND** the current working directory is a valid OpenSpec project
- **THEN** the system starts normally
- **AND** bootstraps that project into the registry as the active project

#### Scenario: Start from a non-project current working directory
- **WHEN** the operator runs `openspec-webui` from a directory without an `openspec/` subdirectory
- **THEN** the system starts normally
- **AND** no project is auto-added from the working directory

#### Scenario: Reject an occupied port
- **WHEN** the operator starts the UI on a port that is already in use
- **THEN** the system reports that the port is already in use
- **AND** suggests trying another port

#### Scenario: README describes installation and usage for npm users
- **WHEN** a user visits the GitHub repository or npm page
- **THEN** the README SHALL provide clear installation instructions (`npm install -g openspec-webui` or `npx openspec-webui`)
- **AND** SHALL provide basic usage instructions (CLI commands, options including `--host`)
- **AND** SHALL include a separate section for contributors (dev setup, build, test)

#### Scenario: Display version from package metadata
- **WHEN** the operator runs `openspec-webui --version`
- **THEN** the displayed version matches the current package version published from the package metadata source of truth

### Requirement: Manage browser launch and session controls
The system SHALL open the browser to the running UI by default using a localhost URL, SHALL skip auto-opening when `--no-open` is supplied, SHALL reopen the current UI URL with localhost when the operator presses `l` in an interactive terminal session even when bound to `0.0.0.0`, and SHALL shut down cleanly on `Ctrl+C`.

#### Scenario: Auto-open the browser on startup
- **WHEN** the operator starts the UI without `--no-open`
- **THEN** the system launches the default browser to `http://localhost:<port>` (or the bound host if not `0.0.0.0`)

#### Scenario: Auto-open with 0.0.0.0 binding uses localhost
- **WHEN** the operator starts the UI with `--host 0.0.0.0` without `--no-open`
- **THEN** the browser opens to `http://localhost:<port>` instead of `http://0.0.0.0:<port>`

#### Scenario: Skip browser auto-open
- **WHEN** the operator starts the UI with `--no-open`
- **THEN** the system starts the local server without launching a browser window

#### Scenario: Reopen the UI from the terminal
- **WHEN** the server is running in an interactive terminal and the operator presses `l`
- **THEN** the system launches the current UI URL in the browser using localhost
