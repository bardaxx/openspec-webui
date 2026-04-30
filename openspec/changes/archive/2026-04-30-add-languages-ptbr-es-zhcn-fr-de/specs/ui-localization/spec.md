## MODIFIED Requirements

### Requirement: Provide localized application UI
The system SHALL support localized application chrome for the OpenSpec WebUI with `en` as the base locale and the following additional supported locales: `ja`, `pt-BR`, `es`, `zh-CN`, `fr`, `de`. Supplementary descriptions, help text, empty-state explanations, toast feedback, error text, and context-menu labels SHALL resolve from the active locale. Short titles and OpenSpec-derived terms such as `Settings`, `Dashboard`, `Archive`, `Specs`, workflow command names, `Specification`, `Design`, and `Spec Deltas` SHALL remain in English so they continue to match command names and project structure, and the implementation MAY keep those fixed labels outside the translation catalogs. When a message is unavailable in the active locale, the system SHALL fall back to the base locale. Catalogs for non-base locales MAY contain some entries with untranslated English values; these are accepted gaps where the translation has not yet been provided and the English fallback is displayed.

#### Scenario: Render English application chrome
- **WHEN** the active locale is `en`
- **THEN** settings, navigation, explorer labels, dashboard labels, viewer controls, context menus, empty states, and toast feedback render English copy

#### Scenario: Render Japanese application chrome
- **WHEN** the active locale is `ja`
- **THEN** supplementary descriptions, help text, empty-state explanations, toast feedback, error text, and context-menu labels render Japanese copy
- **AND** short titles and OpenSpec-derived terms remain in English

#### Scenario: Render Portuguese (Brazil) application chrome
- **WHEN** the active locale is `pt-BR`
- **THEN** supplementary descriptions, help text, empty-state explanations, toast feedback, error text, and context-menu labels render Brazilian Portuguese copy
- **AND** short titles and OpenSpec-derived terms remain in English

#### Scenario: Render Spanish application chrome
- **WHEN** the active locale is `es`
- **THEN** supplementary descriptions, help text, empty-state explanations, toast feedback, error text, and context-menu labels render Spanish copy
- **AND** short titles and OpenSpec-derived terms remain in English

#### Scenario: Render Chinese (Simplified) application chrome
- **WHEN** the active locale is `zh-CN`
- **THEN** supplementary descriptions, help text, empty-state explanations, toast feedback, error text, and context-menu labels render Simplified Chinese copy
- **AND** short titles and OpenSpec-derived terms remain in English

#### Scenario: Render French application chrome
- **WHEN** the active locale is `fr`
- **THEN** supplementary descriptions, help text, empty-state explanations, toast feedback, error text, and context-menu labels render French copy
- **AND** short titles and OpenSpec-derived terms remain in English

#### Scenario: Render German application chrome
- **WHEN** the active locale is `de`
- **THEN** supplementary descriptions, help text, empty-state explanations, toast feedback, error text, and context-menu labels render German copy
- **AND** short titles and OpenSpec-derived terms remain in English

#### Scenario: Fall back to base locale for a missing translation
- **WHEN** a translated message is unavailable in the active locale
- **THEN** the system renders the `en` message for that key
- **AND** the surrounding UI remains usable

#### Scenario: Untranslated English entries in a non-base locale catalog
- **WHEN** the active locale is any supported non-base locale
- **AND** a catalog entry contains an untranslated English string
- **THEN** the system displays the English string as-is
- **AND** this is an accepted gap pending translation

### Requirement: Switch locale from Settings without losing context
The system SHALL provide a language selection control in the Settings dialog's General section. The control SHALL list all supported locales with their native-language labels: `English`, `日本語`, `Português (Brasil)`, `Español`, `简体中文`, `Français`, `Deutsch`. The control SHALL show the current locale, and SHALL apply the selected locale during the current session without forcing the operator to reopen the current view.

#### Scenario: Show available language options in Settings
- **WHEN** the operator opens the Settings dialog
- **THEN** the General section shows a language selection control
- **AND** the control lists `English`, `日本語`, `Português (Brasil)`, `Español`, `简体中文`, `Français`, and `Deutsch`
- **AND** the current locale is selected

#### Scenario: Switch to Portuguese (Brazil) in Settings
- **WHEN** the active locale is not `pt-BR`
- **AND** the operator selects `Português (Brasil)` in the Settings dialog
- **THEN** the visible application chrome updates to Brazilian Portuguese
- **AND** the currently focused tab or overlay remains open

#### Scenario: Switch to Spanish in Settings
- **WHEN** the active locale is not `es`
- **AND** the operator selects `Español` in the Settings dialog
- **THEN** the visible application chrome updates to Spanish
- **AND** the currently focused tab or overlay remains open

#### Scenario: Switch to Chinese (Simplified) in Settings
- **WHEN** the active locale is not `zh-CN`
- **AND** the operator selects `简体中文` in the Settings dialog
- **THEN** the visible application chrome updates to Simplified Chinese
- **AND** the currently focused tab or overlay remains open

#### Scenario: Switch to French in Settings
- **WHEN** the active locale is not `fr`
- **AND** the operator selects `Français` in the Settings dialog
- **THEN** the visible application chrome updates to French
- **AND** the currently focused tab or overlay remains open

#### Scenario: Switch to German in Settings
- **WHEN** the active locale is not `de`
- **AND** the operator selects `Deutsch` in the Settings dialog
- **THEN** the visible application chrome updates to German
- **AND** the currently focused tab or overlay remains open

### Requirement: Persist and restore locale preference
The system SHALL persist the selected locale in browser storage under a dedicated application preference key and SHALL restore it on later visits before the main application mounts. When no saved locale exists, the system SHALL prefer the browser language when it matches a supported locale and otherwise fall back to `en`. The locale matching SHALL recognize regional variants (e.g., `es-MX` → `es`, `fr-CA` → `fr`, `zh-TW` → `zh-CN`, `pt-PT` → `pt-BR`, `de-AT` → `de`).

#### Scenario: Restore saved Portuguese (Brazil) locale on reload
- **WHEN** the operator previously selected `pt-BR`
- **AND** the application reloads
- **THEN** the application starts in `pt-BR`
- **AND** the Settings dialog shows `Português (Brasil)` as the selected language

#### Scenario: Match Spanish browser preference on first visit
- **WHEN** no saved locale exists
- **AND** the browser's preferred language is `es-MX`
- **THEN** the application starts in `es`

#### Scenario: Match Chinese browser preference on first visit
- **WHEN** no saved locale exists
- **AND** the browser's preferred language is `zh-Hans-CN`
- **THEN** the application starts in `zh-CN`

#### Scenario: Map Traditional Chinese browser preference to Simplified
- **WHEN** no saved locale exists
- **AND** the browser's preferred language is `zh-TW`
- **THEN** the application starts in `zh-CN`

#### Scenario: Match French browser preference on first visit
- **WHEN** no saved locale exists
- **AND** the browser's preferred language is `fr-FR`
- **THEN** the application starts in `fr`

#### Scenario: Match German browser preference on first visit
- **WHEN** no saved locale exists
- **AND** the browser's preferred language is `de-DE`
- **THEN** the application starts in `de`

#### Scenario: Fall back to English for unsupported browser languages
- **WHEN** no saved locale exists
- **AND** the browser's preferred language does not resolve to a supported locale
- **THEN** the application starts in `en`

### Requirement: Synchronize document semantics and locale-aware formatting
The system SHALL keep the document `<html>` `lang` attribute synchronized with the active locale and SHALL update the `dir` attribute based on the locale's text direction. All new locales (`pt-BR`, `es`, `zh-CN`, `fr`, `de`) SHALL use `dir="ltr"`. Shared date formatting helpers SHALL render change and spec timestamps in canonical `YYYY-MM-DD HH:mm` format for all locales, using the browser's local timezone so the displayed time matches the operator's wall clock.

#### Scenario: Update html attributes for Portuguese (Brazil) locale
- **WHEN** the operator changes the locale to `pt-BR`
- **THEN** `document.documentElement.lang` becomes `pt-BR`
- **AND** `document.documentElement.dir` is `ltr`

#### Scenario: Update html attributes for Chinese (Simplified) locale
- **WHEN** the operator changes the locale to `zh-CN`
- **THEN** `document.documentElement.lang` becomes `zh-CN`
- **AND** `document.documentElement.dir` is `ltr`

#### Scenario: Format timestamps consistently across all locales
- **WHEN** any supported locale is active
- **AND** a change or spec datetime is displayed in the UI
- **THEN** the displayed text is in canonical `YYYY-MM-DD HH:mm` format reflecting the browser's local timezone
