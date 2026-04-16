## 1. Parser and API model

- [x] 1.1 Add structured project planning-context fields to shared project types and frontend API types.
- [x] 1.2 Parse `openspec/config.yaml` into normalized `AI Context`, `Artifact Rules`, and `Workflow Schema`, while attaching optional legacy `project.md` content and migration state.
- [x] 1.3 Preserve compatible project description/content behavior for existing consumers while removing the `No project.md file found` fallback.

## 2. Dashboard planning-context UI

- [x] 2.1 Replace the existing Dashboard project documentation section with a single `OpenSpec Planning Context` block sourced from `config.yaml`.
- [x] 2.2 Render the planning-context block with `AI Context`, `Artifact Rules`, and `Workflow Schema` subsections plus migration/info messaging.
- [x] 2.3 Render `Legacy project.md (Deprecated)` as a collapsed disclosure with legacy-only helper copy.

## 3. Refresh behavior and verification

- [x] 3.1 Update the file watcher so `config.yaml` changes trigger project-scoped refresh events.
- [x] 3.2 Add or update parser, API, and UI tests for config-driven context, legacy disclosure, and migration-needed messaging.
- [x] 3.3 Run targeted tests or checks covering project parsing, Dashboard rendering, and project refresh behavior.
