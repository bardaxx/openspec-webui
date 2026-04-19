## MODIFIED Requirements

### Requirement: ExplorerSection component
The system SHALL provide an `ExplorerSection` component in `$lib/components/shared/explorer-section/` that renders a collapsible section with header and content area. The component SHALL accept `title` (string), `count` (number), `open` (boolean), `focused` (boolean, optional), `onToggle` (callback), an optional `icon`, an optional `headerExtra` slot, `emptyMessage` (string, optional), `emptyIcon` (Component, optional), and a default slot for content. The header SHALL display the icon, title in uppercase tracking-wider text, a count badge, and a chevron icon indicating collapsed/expanded state. When `emptyMessage` is provided and the children snippet produces no content (i.e., the section is empty), the component SHALL render an `EmptyState` with the `emptyMessage` and optional `emptyIcon` instead of rendering the children.

#### Scenario: Render expanded section
- **WHEN** an ExplorerSection is rendered with `title="ACTIVE CHANGES"`, `count={3}`, and `open={true}`
- **THEN** the section header shows the icon, title, count badge with "3", and a down chevron
- **AND** the content area is visible

#### Scenario: Render collapsed section
- **WHEN** an ExplorerSection is rendered with `title="ARCHIVE"`, `count={5}`, and `open={false}`
- **THEN** the section header shows the title, count badge with "5", and a right chevron
- **AND** the content area is hidden

#### Scenario: Toggle section
- **WHEN** the operator clicks the section header
- **THEN** `onToggle` is called

#### Scenario: Render header extra content
- **WHEN** an ExplorerSection is rendered with `headerExtra` content
- **THEN** the extra content appears beneath the main header row and above the collapsible content area

#### Scenario: Render focused section styling
- **WHEN** an ExplorerSection is rendered with `focused={true}`
- **THEN** the section container shows the current focused-section ring styling

#### Scenario: Render empty state when emptyMessage provided and no items
- **WHEN** an ExplorerSection is rendered with `emptyMessage="No active changes"`, `emptyIcon={SquarePen}`, and `open={true}` with no children rendered
- **THEN** the section body shows an EmptyState with the provided message and icon
- **AND** no children content area is rendered

#### Scenario: Render children when items exist even with emptyMessage
- **WHEN** an ExplorerSection is rendered with `emptyMessage="No active changes"` and children snippet produces content
- **THEN** the section body shows the children content
- **AND** no EmptyState is rendered
