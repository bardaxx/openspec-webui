## MODIFIED Requirements

### Requirement: ExplorerSection component
The system SHALL provide an `ExplorerSection` component in `$lib/components/shared/explorer-section/` that renders a collapsible section with header and content area. The component SHALL accept `title` (string), `count` (number), an optional `section` (`ExplorerSection` type from the layout store), optional controlled props `open` (boolean), `focused` (boolean), `onToggle` (callback), an optional `icon`, an optional `emptyIcon`, an optional `headerExtra` slot, an optional `emptyMessage` (string), and a default slot for content. The header SHALL display the icon, title in uppercase tracking text, a count badge, and a chevron icon indicating collapsed/expanded state. When `section` is provided, the component SHALL derive open/focused state from `layoutStore` and update the section's collapse state through the section-aware layout actions. When `count === 0` and `emptyMessage` is provided, the component SHALL render an `EmptyState` with the given message and `emptyIcon ?? icon` instead of rendering the children slot. When `count > 0` or `emptyMessage` is not provided, the component SHALL render the children slot as before.

#### Scenario: Render expanded section
- **WHEN** an ExplorerSection is rendered with `title="Active Changes"`, `count={3}`, and `open={true}`
- **THEN** the section header shows the icon, title, count badge with "3", and a down chevron
- **AND** the content area is visible

#### Scenario: Render collapsed section
- **WHEN** an ExplorerSection is rendered with `title="Archive"`, `count={5}`, and `open={false}`
- **THEN** the section header shows the title, count badge with "5", and a right chevron
- **AND** the content area is hidden

#### Scenario: Toggle section in section-driven mode
- **WHEN** an ExplorerSection is rendered with `section="active-changes"` and the operator clicks the section header
- **THEN** the section open/closed state is updated through `layoutStore`

#### Scenario: Toggle section in controlled mode
- **WHEN** an ExplorerSection is rendered with `open` / `onToggle` props and the operator clicks the section header
- **THEN** `onToggle` is called

#### Scenario: Render header extra content
- **WHEN** an ExplorerSection is rendered with `headerExtra` content while open
- **THEN** the extra content appears beneath the main header row and above the collapsible content area

#### Scenario: Render focused section styling
- **WHEN** an ExplorerSection is rendered with `focused={true}`
- **THEN** the section container shows the current focused-section ring styling

#### Scenario: Render empty state when count is zero and emptyMessage is provided
- **WHEN** an ExplorerSection is rendered with `count={0}`, `emptyMessage="No active changes"`, and `icon={SquarePen}`
- **THEN** the content area shows an EmptyState with the message "No active changes" and the SquarePen icon
- **AND** the children slot is NOT rendered

#### Scenario: Render children when count is greater than zero
- **WHEN** an ExplorerSection is rendered with `count={3}` and `emptyMessage="No active changes"`
- **THEN** the children slot is rendered
- **AND** no EmptyState is shown

#### Scenario: Render children when emptyMessage is not provided
- **WHEN** an ExplorerSection is rendered with `count={0}` and no `emptyMessage`
- **THEN** the children slot is rendered (backward compatible)

## ADDED Requirements

### Requirement: Explorer section wrapper components
The system SHALL provide `ActiveChangesExplorerSection`, `ArchiveExplorerSection`, and `SpecsExplorerSection` in `$lib/components/shared/explorer-section/`. These wrapper components SHALL internally compose `ExplorerSection` with the shared internal `ExplorerSectionItem` helper so that callers only provide the section data collection and optional callbacks, not `title`, `icon`, `section`, `kind`, or context menu items manually. `ActiveChangesExplorerSection` SHALL additionally accept `headerExtra` for workspace command shortcuts. The module index SHALL export `ExplorerSection` and these three wrapper components.

The internal `ExplorerSectionItem` helper SHALL render an `ItemContextMenu` wrapping a `<button>` element. The button SHALL have `border-b border-border/50` for visual separation between list items. The helper SHALL apply active-state styling when the current active tab's path matches the item's `path`, and SHALL handle click events with preview/confirmed tab logic based on `uiPreferencesStore.previewTabsEnabled`.

#### Scenario: Active changes wrapper renders progress metadata
- **WHEN** `ActiveChangesExplorerSection` is rendered with active changes data and optional `headerExtra`
- **THEN** it renders `ExplorerSection` with the Active Changes title/icon/empty message
- **AND** each item is rendered via the internal `ExplorerSectionItem`
- **AND** each item shows date, spec delta count, task progress, and a narrow progress bar
- **AND** `headerExtra` appears beneath the section header when the section is open

#### Scenario: Archive wrapper renders formatted archive labels
- **WHEN** `ArchiveExplorerSection` is rendered with archived changes data
- **THEN** it renders `ExplorerSection` with the Archive title/icon/empty message
- **AND** each item is rendered via the internal `ExplorerSectionItem`
- **AND** the visible label strips the archive date prefix while the tooltip preserves the full change name

#### Scenario: Specs wrapper renders trailing Design badge
- **WHEN** `SpecsExplorerSection` is rendered with specs data
- **THEN** it renders `ExplorerSection` with the Specs title/icon/empty message
- **AND** each item is rendered via the internal `ExplorerSectionItem`
- **AND** an optional trailing Design badge may be rendered for specs with `design.md`

#### Scenario: Module exports wrapper components
- **WHEN** a component imports from `$lib/components/shared/explorer-section`
- **THEN** `ExplorerSection`, `ActiveChangesExplorerSection`, `ArchiveExplorerSection`, and `SpecsExplorerSection` are available
