## ADDED Requirements

### Requirement: Icon component for SVG icons
The system SHALL provide an `Icon` Svelte component that renders SVG icons by name prop. The component SHALL support the icon names used by the current UI, including `gear`, `close`, `chevron-left`, `chevron-right`, `command-line`, `list-check`, `document`, `archive-box`, `check-circle`, `circle`, `pencil-square`, `clipboard`, `pencil`, `trash`, and `document-arrow`. The component SHALL accept `class` and `size` props for styling. All SVG icons SHALL use `currentColor` for stroke/fill to inherit text color.

#### Scenario: Render a gear icon
- **WHEN** the `Icon` component is used with `name="gear"`
- **THEN** the gear SVG icon is rendered with the provided class and size

#### Scenario: Icon inherits text color
- **WHEN** the `Icon` component is wrapped in an element with `text-on-surface-muted` class
- **THEN** the icon's stroke color matches the muted text color

#### Scenario: Icon accepts custom class
- **WHEN** the `Icon` component receives `class="h-5 w-5"`
- **THEN** the rendered SVG element has the specified dimensions

### Requirement: Two-column settings layout
The settings modal SHALL use a two-column layout with a left sidebar listing setting categories (`General`, `AI Tool`, `Commands`) and a right content area showing the selected category's settings. Selecting a category in the sidebar SHALL update the right content area without closing the modal. On narrower widths where the sidebar stacks above the content, the category buttons SHALL render in a horizontal row with equal widths. The sidebar buttons SHALL use a simplified presentation with icon and label only.

#### Scenario: Show General settings by default
- **WHEN** the settings modal opens
- **THEN** the General category is selected in the left sidebar
- **AND** the right content area shows the Appearance (theme) settings

#### Scenario: Switch to AI Tool settings
- **WHEN** the user clicks the AI Tool category in the left/sidebar navigation
- **THEN** the right content area shows the AI Tool settings
- **AND** the General and Expanded Commands settings are hidden

#### Scenario: Switch to Commands settings
- **WHEN** the user clicks the Commands category in the left/sidebar navigation
- **THEN** the right content area shows the Expanded Commands settings
- **AND** the General and AI Tool settings are hidden

#### Scenario: Compact layout uses equal-width category buttons
- **WHEN** the viewport is narrow enough that the sidebar stacks above the content
- **THEN** the category buttons render horizontally
- **AND** each category button has the same width

#### Scenario: Highlight active category
- **WHEN** a category is selected in the left sidebar
- **THEN** that category is visually highlighted
- **AND** other categories show their default state
