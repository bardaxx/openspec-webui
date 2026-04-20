## MODIFIED Requirements

### Requirement: Search the supported content sources only
The system SHALL search project markdown, spec markdown, and change proposal markdown, and SHALL return each hit with a result type, result name, source path, excerpt, and first-match line number.

#### Scenario: Return a project match
- **WHEN** the query matches the project document
- **THEN** the system returns a `project` result with a project excerpt and line number

#### Scenario: Return a spec match
- **WHEN** the query matches a capability specification document
- **THEN** the system returns a `spec` result whose display name is the capability name
