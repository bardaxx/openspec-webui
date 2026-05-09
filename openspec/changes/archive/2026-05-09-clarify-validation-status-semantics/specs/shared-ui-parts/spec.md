## ADDED Requirements

### Requirement: Shared validation status supports info state
The system SHALL provide shared validation status semantics for file-level `info` status in addition to not-run, passed, failed, warning, stale, and unknown. The `info` status SHALL use an informational icon and visual tone distinct from warning and failed states.

#### Scenario: Render info file status
- **WHEN** a validation target has only informational issues
- **THEN** shared validation status semantics provide an `info` label, icon, and informational tone
- **AND** warning and failed visual tones are not used for that target status

#### Scenario: Preserve issue severity semantics
- **WHEN** an individual validation issue has `INFO` severity
- **THEN** shared issue severity semantics continue to render it as issue-level `INFO`
- **AND** file-level `info` status remains a separate semantic concept
