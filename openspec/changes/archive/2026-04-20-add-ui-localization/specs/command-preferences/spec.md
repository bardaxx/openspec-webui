## ADDED Requirements

### Requirement: Provide language selection in settings dialog
The settings dialog SHALL include a Language section in the General category after the Theme section. The section SHALL provide `English` and `日本語` options through a listbox-style selection control, SHALL show the currently active locale, and SHALL apply the selected locale immediately.

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
