## MODIFIED Requirements

### Requirement: Provide dashboard and primary navigation context
The web UI SHALL provide an Obsidian-like three-pane layout with Activity Bar, Explorer Pane, and Main Viewer. The Dashboard page SHALL be accessible as a pinned `Dashboard` tab in the Main Viewer. When a project is active, the Activity Bar SHALL act as navigation rail plus Explorer toggle rather than current-project identity surface. The current project identity SHALL be displayed text-first: the Dashboard title SHALL show the current project name, and the Explorer Pane header SHALL show a folder icon plus the current project name. The Dashboard header SHALL include a `folder-pen` project switch button adjacent to the title. The Explorer Pane header SHALL include a `folder-pen` project switch button on the right. When the Explorer Pane is collapsed, the Activity Bar SHALL remain visible but the current project identity MAY be hidden until the pane is reopened. In narrow layout, the Activity Bar SHALL remain visible while the Explorer drawer opens to its right. Navigation highlighting SHALL be managed by the Activity Bar's active section indicator. The Dashboard SHALL render a workspace summary region with four metric cards ordered as Active Changes, Archive, Specs, and Tasks. The Specs summary card SHALL use the `FileText` icon so spec-related surfaces share a consistent visual cue. The Dashboard summary cards, section containers, recent activity cards, active change cards, and planning-context containers SHALL use the shared Card surface pattern or thin wrappers built on that pattern instead of feature-local inline card foundations. Selecting the Active Changes, Archive, or Specs cards SHALL focus the matching Explorer Pane section and reveal it when hidden without opening a standalone list page in the Main Viewer. Selecting the Tasks card SHALL focus the Dashboard / ACTIVE CHANGES context. The Dashboard SHALL render Active Changes with inline workspace command shortcuts in the section header (the count is already shown in the summary cards above, so a separate badge is omitted for consistency with Recent Activity), SHALL render Recent Activity as a full-width section beneath Active Changes when timestamp data is available, SHALL render the Recent Activity section header with a `History` icon to indicate chronological updates, SHALL render recent activity entries as dense cards rather than sparse full-width list rows, SHALL use recent-activity icon treatments that align with the summary cards for each content type (active change/info, archive/muted, spec/success), SHALL use each entry's last modification datetime as the chronological key for active changes, archived changes, and specs, SHALL display those timestamps in canonical `YYYY-MM-DD HH:mm` format reflecting the browser's local timezone, SHALL NOT render separate Quick Actions or Next Step panels, SHALL provide an actionable empty state when no active changes exist, and SHALL render project documentation when available. Activating the Project Documentation `Focus section` control SHALL scroll to the documentation section without changing Explorer Pane visibility. The Dashboard SHALL align with the Explorer Pane's ACTIVE CHANGES section as the `Dashboard` surface. When no project is active, the Dashboard SHALL NOT be displayed and the Main Viewer SHALL show the empty state instead.

#### Scenario: Render the Dashboard tab
- **WHEN** the operator clicks the Dashboard icon in the Activity Bar
- **AND** an active project exists
- **THEN** the Dashboard tab is focused in the Main Viewer
- **AND** the Dashboard shows summary cards in the order Active Changes, Archive, Specs, and Tasks
- **AND** the Dashboard shows the Active Changes section with inline command shortcuts
- **AND** the Dashboard shows Recent Activity in the main dashboard flow beneath Active Changes when recent items exist
- **AND** the Dashboard renders the planning-context block

#### Scenario: Render planning context from valid config.yaml
- **WHEN** the operator views the Dashboard for an active project with readable and valid `config.yaml`
- **THEN** the planning-context block identifies `openspec/config.yaml` as the planning source
- **AND** shows `AI Context`, `Artifact Rules`, and `Workflow Schema` in that order

#### Scenario: Render diagnostics for invalid config.yaml
- **WHEN** the operator views the Dashboard for an active project whose `config.yaml` is readable but malformed
- **THEN** the planning-context block identifies `openspec/config.yaml` as the planning source
- **AND** shows an invalid-config callout explaining that structured planning data is unavailable
- **AND** shows parse error details together with the raw `config.yaml` text

#### Scenario: Show an empty artifact rules state
- **WHEN** the active project's valid `config.yaml` contains no artifact-specific rules
- **THEN** the `Artifact Rules` section shows an explicit empty state

#### Scenario: Show migration warning when only legacy context is populated
- **WHEN** the operator views the Dashboard for an active project whose valid `config.yaml` has empty `AI Context`
- **AND** deprecated supplemental `project.md` documentation exists
- **THEN** the planning-context block shows migration-focused warning copy
- **AND** does not show `No project.md file found`

#### Scenario: Show legacy project.md as collapsed deprecated disclosure
- **WHEN** deprecated supplemental `project.md` documentation exists for the active project
- **THEN** the planning-context block shows a collapsed disclosure labeled `Legacy project.md (Deprecated)`

#### Scenario: Summary cards focus Explorer sections
- **WHEN** the operator activates the Archive or Specs summary card on Dashboard
- **THEN** the matching Explorer Pane section is expanded and focused
- **AND** the Main Viewer remains on the Dashboard tab instead of opening a standalone list page

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

#### Scenario: Show an empty active changes state
- **WHEN** the workspace has no active changes
- **THEN** the Dashboard shows `No active changes`

#### Scenario: Browse recent dashboard activity
- **WHEN** at least one change or spec exposes a timestamp for recent activity
- **THEN** the Dashboard shows recent activity entries ordered from newest to oldest by last modification datetime
- **AND** archived changes use the same `lastModified` source as active changes rather than archive-date-only ordering
- **AND** selecting an entry opens the corresponding tab and focuses the related Explorer section

#### Scenario: Recent activity shows canonical datetime format
- **WHEN** the Dashboard renders a recent activity item with a `lastModified` datetime
- **THEN** its metadata shows a Calendar icon and the datetime in canonical `YYYY-MM-DD HH:mm` format reflecting the browser's local timezone
- **AND** the displayed format remains `YYYY-MM-DD HH:mm` after switching between supported locales
