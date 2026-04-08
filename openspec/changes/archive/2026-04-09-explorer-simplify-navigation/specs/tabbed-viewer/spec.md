## MODIFIED Requirements

### Requirement: Tab management system
The system SHALL provide a tab management store that maintains an ordered list of open tabs. Each tab SHALL have a unique ID, type (spec, change, or dashboard), display name, URL path, and optional pinned state. The store SHALL support operations: open tab, close tab, focus tab, reorder tabs, and pin/unpin tab. The Home tab (Dashboard) SHALL be pinned by default, SHALL always be present, and SHALL NOT be closable or unpinnable.

#### Scenario: Open a new tab
- **WHEN** the operator opens a spec that is not currently in a tab
- **THEN** a new tab is appended to the tab list
- **AND** the new tab becomes the active tab
- **AND** the tab content is rendered in the Main Viewer

#### Scenario: Focus an existing tab
- **WHEN** the operator clicks on an already-open tab
- **THEN** that tab becomes the active tab
- **AND** the Main Viewer shows its content
- **AND** no new tab is created

#### Scenario: Close a tab
- **WHEN** the operator closes a tab that is not the only tab
- **THEN** the tab is removed from the tab list
- **AND** the adjacent tab becomes active

#### Scenario: Close the last remaining tab falls back to Home
- **WHEN** the operator closes the only remaining non-pinned tab
- **THEN** the Home tab becomes active

#### Scenario: Home tab is pinned and cannot be closed
- **WHEN** the application loads
- **THEN** the Home tab is present and pinned
- **AND** the close button is not displayed on the Home tab

#### Scenario: Attempting to close the Home tab
- **WHEN** the operator attempts to close the Home tab
- **THEN** the Home tab remains open and pinned

#### Scenario: Direct URL load still keeps Home tab available
- **WHEN** the browser loads `/specs/authentication` or `/changes/login-feature` directly
- **THEN** a tab for the requested route is opened and made active
- **AND** the Home tab is still present and pinned in the tab bar

#### Scenario: Attempting to unpin the Home tab
- **WHEN** the operator attempts to unpin the Home tab
- **THEN** the Home tab remains pinned
- **AND** the Home tab remains open

### Requirement: Tab bar renders open tabs
The system SHALL render a tab bar at the top of the Main Viewer showing all open tabs. Each tab SHALL display its name. Non-pinned tabs SHALL display a close button. Pinned tabs SHALL NOT display a close button. The active tab SHALL be visually distinguished. Tabs SHALL be horizontally scrollable when they overflow the available width.

#### Scenario: Tab bar shows all open tabs
- **WHEN** three tabs are open
- **THEN** the tab bar shows three tab buttons with their names
- **AND** the active tab has a distinct visual style

#### Scenario: Pinned Home tab has no close button
- **WHEN** the tab bar renders with the Home tab
- **THEN** the Home tab is displayed with a pin icon indicating pinned state
- **AND** the close button is not shown on the Home tab

#### Scenario: Tab overflow scrolls horizontally
- **WHEN** more tabs are open than fit in the tab bar width
- **THEN** the tab bar becomes horizontally scrollable
- **AND** tabs beyond the visible area can be accessed by scrolling
