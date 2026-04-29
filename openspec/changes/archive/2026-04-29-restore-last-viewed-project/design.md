## Context

The frontend currently persists the user's last selected project in `sessionStorage` under the key `openspec-active-project-id`. This works for tab refreshes but is lost when the browser is closed and reopened. Meanwhile, the server startup logic in `src/server/index.ts` calls `resolveStartupProject()`, which unconditionally uses `process.cwd()` as a startup project and activates it via `projectRegistry.addProject()`. When multiple projects are already registered, this overwrites the persisted global default with the current working directory.

The result: after every server restart, users see either the CWD project or the server's global default, not the project they were last viewing in that browser.

## Goals / Non-Goals

**Goals:**
- Persist the last viewed project per browser so it survives browser restarts.
- On frontend load, prefer the browser-local last-viewed project over the server's global default.
- Prevent server startup from silently switching the global default to the CWD when projects already exist.
- Keep multi-browser and multi-tab behavior intact (each browser has its own localStorage).

**Non-Goals:**
- Server-side per-user or per-browser history tracking.
- Tab-level independent restoration (beyond what sessionStorage already provides).
- URL query-parameter-based project selection.
- Changing the global default project semantics for API requests or new browser sessions.

## Decisions

### Use localStorage for last-viewed project persistence
- **Rationale**: `localStorage` survives browser restarts, unlike `sessionStorage`. The change is minimal (same `StorageLike` interface in `projectsCore.ts`).
- **Alternative considered**: Keep `sessionStorage` and add server-side `lastOpenedAt` tracking. Rejected because server-side tracking cannot distinguish between different browsers and would create ambiguity about "which browser's last project" to restore.

### Accept same-browser multi-tab last-write-wins behavior
- **Rationale**: If two tabs in the same browser have different projects open, the last tab to bind will overwrite `localStorage`. On next browser restart, only one of those projects will be restored. This is acceptable because:
  1. The user's primary intent is "restore the project I was working in this browser," not per-tab state.
  2. Per-tab state is still supported via `sessionStorage` for in-browser navigation.
  3. Adding tab IDs or URL parameters would significantly increase complexity.

### Suppress CWD auto-activation only when registry is non-empty
- **Rationale**: The CWD bootstrap is useful for first-time users. Once projects are registered, it becomes surprising and unwanted. We only skip CWD activation when `registry.projects.length > 0` or `activeProjectId != null`.
- **Alternative considered**: Remove CWD bootstrap entirely. Rejected because it breaks the first-time DX.

## Risks / Trade-offs

- **[Risk] Stale localStorage pointing to a removed project** → **Mitigation**: The frontend already validates the preferred project ID against the current registry list in `resolveProjectSelection()`. If the stored ID is absent, it falls back to the server's global default.
- **[Risk] Private browsing mode clears localStorage on exit** → **Mitigation**: This is expected browser behavior. The fallback to the server's global default is identical to today's behavior.
- **[Risk] Users expect per-tab restoration but get browser-level restoration** → **Mitigation**: Documented as a non-goal. The existing `sessionStorage` behavior for active tabs within a single browser session is unchanged.
