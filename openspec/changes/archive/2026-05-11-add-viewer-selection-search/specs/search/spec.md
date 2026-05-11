## MODIFIED Requirements

### Requirement: Search requests from contextual entry points use Explorer search
The system SHALL route search requests initiated from context menu actions, viewer selection search actions, and `Spec.md` keyword search affordances into the Explorer Pane Search panel using the same query forwarding, immediate execution, result display, and result selection behavior as existing contextual Explorer searches.

#### Scenario: Context menu search populates Explorer search
- **WHEN** the operator chooses a context menu action that searches for an item-related keyword
- **THEN** the Explorer Pane opens if collapsed
- **AND** the Explorer Pane switches to the Search panel
- **AND** the search input contains the requested keyword
- **AND** matching results appear in the Search panel

#### Scenario: ChangeViewer selection search populates Explorer search
- **WHEN** the operator selects a valid keyword in ChangeViewer and chooses `Search`
- **THEN** the Explorer Pane opens if collapsed
- **AND** the Explorer Pane switches to the Search panel
- **AND** the search input contains the trimmed selected keyword
- **AND** matching results appear in the Search panel

#### Scenario: SpecViewer selection search populates Explorer search
- **WHEN** the operator selects a valid keyword in SpecViewer and chooses `Search`
- **THEN** the Explorer Pane opens if collapsed
- **AND** the Explorer Pane switches to the Search panel
- **AND** the search input contains the trimmed selected keyword
- **AND** matching results appear in the Search panel

#### Scenario: Spec keyword search populates Explorer search
- **WHEN** the operator invokes keyword search from `Spec.md` content
- **THEN** the Explorer Pane opens if collapsed
- **AND** the Explorer Pane switches to the Search panel
- **AND** the search input contains the requested keyword
- **AND** matching results appear in the Search panel
