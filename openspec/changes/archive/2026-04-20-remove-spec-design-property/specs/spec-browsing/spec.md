## MODIFIED Requirements

### Requirement: Catalog capability specs
The system SHALL discover capability directories under `specs/`, sort them alphabetically, and display them in the Explorer Pane's SPECS collapsible section.

#### Scenario: List available capabilities in Explorer
- **WHEN** the workspace contains one or more spec capability directories
- **THEN** the Explorer Pane's SPECS section lists them in alphabetical order
- **AND** each entry shows the capability name

#### Scenario: Show an empty spec list in Explorer
- **WHEN** the workspace contains no spec capability directories
- **THEN** the Explorer Pane's SPECS section shows `No specifications found`

## REMOVED Requirements

### Requirement: Render spec and design content
**Reason**: `design.md` is a change-level artifact, not a spec-level sibling file. Keeping a spec requirement for spec-level design tabs preserves the incorrect data model and causes misleading labels, badges, and translations across the UI.
**Migration**: Replace this requirement with `Render spec content`, which renders `spec.md` only and removes any Design sub-tab behavior from SpecViewer.

## ADDED Requirements

### Requirement: Render spec content
The system SHALL load a spec by capability name when the operator clicks it in the Explorer Pane, SHALL open a tab in the Main Viewer rendering `spec.md` content, and SHALL display the spec's last modification date using the same compact metadata style as other views: a Calendar icon followed by the formatted date when available, or `Specification` as fallback. The SpecViewer heading icon SHALL use the same `FileText`-based success color treatment as the Dashboard Specs summary card so spec surfaces share a consistent visual identity.

#### Scenario: View a capability spec
- **WHEN** the operator clicks a capability that has `spec.md` in the Explorer Pane
- **THEN** a tab opens in the Main Viewer
- **AND** the tab renders the specification content
- **AND** no design sub-tab is shown
- **AND** the header subtitle shows a Calendar icon and the formatted last modification date
- **AND** the heading icon uses the shared spec color treatment
