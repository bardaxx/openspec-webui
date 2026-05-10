## ADDED Requirements

### Requirement: Badge component supports informational status tone
The system SHALL provide an `info` variant in `$lib/components/ui/badge/` for shared status and severity indicators that need an informational tone distinct from `secondary`, `warning`, and `destructive`.

#### Scenario: Render informational badge tone
- **WHEN** a shared status or severity surface renders `<Badge variant="info">`
- **THEN** the badge uses the informational palette rather than the muted secondary palette

#### Scenario: Shared validation indicators reuse informational badge tone
- **WHEN** shared validation status or severity semantics render file-level or issue-level `info` in badge format
- **THEN** they can use the shared Badge `info` variant without local one-off classes
