## ADDED Requirements

### Requirement: Card surface primitives
The system SHALL provide reusable Card surface primitives in `$lib/components/ui/card/` for standard container, header, title, description, content, and footer layouts. Feature surfaces that use the shared Card pattern SHALL compose these primitives directly or through thin shared wrappers instead of duplicating feature-local card container markup.

#### Scenario: Import Card primitives from shared UI
- **WHEN** a feature component imports from `$lib/components/ui/card/`
- **THEN** `Root`, `Header`, `Title`, `Description`, `Content`, and `Footer` are available
- **AND** they can be composed into a bordered card surface with shared card styling

#### Scenario: Shared wrapper builds on Card primitives
- **WHEN** a reusable feature-neutral card wrapper is added under `$lib/components/shared/`
- **THEN** it composes the shared Card primitives or their class pattern
- **AND** it does not reintroduce a separate feature-local card foundation
