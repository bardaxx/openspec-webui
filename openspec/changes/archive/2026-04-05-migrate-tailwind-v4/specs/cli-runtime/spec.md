## MODIFIED Requirements

### Requirement: Serve the web application shell
The system SHALL expose the JSON API routes, the websocket endpoint, and the browser UI from the same local server, and SHALL return the SPA entry document for non-API and non-websocket paths when a built frontend is available. The frontend build pipeline SHALL use Tailwind CSS v4 via the `@tailwindcss/vite` Vite plugin, eliminating PostCSS dependencies. Frontend CSS SHALL use `@import "tailwindcss"` and `@theme` directives instead of `@tailwind` directives and a separate JavaScript config file.

#### Scenario: Load a deep-linked UI route
- **WHEN** a browser requests a non-API UI path such as `/specs/<name>`
- **THEN** the system returns the SPA entry document
- **AND** allows the frontend router to resolve the view

#### Scenario: Start without built frontend assets
- **WHEN** the frontend build output is unavailable
- **THEN** the server still starts
- **AND** logs a warning that the frontend build is missing

#### Scenario: Frontend builds with Tailwind v4
- **WHEN** the frontend build is executed via Vite
- **THEN** Tailwind CSS v4 processes styles via the `@tailwindcss/vite` plugin
- **AND** no PostCSS configuration is required

#### Scenario: Existing @apply directives remain functional
- **WHEN** the CSS contains `@apply` directives (e.g., `.markdown-body` styles)
- **THEN** Tailwind v4 SHALL resolve and apply all utility classes correctly
- **AND** the visual output matches the pre-migration appearance
