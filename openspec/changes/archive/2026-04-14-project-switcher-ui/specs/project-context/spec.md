## MODIFIED Requirements

### Requirement: Provide dashboard and primary navigation context
The web UI SHALL provide an Obsidian-like three-pane layout with Activity Bar, Explorer Pane, and Main Viewer. The Dashboard page SHALL be accessible as a pinned `Dashboard` tab in the Main Viewer. When a project is active, the Activity Bar SHALL act as navigation rail plus Explorer toggle rather than current-project identity surface. The current project identity SHALL be displayed text-first: the Dashboard title SHALL show the current project name, and the Explorer Pane header SHALL show a folder icon plus the current project name. The Dashboard header SHALL include a `folder-pen` project switch button adjacent to the title. The Explorer Pane header SHALL include a `folder-pen` project switch button on the right. When the Explorer Pane is collapsed, the Activity Bar SHALL remain visible but the current project identity MAY be hidden until the pane is reopened. In narrow layout, the Activity Bar SHALL remain visible while the Explorer drawer opens to its right. Navigation highlighting SHALL be managed by the Activity Bar's active section indicator. The Dashboard SHALL render a workspace summary region with four metric cards ordered as Active Changes, Archive, Specs, and Tasks. The Specs summary card SHALL use the `FileText` icon so spec-related surfaces share a consistent visual cue. Selecting the Active Changes, Archive, or Specs cards SHALL focus the matching Explorer Pane section and reveal it when hidden without opening a standalone list page in the Main Viewer. Selecting the Tasks card SHALL focus the Dashboard / ACTIVE CHANGES context. The Dashboard SHALL render Active Changes with inline workspace command shortcuts in the section header (the count is already shown in the summary cards above, so a separate badge is omitted for consistency with Recent Activity), SHALL render Recent Activity as a full-width section beneath Active Changes when timestamp data is available, SHALL render the Recent Activity section header with a `History` icon to indicate chronological updates, SHALL render recent activity entries as dense cards rather than sparse full-width list rows, SHALL use recent-activity icon treatments that align with the summary cards for each content type (active change/info, archive/muted, spec/success), SHALL NOT render separate Quick Actions or Next Step panels, SHALL provide an actionable empty state when no active changes exist, and SHALL render project documentation when available. Activating the Project Documentation `Focus section` control SHALL scroll to the documentation section without changing Explorer Pane visibility. The Dashboard SHALL align with the Explorer Pane's ACTIVE CHANGES section as the `Dashboard` surface. When no project is active, the Dashboard SHALL NOT be displayed and the Main Viewer SHALL show the empty state instead.

#### Scenario: Open project selector from the Dashboard header
- **WHEN** the operator clicks the `folder-pen` button in the Dashboard header
- **THEN** the project selector opens

#### Scenario: Open project selector from the ExplorerPane header button
- **WHEN** the operator clicks the `folder-pen` button in the ExplorerPane header
- **THEN** the project selector opens
- **AND** the currently focused tab remains focused until the operator picks another project

#### Scenario: Collapsed explorer leaves navigation rail visible
- **WHEN** the Explorer Pane is collapsed in wide or medium layout
- **THEN** the Activity Bar remains visible
- **AND** the current project identity is no longer shown in the rail

#### Scenario: Narrow layout keeps Activity Bar visible beside the drawer
- **WHEN** the application is in narrow layout with an active project
- **THEN** the Activity Bar remains visible at the left edge
- **AND** opening the drawer shows the current project identity in the drawer header without hiding the rail

#### Scenario: No active project falls back to app identity
- **WHEN** no project is active
- **THEN** the top-left control shows the shared app icon
- **AND** the Main Viewer shows the empty state instead of the Dashboard
