## MODIFIED Requirements

### Requirement: Synchronize document semantics and locale-aware formatting
The system SHALL keep the document `<html>` `lang` attribute synchronized with the active locale and SHALL update the `dir` attribute based on the locale's text direction. Shared date formatting helpers SHALL render change and spec timestamps in canonical `YYYY-MM-DD HH:mm` format for all locales, using the browser's local timezone so the displayed time matches the operator's wall clock.

#### Scenario: Update html language attributes on locale change
- **WHEN** the operator changes the locale to `ja`
- **THEN** `document.documentElement.lang` becomes `ja`
- **AND** `document.documentElement.dir` reflects the locale text direction

#### Scenario: Format timestamps consistently in Japanese locale
- **WHEN** the active locale is `ja`
- **AND** a change or spec datetime is displayed in the UI
- **THEN** the displayed text is in canonical `YYYY-MM-DD HH:mm` format reflecting the browser's local timezone

#### Scenario: Format timestamps consistently in English locale
- **WHEN** the active locale is `en`
- **AND** a change or spec datetime is displayed in the UI
- **THEN** the displayed text is in canonical `YYYY-MM-DD HH:mm` format reflecting the browser's local timezone
