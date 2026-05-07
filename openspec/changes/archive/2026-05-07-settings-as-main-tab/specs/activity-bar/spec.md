## MODIFIED Requirements

### Requirement: Activity Bar icons trigger explorer section or actions
The system SHALL respond to Activity Bar control clicks: the bottom Explorer control SHALL toggle the Explorer Pane open and closed without changing the active explorer preset when an active project exists; the Dashboard icon SHALL focus the Dashboard tab in the Main Viewer and expand the Explorer Pane with the ACTIVE CHANGES section focused while collapsing ARCHIVE and SPECS; the Archive icon SHALL expand the Explorer Pane with the ARCHIVE section focused while collapsing ACTIVE CHANGES and SPECS; the Specs icon SHALL expand the Explorer Pane with the SPECS section focused while collapsing ACTIVE CHANGES and ARCHIVE; the Search icon SHALL show a search panel or command palette; the Settings icon SHALL open the settings tab in the Main Viewer. When the operator clicks the icon for the currently active section while its explorer surface is already open, the Explorer Pane SHALL toggle between expanded and collapsed in wide layout or between open and closed drawer states in narrow layout. The highlighted Activity Bar icon SHALL follow the active explorer preset even when the current Main Viewer tab does not change. The Dashboard icon SHALL focus the existing Dashboard tab without opening a new tab. The Archive and Specs icons SHALL NOT open or focus tabs in the Main Viewer.

#### Scenario: Explorer toggle opens collapsed pane
- **WHEN** the operator activates the bottom Explorer control while the Explorer Pane is collapsed
- **THEN** the Explorer Pane opens without changing the active explorer preset

#### Scenario: Explorer toggle closes expanded pane
- **WHEN** the operator activates the bottom Explorer control while the Explorer Pane is open
- **THEN** the Explorer Pane closes

#### Scenario: Explorer toggle is inert without active project
- **WHEN** the operator activates the bottom Explorer control while no project is active
- **THEN** no explorer or navigation state changes

#### Scenario: Dashboard icon focuses active changes
- **WHEN** the operator clicks the Dashboard icon
- **THEN** the Explorer Pane opens with the Dashboard tab focused
- **AND** the ACTIVE CHANGES section is expanded and focused
- **AND** the ARCHIVE and SPECS sections are collapsed

#### Scenario: Dashboard icon toggles explorer visibility
- **WHEN** the operator clicks the Dashboard icon while it is already active and the explorer surface is open
- **THEN** the explorer surface closes in the current responsive layout
- **AND** the Dashboard icon remains highlighted
- **AND** the Dashboard tab remains focused

#### Scenario: Archive icon focuses archive section
- **WHEN** the operator clicks the Archive icon
- **THEN** the Explorer Pane opens with the Archive section focused
- **AND** the ACTIVE CHANGES and SPECS sections are collapsed
- **AND** no tab is opened or focused in the Main Viewer

#### Scenario: Archive icon toggles explorer visibility
- **WHEN** the operator clicks the Archive icon while it is already active and the explorer surface is open
- **THEN** the explorer surface closes in the current responsive layout
- **AND** the Archive icon remains highlighted

#### Scenario: Specs icon focuses specs
- **WHEN** the operator clicks the Specs icon
- **THEN** the Explorer Pane opens with the Specs section focused
- **AND** the ACTIVE CHANGES and ARCHIVE sections are collapsed
- **AND** no tab is opened or focused in the Main Viewer

#### Scenario: Specs icon toggles explorer visibility
- **WHEN** the operator clicks the Specs icon while it is already active and the explorer surface is open
- **THEN** the explorer surface closes in the current responsive layout
- **AND** the Specs icon remains highlighted

#### Scenario: No-project app identity stays inert
- **WHEN** the operator clicks the bottom control in the Activity Bar while no project is active
- **THEN** no project selector opens
- **AND** the current view is not navigated away from
- **AND** no Explorer Pane state changes

#### Scenario: Settings icon opens settings tab
- **WHEN** the operator clicks the Settings icon in the Activity Bar
- **THEN** a settings tab opens in the Main Viewer
- **AND** the settings tab becomes the active tab
- **AND** no overlay or modal is displayed

#### Scenario: Settings icon focuses existing settings tab
- **WHEN** the operator clicks the Settings icon while a settings tab is already open
- **THEN** the existing settings tab is focused
- **AND** no duplicate tab is created

### Requirement: Activity Bar tooltips
The system SHALL display a tooltip on hover for each Activity Bar icon and the bottom control, showing the control name (e.g., `Explorer`, `Dashboard`, `Specs`, `Archive`, `Search`, `Settings`, or the app name when no project is active).

#### Scenario: Show tooltip on explorer toggle hover
- **WHEN** the operator hovers over the bottom Explorer control with an active project
- **THEN** a tooltip appears showing whether the control will open or close the Explorer Pane
- **AND** the tooltip disappears when the cursor leaves the control

#### Scenario: Show tooltip on app identity hover
- **WHEN** the operator hovers over the bottom control with no active project
- **THEN** a tooltip appears showing the app name

## REMOVED Requirements

### Requirement: Settings icon opens settings dialog
**Reason**: Settings is now a main tab instead of a modal overlay
**Migration**: The Settings icon now opens a settings tab via `tabStore.openSettings()` instead of toggling `layoutStore.overlay === 'settings'`
