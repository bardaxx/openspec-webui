## ADDED Requirements

### Requirement: Provide workflow selection cards in settings dialog
The settings dialog SHALL render each available workflow format option as a card-style radio choice that matches the visual selection pattern used by the Theme section. Each workflow card SHALL include an icon, a label, and a command-format preview, and SHALL visually highlight the selected option without changing the underlying workflow preference behavior.

#### Scenario: Show workflow format options as cards
- **WHEN** the operator opens the Workflow category in the settings dialog
- **THEN** each available workflow format option is shown as a card with an icon, label, and command preview
- **AND** the card selection affordance matches the Theme options in the same dialog

#### Scenario: Select a workflow from a card
- **WHEN** the operator selects one workflow card
- **THEN** that card becomes visually highlighted as the selected option
- **AND** the system stores the corresponding workflow preference value
- **AND** the Workflow section continues to show the command preview and help callout content
