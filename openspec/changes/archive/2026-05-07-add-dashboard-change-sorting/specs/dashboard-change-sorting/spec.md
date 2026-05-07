## ADDED Requirements

### Requirement: Dashboard Active Changes supports date and name sorting
The system SHALL allow operators to sort the dashboard Active Changes list by Date or Name. Date sorting SHALL be the default and SHALL order active changes by most recent modification first. Name sorting SHALL order active changes alphabetically by change name.

#### Scenario: Active Changes defaults to date sorting
- **WHEN** the dashboard renders the Active Changes list
- **THEN** the list is ordered by most recent modification first
- **AND** the sort control indicates Date sorting is active

#### Scenario: Operator sorts Active Changes by name
- **WHEN** the operator selects Name sorting for the dashboard Active Changes list
- **THEN** the list is reordered alphabetically by change name
- **AND** the sort control indicates Name sorting is active

### Requirement: Dashboard Recent Activity supports date and name sorting
The system SHALL allow operators to sort the dashboard Recent Activity list by Date or Name. Date sorting SHALL be the default and SHALL order activity items by most recent timestamp first. Name sorting SHALL order activity items alphabetically by their displayed item name.

#### Scenario: Recent Activity defaults to date sorting
- **WHEN** the dashboard renders the Recent Activity list
- **THEN** the list is ordered by most recent activity timestamp first
- **AND** the sort control indicates Date sorting is active

#### Scenario: Operator sorts Recent Activity by name
- **WHEN** the operator selects Name sorting for the dashboard Recent Activity list
- **THEN** the list is reordered alphabetically by displayed item name
- **AND** the sort control indicates Name sorting is active

### Requirement: Dashboard and explorer share sorting behavior
The system SHALL use a shared sorting base for dashboard and explorer date/name sorting so matching list item types use consistent date order, name order, and tie-breaker behavior.

#### Scenario: Shared date and name sorting is applied
- **WHEN** dashboard and explorer lists are sorted by Date or Name
- **THEN** shared sorting helpers define the ordering behavior
- **AND** explorer section defaults remain unchanged
*** Add File: /home/oikawa/CascadeProjects/openspec-webui/openspec/changes/add-dashboard-change-sorting/specs/explorer-pane/spec.md
## MODIFIED Requirements

### Requirement: Explorer Pane renders collapsible sections
The system SHALL render an Explorer Pane between the Activity Bar and the Main Viewer. The Explorer Pane SHALL use the `ExplorerSection` component for each of its three sections (ACTIVE CHANGES, ARCHIVE, SPECS). Each section SHALL pass its title, item count, collapse state, focused state, and header icon as props, and SHALL render section-specific content via slots. The ACTIVE CHANGES section SHALL use the `headerExtra` slot to render `CommandShortcutBar` when workspace commands exist and SHALL render a sort control that lets the operator choose `Date` or `Name` ordering. The ARCHIVE and SPECS sections SHALL also render the same `Date` / `Name` sort control in their section headers. Explorer list sorting SHALL use the shared date/name sorting base used by dashboard sorting while preserving existing explorer defaults and ordering behavior. Explorer list items SHALL NOT render leading per-item icons on the first line. No inline collapsible section header markup SHALL remain in `ExplorerPane.svelte` outside of the `ExplorerSection` component usage. Each list item SHALL use the `ExplorerSectionItem` component, which internally uses `ItemContextMenu` to provide context menu actions and handles click interactions. Each section SHALL pass `emptyMessage` props to `ExplorerSection` to handle empty states internally; the `emptyIcon` is determined internally by each ExplorerSection component reusing its section header icon.

#### Scenario: Explorer Pane uses ExplorerSection for ACTIVE CHANGES
- **WHEN** the Explorer Pane renders the ACTIVE CHANGES section
- **THEN** it renders an ExplorerSection with `title="Active Changes"`, `count` from the active changes store, and `open` from the layout store
- **AND** the section header icon is shown by the ExplorerSection component
- **AND** the `headerExtra` slot includes the CommandShortcutBar when workspace commands exist
- **AND** the section header includes a sort control with `Date` and `Name` options
- **AND** the section passes `emptyMessage="No active changes"` to ExplorerSection
- **AND** the ExplorerSection internally reuses its section header icon as the empty icon
- **AND** the default slot renders `ExplorerSectionItem` components for each active change
- **AND** each `ExplorerSectionItem` shows a compact second line with Calendar+date, FileText+delta count, CircleCheckBig+task progress, and a narrow progress bar

#### Scenario: Explorer Pane uses ExplorerSection for ARCHIVE
- **WHEN** the Explorer Pane renders the ARCHIVE section
- **THEN** it renders an ExplorerSection with `title="Archive"`, `count` from the archived changes store
- **AND** the section header icon is shown by the ExplorerSection component
- **AND** the section header includes a sort control with `Date` and `Name` options
- **AND** the section passes `emptyMessage="No archived changes"` to ExplorerSection
- **AND** the ExplorerSection internally reuses its section header icon as the empty icon
- **AND** the default slot renders `ExplorerSectionItem` components for each archived change
- **AND** each archived change name has the date prefix stripped in the visible label while preserving the full name in the tooltip
- **AND** each `ExplorerSectionItem` shows a compact second line with Calendar+date, FileText+delta count, CircleCheckBig+task progress, with no progress bar

#### Scenario: Explorer Pane uses ExplorerSection for SPECS
- **WHEN** the Explorer Pane renders the SPECS section
- **THEN** it renders an ExplorerSection with `title="Specs"`, `count` from the specs store
- **AND** the section header icon is shown by the ExplorerSection component
- **AND** the section header includes a sort control with `Date` and `Name` options
- **AND** the section passes `emptyMessage="No specs found"` to ExplorerSection
- **AND** the ExplorerSection internally reuses its section header icon as the empty icon
- **AND** the default slot renders `ExplorerSectionItem` components for each spec
- **AND** each `ExplorerSectionItem` shows a Calendar icon and last modification datetime on the second line
- **AND** no design-specific badge or marker is shown for spec entries

#### Scenario: Explorer sorting uses shared sorting base
- **WHEN** an explorer section sorts items by Date or Name
- **THEN** the ordering behavior is provided by the shared sorting base used by dashboard sorting
- **AND** the ACTIVE CHANGES and ARCHIVE sections still default to Date sorting
- **AND** the SPECS section still defaults to Name sorting
