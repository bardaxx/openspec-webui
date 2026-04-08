## MODIFIED Requirements

### Requirement: Activity Bar icons trigger explorer section or actions
The system SHALL respond to Activity Bar control clicks: the current project control SHALL open the project selector; the Home icon SHALL focus the Home tab in the Main Viewer and expand the Explorer Pane with the ACTIVE CHANGES section focused while collapsing ARCHIVE and SPECS; the Changes icon SHALL expand the Explorer Pane with the ARCHIVE section focused while collapsing ACTIVE CHANGES and SPECS; the Specs icon SHALL expand the Explorer Pane with the SPECS section focused while collapsing ACTIVE CHANGES and ARCHIVE; the Search icon SHALL show a search panel or command palette; the Settings icon SHALL open the settings dialog. When the operator clicks the icon for the currently active section while the Explorer Pane is expanded, the Explorer Pane SHALL toggle between expanded and collapsed. The highlighted Activity Bar icon SHALL follow the active explorer preset even when the current Main Viewer tab does not change. The Home icon SHALL focus the existing Home tab without opening a new tab. The Changes and Specs icons SHALL NOT open or focus tabs in the Main Viewer.

#### Scenario: Home icon focuses Home tab and expands explorer
- **WHEN** the operator clicks the Home icon and the explorer is collapsed or a different section is active
- **THEN** the Home tab is focused in the Main Viewer
- **AND** the Home icon is highlighted
- **AND** the Explorer Pane is expanded
- **AND** the ACTIVE CHANGES section is expanded and focused
- **AND** the ARCHIVE and SPECS sections are collapsed

#### Scenario: Home icon toggles explorer collapse
- **WHEN** the operator clicks the Home icon while it is already active and the Explorer Pane is expanded
- **THEN** the Explorer Pane collapses
- **AND** the Home icon remains highlighted
- **AND** the Home tab remains focused

#### Scenario: Changes icon focuses archive
- **WHEN** the operator clicks the Changes icon and it is not the current active section
- **THEN** the Explorer Pane is expanded
- **AND** the Changes icon is highlighted
- **AND** the ARCHIVE section is expanded and focused
- **AND** the ACTIVE CHANGES and SPECS sections are collapsed
- **AND** no tab is opened or focused in the Main Viewer

#### Scenario: Changes icon toggles explorer collapse
- **WHEN** the operator clicks the Changes icon while it is already active and the Explorer Pane is expanded
- **THEN** the Explorer Pane collapses
- **AND** the Changes icon remains highlighted

#### Scenario: Specs icon focuses specs
- **WHEN** the operator clicks the Specs icon and it is not the current active section
- **THEN** the Explorer Pane is expanded
- **AND** the Specs icon is highlighted
- **AND** the SPECS section is expanded and focused
- **AND** the ACTIVE CHANGES and ARCHIVE sections are collapsed
- **AND** no tab is opened or focused in the Main Viewer

#### Scenario: Specs icon toggles explorer collapse
- **WHEN** the operator clicks the Specs icon while it is already active and the Explorer Pane is expanded
- **THEN** the Explorer Pane collapses
- **AND** the Specs icon remains highlighted

#### Scenario: Current project control opens selector
- **WHEN** the operator clicks the current project control in the Activity Bar
- **THEN** the project selector opens
- **AND** the current view is not navigated away from

#### Scenario: Settings icon opens settings dialog
- **WHEN** the operator clicks the Settings icon
- **THEN** the settings dialog opens
- **AND** the current view is not navigated away from
