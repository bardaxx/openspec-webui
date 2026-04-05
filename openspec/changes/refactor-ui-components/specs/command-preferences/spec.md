## ADDED Requirements

### Requirement: Icon component for SVG icons
The system SHALL provide an `Icon` Svelte component that renders SVG icons by name prop. The component SHALL support the following icon names: `gear`, `close`, `chevron-right`, `chevron-down`, `checkmark`, `circle`, `plus`, `clipboard`, `lightbulb`, and `document`. The component SHALL accept `class` and `size` props for styling. All SVG icons SHALL use `currentColor` for stroke/fill to inherit text color.

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
The settings modal SHALL use a two-column layout with a left sidebar listing setting categories (General, Commands) and a right content area showing the selected category's settings. Selecting a category in the sidebar SHALL update the right content area without closing the modal.

#### Scenario: Show General settings by default
- **WHEN** the settings modal opens
- **THEN** the General category is selected in the left sidebar
- **AND** the right content area shows the Appearance (theme) settings

#### Scenario: Switch to Commands settings
- **WHEN** the user clicks the Commands category in the left sidebar
- **THEN** the right content area shows the AI Tool and Expanded Commands settings
- **AND** the General settings are hidden

#### Scenario: Highlight active category
- **WHEN** a category is selected in the left sidebar
- **THEN** that category is visually highlighted
- **AND** other categories show their default state
