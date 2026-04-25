## MODIFIED Requirements

### Requirement: Activity Bar tooltips
The system SHALL display a tooltip on hover for each Activity Bar icon and the bottom control, showing the control name (e.g., `Explorer`, `Dashboard`, `Specs`, `Archive`, `Search`, `Settings`, or the no-project selector label).

#### Scenario: Show tooltip on explorer toggle hover
- **WHEN** the operator hovers over the bottom Explorer control with an active project
- **THEN** a tooltip appears showing whether the control will open or close the Explorer Pane
- **AND** the tooltip disappears when the cursor leaves the control
