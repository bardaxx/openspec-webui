## ADDED Requirements

### Requirement: Settings view renders as a main tab with scrollable section layout
The system SHALL render settings as a regular (non-pinned, non-preview) tab in the Main Viewer. The settings tab SHALL have type `settings`, id `settings:home`, and display a `Settings` icon in the tab bar. The tab SHALL NOT be pinned and SHALL display a close button like other regular tabs. The settings view SHALL be rendered inside the same centered `max-w-7xl px-4 py-6 lg:px-6` page frame used by Dashboard. Inside that frame, the settings view SHALL use a two-column layout: a left section menu (14rem wide on large screens) and a right scrollable content area. The right content area SHALL render all settings sections in a single scrollable container rather than conditionally showing one section at a time. Each section card SHALL have an HTML anchor `id` for scroll targeting. The left menu buttons SHALL call `scrollIntoView({ behavior: 'smooth' })` on the corresponding section anchor when clicked. The currently visible section SHALL be tracked via `IntersectionObserver` and highlighted in the left menu. On narrow viewports, the left menu SHALL stack above the content area and scroll horizontally if needed.

#### Scenario: Opening settings from Activity Bar
- **WHEN** the operator clicks the Settings icon in the Activity Bar
- **THEN** a regular (non-pinned, non-preview) settings tab opens in the Main Viewer
- **AND** the settings tab becomes the active tab
- **AND** if a settings tab already exists, it is focused without creating a duplicate

#### Scenario: Settings tab is closeable
- **WHEN** the settings tab is rendered in the Tab Bar
- **THEN** it displays a close button (not a pin icon)
- **AND** the operator can close the tab by clicking the close button

#### Scenario: Section menu scrolls to section
- **WHEN** the operator clicks a section menu button (e.g., "General")
- **THEN** the right content area scrolls smoothly to the corresponding section
- **AND** the clicked menu item becomes highlighted as active

#### Scenario: Active section tracks scroll position
- **WHEN** the operator manually scrolls the settings content
- **THEN** the left menu highlights the section currently most visible in the viewport

#### Scenario: Responsive layout on narrow viewport
- **WHEN** the settings view is rendered in a narrow viewport (below `lg` breakpoint)
- **THEN** the section menu stacks above the content area
- **AND** the menu items are displayed horizontally
- **AND** the content area remains scrollable

#### Scenario: Settings tab shows correct icon in tab bar
- **WHEN** the settings tab is rendered in the Tab Bar
- **THEN** it displays the `Settings` icon from `@lucide/svelte`
- **AND** the icon uses `text-muted-foreground` color

### Requirement: Settings view contains all existing settings sections
The system SHALL render the following sections in order: General, Workflow, Commands, and Versions. Each section SHALL preserve the exact same content and controls as the current `SettingsModal.svelte` implementation. Each top-level section SHALL be visually separated as a card section with a `<h2>` heading, and the section card SHALL carry the anchor `id` used for scroll targeting. Nested version status groups SHOULD use inset panels for visual hierarchy.

#### Scenario: General section renders theme, language, and explorer options
- **WHEN** the settings view is rendered
- **THEN** the General section contains theme selection (light/dark/system), language selector, and explorer preview tabs toggle
- **AND** all controls function identically to the current modal implementation

#### Scenario: Workflow section renders command format options
- **WHEN** the settings view is rendered
- **THEN** the Workflow section contains command format selection (standard/claude-code/skill)
- **AND** the workspace and change command preview is displayed

#### Scenario: Commands section renders command visibility toggles
- **WHEN** the settings view is rendered
- **THEN** the Commands section contains core and expanded command visibility toggles
- **AND** command availability status is displayed

#### Scenario: Versions section renders tool version status
- **WHEN** the settings view is rendered
- **THEN** the Versions section contains version status for WebUI and OpenSpec CLI
- **AND** update commands with copy buttons are displayed
