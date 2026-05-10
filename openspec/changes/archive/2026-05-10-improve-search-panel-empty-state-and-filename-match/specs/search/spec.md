## MODIFIED Requirements

### Requirement: Search the supported content sources only
The system SHALL search project markdown, spec markdown, and change proposal markdown, and SHALL also match each supported search source's document name and path/file identifier. The system SHALL return each hit with a result type, result name, and excerpt. When a query matches source metadata without matching markdown body content, the system SHALL still return that document once and SHALL provide result preview data that explains the metadata match.

#### Scenario: Return a spec match from the spec name
- **WHEN** the query matches a capability spec name even if the query does not appear in that spec's markdown body
- **THEN** the system returns a single `spec` result for that capability
- **AND** the result preview explains the metadata match instead of showing an unrelated body excerpt

#### Scenario: Return a change match from source metadata
- **WHEN** the query matches a change's source name or path even if the query does not appear in the proposal body
- **THEN** the system returns a single `change` result for that change
- **AND** selecting the result still opens the same change detail tab as before

#### Scenario: Deduplicate combined content and metadata matches
- **WHEN** a query matches both a supported document's metadata and its markdown body
- **THEN** the system returns that document only once in the Search result list
- **AND** existing result navigation behavior remains unchanged
