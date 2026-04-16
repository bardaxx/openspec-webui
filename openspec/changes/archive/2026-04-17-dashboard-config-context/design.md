## Context

The current Dashboard models project documentation around `openspec/project.md`: the server parser reads that file, derives a description from its first paragraph, and returns an empty content body plus the string `No project.md file found` when the file is absent. This no longer matches current OpenSpec behavior. The migration guide states that `project.md` is legacy, manual migration is required, and `openspec/config.yaml` context is actively injected into OpenSpec planning requests.

In practice, `openspec init` already creates `config.yaml`, so the confusing cases are not “config missing” but “config exists while meaningful context still lives in legacy project.md” and “both files exist, but only config.yaml affects planning.” The Dashboard currently hides that distinction, does not parse `config.yaml`, drops parser warnings before they reach the client, and does not refresh project data when `config.yaml` changes.

## Goals / Non-Goals

**Goals:**
- Make the Dashboard reflect the actual planning source by reading `openspec/config.yaml`.
- Present planning data in one block split into `AI Context`, `Artifact Rules`, and `Workflow Schema`.
- Treat `project.md` as deprecated supplemental content in a collapsed disclosure labeled `Legacy project.md (Deprecated)`.
- Replace missing-file messaging with migration-focused or informational copy that explains OpenSpec planning uses `config.yaml`.
- Refresh project-scoped UI when `config.yaml` changes without requiring a manual reload.
- Preserve compatibility for existing consumers such as project-scoped search by keeping a synthesized project content body.

**Non-Goals:**
- Editing `config.yaml` or `project.md` from the Dashboard.
- Automatic migration or deletion of `project.md`.
- Semantic diffing between `config.yaml` and `project.md`.
- Changing OpenSpec CLI behavior or skill prompts.

## Decisions

### 1. Expose structured planning context from the project parser and API
The server will continue to derive the project name from the project root, but it will treat `openspec/config.yaml` as the active project-context source. The parsed project response will gain structured fields for:
- active planning source path (`openspec/config.yaml`)
- `AI Context` text from `context:`
- `Artifact Rules` grouped by artifact ID from `rules:`
- `Workflow Schema` from `schema:`
- optional legacy `project.md` metadata and content
- a migration state used for Dashboard messaging (`config-only`, `legacy-present`, `migration-needed`)

The legacy `description` field will be derived from the first non-empty line of `context:` when present; otherwise it will be empty. The `content` field will remain available as a synthesized compatibility string so existing project search behavior can continue without a separate capability change.

**Alternatives considered:**
- Reuse only the existing `content` string and encode sections into markdown. Rejected because the Dashboard now needs first-class structured sections and legacy-state messaging.
- Create a separate API endpoint just for planning context. Rejected because project context is already returned through `/api/project`, and splitting it would add avoidable complexity.

### 2. Parse `config.yaml` with a real YAML parser
The server will parse `openspec/config.yaml` with a YAML parser library rather than ad-hoc regex extraction. This keeps multiline `context:` blocks and nested `rules:` values reliable.

Missing `context:` or `rules:` entries will normalize to empty values. If `project.md` exists, it will be read separately and attached as deprecated supplemental content.

**Alternatives considered:**
- Manual string parsing. Rejected because YAML block scalars and nested mappings are easy to mis-handle.

### 3. Render a single `OpenSpec Planning Context` block on Dashboard
The Dashboard will replace the old project documentation section with one block labeled `OpenSpec Planning Context`. Inside that block it will render, in order:
1. source notice explaining that OpenSpec planning uses `openspec/config.yaml`
2. `AI Context`
3. `Artifact Rules`
4. `Workflow Schema`
5. collapsed `Legacy project.md (Deprecated)` disclosure when applicable

This preserves a single mental model for operators while still separating the kinds of planning data they need to inspect.

**Alternatives considered:**
- Multiple separate cards. Rejected because it fragments what users think of as one “project context” surface.
- Showing raw `config.yaml` only. Rejected because users understand planning intent faster when the config is split into named sections.

### 4. Use objective migration messaging instead of missing-file warnings
The Dashboard will never show `No project.md file found`. Instead:
- if `context:` is non-empty and no legacy file exists, show no migration callout
- if `context:` is non-empty and `project.md` exists, show informational copy that planning uses `config.yaml`
- if `context:` is empty and `project.md` exists, show warning copy that meaningful legacy context may still need migration

This avoids pretending the legacy file is required while still surfacing migration debt when it is objectively detectable.

**Alternatives considered:**
- Always warn whenever `project.md` exists. Rejected because some repositories intentionally keep the legacy file for reference and do not need a warning state.
- Attempt to judge whether `project.md` has “more useful” content than `config.yaml`. Rejected because semantic richness is subjective and not reliably machine-detectable.

### 5. Watch `config.yaml` as project-scoped refresh input
The file watcher will treat `openspec/config.yaml` as a relevant project file even though it is not markdown. Changes to that file will trigger a `project` refresh event, causing the existing client project store refresh path to reload project data in place.

**Alternatives considered:**
- Require manual reload for config edits. Rejected because config changes are part of normal planning workflows.

## Risks / Trade-offs

- **Adding a YAML parser dependency** → Mitigate by choosing a small, well-supported package and limiting parsing to `schema`, `context`, and `rules`.
- **Migration-needed detection may miss thin-but-non-empty context** → Mitigate by warning only on empty `context:` and always showing an informational note when legacy content still exists.
- **Compatibility content may drift from the structured UI** → Mitigate by generating the compatibility string from the same normalized planning-context model the Dashboard renders.
- **Legacy `project.md` may still be useful as archival reference** → Mitigate by collapsing it by default instead of hiding or deleting it.

## Migration Plan

1. Extend parser and shared types to load structured planning context from `config.yaml` and optional legacy content from `project.md`.
2. Update `/api/project` consumers to use the new structured fields while preserving backward-compatible `description` and `content` behavior.
3. Replace the Dashboard documentation block with the new planning-context block and legacy disclosure.
4. Extend the file watcher so `config.yaml` edits trigger project refresh events.
5. Update tests and fixtures to cover config-driven context, migration-needed messaging, and config refresh behavior.

## Open Questions

- Whether to support `config.yml` as an alias in addition to `config.yaml`.
- Whether artifact rules should render as plain text blocks only or use lightweight code-style formatting when values are structured.
