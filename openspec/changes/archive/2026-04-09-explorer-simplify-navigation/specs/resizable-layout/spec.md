## MODIFIED Requirements

### Requirement: Pane size constraints
The Explorer Pane SHALL have a minimum width of 180px and a maximum width of 600px. The Main Viewer SHALL have a minimum width of 300px.

#### Scenario: Prevent Explorer Pane from becoming too narrow
- **WHEN** the operator drags the divider to attempt making the Explorer Pane narrower than 180px
- **THEN** the divider stops at 180px

#### Scenario: Prevent Explorer Pane from becoming too wide
- **WHEN** the operator drags the divider to attempt making the Explorer Pane wider than 600px
- **THEN** the divider stops at 600px
