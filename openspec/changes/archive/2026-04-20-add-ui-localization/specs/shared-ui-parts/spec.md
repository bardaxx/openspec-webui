## MODIFIED Requirements

### Requirement: ErrorBanner component
The system SHALL provide an `ErrorBanner` component in `$lib/components/ui/error-banner/` that renders a styled error container. The component SHALL accept an `error` message string prop and an optional `onRetry` callback prop. When `onRetry` is provided, the component SHALL render a retry button whose label is localized for the active locale.

#### Scenario: Render error message without retry
- **WHEN** an ErrorBanner is rendered with `error="Failed to load"`
- **THEN** it displays the error text in a bordered container with danger styling
- **AND** no retry button is shown

#### Scenario: Render error message with localized retry button
- **WHEN** an ErrorBanner is rendered with `error="Network error"` and `onRetry={handleRetry}`
- **THEN** it displays the error text in a bordered container
- **AND** a retry button with localized copy is shown
- **AND** clicking the retry button calls `onRetry`

### Requirement: LoadingState component
The system SHALL provide a `LoadingState` component in `$lib/components/ui/loading-state/` that renders a centered loading indicator with a configurable height. The loading label SHALL be localized for the active locale.

#### Scenario: Render default loading state
- **WHEN** a LoadingState is rendered without props
- **THEN** it displays a centered localized loading message with muted foreground color
- **AND** the container height defaults to `h-64`

#### Scenario: Render loading state with custom height
- **WHEN** a LoadingState is rendered with `height="h-48"`
- **THEN** the container uses the specified height class

### Requirement: Clipboard copy utility
The system SHALL provide a `copyToClipboard` function in `$lib/utils.ts` (or equivalent shared utility module) that accepts a text string and a label, copies the text to the system clipboard, and shows a success or error toast notification whose feedback copy is localized for the active locale.

#### Scenario: Copy text to clipboard successfully
- **WHEN** `copyToClipboard("my-change", "Change name")` is called
- **THEN** the text `my-change` is written to the system clipboard
- **AND** a localized success toast is shown using the provided label

#### Scenario: Copy fails gracefully
- **WHEN** the clipboard API fails
- **THEN** a localized error toast is shown
