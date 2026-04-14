## MODIFIED Requirements

### Requirement: Launch command settings from Activity Bar
The web UI SHALL provide a Settings icon in the Activity Bar. Clicking the Settings icon SHALL open a settings dialog for command preferences, theme settings, and preview-tab behavior settings.

#### Scenario: Open command settings from Activity Bar
- **WHEN** the operator clicks the Settings icon in the Activity Bar
- **THEN** the system opens the settings dialog
- **AND** shows the current command preference values
- **AND** shows the current theme selection
- **AND** shows whether preview tabs are enabled

### Requirement: Two-column settings layout
The settings dialog SHALL use a two-column layout with a left sidebar listing setting categories (General, AI Tool, Commands) and a right content area showing the selected category's settings. Selecting a category in the sidebar SHALL update the right content area without closing the dialog. The General category SHALL include both theme settings and preview-tab behavior settings.

#### Scenario: Show General settings by default
- **WHEN** the settings dialog opens
- **THEN** the General category is selected in the left sidebar
- **AND** the right content area shows the Appearance (theme) settings
- **AND** the right content area shows the preview-tab mode toggle

### Requirement: Persist preview-tab preference in settings dialog
The settings dialog SHALL include a preview-tab mode toggle in the General section. The toggle SHALL default to enabled when no saved preference exists, SHALL persist the selected value in browser localStorage, and SHALL control whether Explorer single-click opens a reusable preview tab or a confirmed tab. When preview-tab mode is enabled, the settings description SHALL explain that Ctrl+Click / Cmd+Click or the Explorer item context menu can be used to open a regular tab.

#### Scenario: Preview-tab mode defaults to enabled
- **WHEN** the operator opens the settings dialog for the first time with no saved preview-tab preference
- **THEN** the preview-tab mode toggle is enabled

#### Scenario: Disable preview-tab mode
- **WHEN** the operator turns off preview-tab mode in the settings dialog
- **THEN** the system stores that preference in localStorage
- **AND** subsequent Explorer single-click actions open confirmed tabs instead of preview tabs

#### Scenario: Restore saved preview-tab mode
- **WHEN** the operator previously turned off preview-tab mode
- **AND** the application reloads
- **THEN** the settings dialog shows the toggle as disabled
