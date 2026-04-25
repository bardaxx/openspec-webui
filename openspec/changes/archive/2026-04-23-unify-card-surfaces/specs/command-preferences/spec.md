## MODIFIED Requirements

### Requirement: Provide theme selection in settings dialog
The settings dialog SHALL include an Appearance section with three radio options: Light, Dark, and System. The selected option SHALL immediately apply the corresponding theme without requiring page reload. The theme options SHALL be rendered as shared selection cards that align with the application's Card surface pattern.

#### Scenario: Select Light theme from settings
- **WHEN** the user selects the Light radio option in the Appearance section
- **THEN** the UI immediately switches to light colors
- **AND** the selection is persisted to localStorage

### Requirement: Provide language selection in settings dialog
The settings dialog SHALL include a Language section in the General category after the Theme section. The section SHALL provide `English` and `日本語` options through a listbox-style selection control, SHALL show the currently active locale, and SHALL apply the selected locale immediately. The language control SHALL use the shared Select / Card surface tone so its trigger, popup, hover, and selected states align with the settings selection cards.

#### Scenario: Show language selection in General settings
- **WHEN** the settings dialog opens
- **THEN** the General category shows a Language section after Theme
- **AND** the section lists `English` and `日本語`
- **AND** the currently active locale is selected in a listbox-style control

#### Scenario: Persist selected language from Settings
- **WHEN** the operator selects a different language option in the Language section
- **THEN** the application locale updates immediately
- **AND** the selection is persisted in browser storage

#### Scenario: Reopen Settings after changing language
- **WHEN** the operator changes the locale and later reopens the settings dialog
- **THEN** the Language section shows the saved locale as selected
