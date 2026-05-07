## MODIFIED Requirements

### Requirement: Tab bar renders open tabs
The system SHALL render a tab bar at the top of the Main Viewer showing all open tabs. The tab bar SHALL have a height of 48px (`h-12`) and apply `pl-2` so the first tab keeps a left-edge alignment with the Explorer panel's top project-selector row. This left-edge alignment is intentional because the tab strip should align with the Explorer panel content column rather than the Activity Bar icon center. Each tab SHALL display a file-type icon and its name. The tab style SHALL use a rounded-top tab shape (`rounded-t-md border border-b-0`) for the active tab. The active tab SHALL have a border on top and sides (`border-border`) and a background matching the content area (`bg-background`), with `-mb-px` to visually connect with the content below. Non-active tabs SHALL have no border and `bg-transparent` background. Non-active tabs SHALL show a muted background on hover (`bg-muted/50`). Each tab SHALL display a file-type icon: dashboard → `LayoutDashboard` icon in `text-muted-foreground`, spec → `FileText` icon in `text-success`, change (active) → `SquarePen` icon in `text-info`, change (archived) → `Archive` icon in `text-muted-foreground`, settings → `Settings` icon in `text-muted-foreground`. The icon for change tabs SHALL be dynamically determined by checking if the change exists in the `archivedChanges` store. Archived change tabs SHALL remove a leading `YYYY-MM-DD-` prefix from the visible tab label while preserving the full change name in routing and data lookup. Non-pinned tabs SHALL display a close button — always visible for the active tab, on hover only for non-active tabs. Pinned tabs SHALL display a clickable pin icon instead of a close button. Tab width SHALL have a minimum of 60px (`min-w-15`) with `shrink-0` to prevent infinite shrinking. Active tabs SHALL have a maximum width of 384px (`max-w-96`), while non-active tabs SHALL have a maximum width of 256px (`max-w-64`). Tabs SHALL be horizontally scrollable when they overflow the available width. The tab bar SHALL auto-scroll to the active tab when it changes.

#### Scenario: Activity Bar renders on page load with explorer toggle
- **WHEN** the application loads with an active project
- **THEN** the Activity Bar is visible at 48px width on the left edge
- **AND** it contains icon buttons for Dashboard, Archive, Specs, Search, and Settings
- **AND** each navigation icon renders at 20px size using `@lucide/svelte`

#### Scenario: Activity Bar renders no-project app identity
- **WHEN** the application loads without an active project
- **THEN** the bottom control renders the shared `app-icon.svg`
- **AND** activating the control does not open project selection or toggle the Explorer Pane

#### Scenario: Activity Bar has fixed width
- **WHEN** the application layout renders
- **THEN** the Activity Bar is 48px wide
- **AND** it remains 48px regardless of Explorer Pane state

#### Scenario: Settings tab renders with correct icon
- **WHEN** a settings tab is open in the tab bar
- **THEN** it displays the `Settings` icon from `@lucide/svelte` in `text-muted-foreground`
- **AND** it shows the localized settings label as the tab name

## ADDED Requirements

### Requirement: Tab type system supports settings tabs
The system SHALL support `settings` as a `TabType` value alongside `dashboard`, `spec`, and `change`. The `TabType` union SHALL be `'dashboard' | 'spec' | 'change' | 'settings'`. The tab store SHALL provide an `openSettings()` method that focuses an existing settings tab or creates a new one. The settings tab SHALL have `id: 'settings:home'`, `type: 'settings'`, `path: '/settings'`, `pinned: false`, and `preview: false` (a regular closeable tab). The `createTabForPath()` function SHALL NOT create settings tabs from URL paths; settings tabs are only created via `openSettings()`.

#### Scenario: openSettings creates new tab when none exists
- **WHEN** the operator calls `tabStore.openSettings()` and no settings tab exists
- **THEN** a new regular (non-pinned, non-preview) settings tab is created with type `settings`
- **AND** the tab becomes the active tab
- **AND** browser history is updated with path `/settings`

#### Scenario: openSettings focuses existing tab
- **WHEN** the operator calls `tabStore.openSettings()` and a settings tab already exists
- **THEN** the existing settings tab is focused
- **AND** no duplicate tab is created

#### Scenario: Settings tab is excluded from path-based tab creation
- **WHEN** a browser path of `/settings` is encountered via popstate or initial load
- **THEN** the system creates a dashboard tab instead of a settings tab
- **AND** `normalizePath()` maps `/settings` to the home path
