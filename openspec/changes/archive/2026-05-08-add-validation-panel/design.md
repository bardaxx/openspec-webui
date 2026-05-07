## Context

The WebUI already parses OpenSpec project data and exposes project-scoped APIs through Fastify. Frontend data access uses typed functions in `frontend/src/lib/api.ts`, shared DTOs in `frontend/src/lib/types/api.ts`, and Svelte 5 runes stores for UI state. Activity Bar presets currently switch the Explorer Pane between the normal Active Changes/Archive/Specs section group and the persistent Search panel.

`openspec validate` is already available from the CLI. The intended UI is not a new validation document page. The agreed information architecture is:

```text
Explorer Pane = issue index
Main Viewer   = issue context/details
Dashboard     = status glance
Settings      = configuration only
```

V1 covers only the first slice: execute validation, show the cross-cutting issue index in the Explorer Pane, and let operators jump to the existing spec/change tabs.

## Goals / Non-Goals

**Goals:**
- Provide a manual in-app `Run Validate` flow for the active project.
- Normalize `openspec validate --all --strict --json` into stable DTOs that the UI can render without knowing CLI output quirks.
- Add an Activity Bar Validate icon that behaves like existing Explorer presets.
- Add a Validation Explorer Pane panel that summarizes pass/fail state and lists failed specs/changes.
- Preserve the existing Main Viewer model by opening existing spec/change tabs from validation results.

**Non-Goals:**
- No standalone `/validate` route, validation-only tab type, or validation Main Viewer page.
- No automatic background validation on every file change.
- No live polling or WebSocket validation stream.
- No inline status bars inside SpecViewer/ChangeViewer; that is V2.
- No Dashboard validation card; that is V3.
- No Settings configuration for validation options in V1.

## Decisions

### 1. Server owns CLI execution and output normalization

**Decision**: Add a project-scoped server endpoint that executes `openspec validate --all --strict --json` in the active project root and returns a normalized validation DTO.

**Rationale**: The browser cannot safely execute local commands. Server-side normalization decouples frontend rendering from CLI JSON shape changes and from non-zero exit behavior when validation fails.

**Alternative considered**: Parse validation by reusing in-process OpenSpec internals. Rejected for V1 because the CLI command is the stable user-facing contract and keeps implementation smaller.

### 2. Failed validation is a successful API response

**Decision**: Validation failures from the CLI SHALL return a successful HTTP response containing `status: 'failed'` and itemized issues. Transport errors, missing project context, or command execution failures unrelated to validation semantics SHALL use the existing API error pattern.

**Rationale**: A failed validation run is expected domain data, not an application error. The UI must display failures in the panel instead of showing a generic fetch error.

**Alternative considered**: Map CLI non-zero exit to HTTP 500. Rejected because it conflates invalid OpenSpec content with server failure.

### 3. Validation results are project-scoped and manually refreshed

**Decision**: Store the most recent validation result for the active project in frontend state and refresh it only when the operator clicks Run Validate or when future entry points explicitly call the same action.

**Rationale**: Manual refresh is predictable and avoids expensive repeated CLI runs. It also prevents UI flicker while operators are editing documents.

**Alternative considered**: Re-run validation on file watcher events. Rejected for V1 as over-automation; can be revisited after the panel proves useful.

### 4. Validate is an Explorer Pane preset, not a Main Viewer route

**Decision**: Add `validate` to Activity/Explorer preset state and render a dedicated Validation panel in the Explorer Pane, similar to Search.

**Rationale**: Validation is an index over many specs and changes. The Explorer Pane is already the place for cross-cutting indexes. Existing document tabs remain the place for reading and editing context.

**Alternative considered**: Add `/validate` route. Rejected because it would duplicate navigation state and require operators to jump between a validation page and the actual document.

### 5. Issue selection opens existing spec/change tabs

**Decision**: Validation list entries SHALL navigate to `/specs/:name` or `/changes/:name` using existing tab opening behavior. Project-level or unknown issues SHALL remain visible in the panel but need not open a document in V1.

**Rationale**: This keeps the implementation aligned with the tabbed viewer and avoids a new detail surface before individual viewer status is implemented in V2.

**Alternative considered**: Show all error details directly in the Explorer Pane. Rejected for V1 because deep details can make the pane too dense; the pane should remain an issue index.

## Risks / Trade-offs

- **CLI output shape mismatch** → Add normalization tests with representative pass/fail payloads and tolerate missing optional fields.
- **Long validation runs block the UI** → Run asynchronously, expose loading state, disable duplicate runs, and keep the previous result visible until the new run completes.
- **Concurrent runs race** → Track request sequence or abort stale requests so older results cannot overwrite newer ones.
- **Validation failures appear as transport failures** → Treat known CLI validation non-zero exit as domain data and reserve API error state for true execution/transport errors.
- **Panel overcrowding with many issues** → Group by item and show item-level counts in V1; detailed per-line expansion can be deferred.
- **Existing specs have unrelated strict-validation issues** → The feature must faithfully surface them rather than hiding or special-casing them.

## Migration Plan

1. Add shared validation DTOs and server route without wiring UI.
2. Add frontend API/state and unit tests.
3. Wire Activity Bar/Explorer Pane preset state.
4. Add the Validation panel UI and navigation behavior.
5. Run unit tests, typecheck, and verify `openspec validate add-validation-panel --strict`.

Rollback is low risk: remove the Activity Bar entry and route/state additions; no persisted user data migration is required.

## Open Questions

- The exact CLI JSON schema should be confirmed during implementation with representative pass and fail runs.
- Whether to include warning-level issues depends on the current CLI output; V1 should preserve severity when available and otherwise classify validation findings as errors.
