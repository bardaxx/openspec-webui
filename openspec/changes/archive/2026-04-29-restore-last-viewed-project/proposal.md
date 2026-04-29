## Why

When the server restarts with multiple projects registered, the UI always opens with a specific project selected—either the server's global default or the current working directory—rather than the project the user was last viewing in that browser. Because each browser tab can bind to a different project, the client-side fallback (sessionStorage) is lost on browser restart, and the server's startup logic overwrites the global default with the CWD.

## What Changes

- **Browser-side persistence**: The frontend stores the last bound `projectId` in `localStorage` (instead of only `sessionStorage`), so it survives browser restarts.
- **Startup selection priority**: On load, the frontend first attempts to restore the `localStorage` project. If it is no longer registered, it falls back to the server's global default.
- **Suppress CWD auto-activation**: Server startup no longer forces the current working directory as the global default when registered projects already exist. The CWD is only auto-added/activated when the registry is empty and has no active project.
- **Multi-browser compatibility preserved**: Each browser maintains its own `localStorage` value. The server's global default remains unchanged and continues to serve as the fallback for new browsers and API requests.

## Capabilities

### New Capabilities
*None.*

### Modified Capabilities

- `client-project-binding`: The client-side reconnection restoration logic changes from sessionStorage-only to a localStorage-persisted last-viewed project, with fallback to the server's `connection:init` value.
- `project-registry`: The "Initial project from current working directory" startup requirement changes so that CWD auto-activation only occurs when the registry is empty or has no `activeProjectId`.

## Impact

- `frontend/src/lib/state/projectsCore.ts` — storage key logic and resolution order
- `frontend/src/lib/state/projects.svelte.ts` — persistence on bind
- `frontend/src/lib/state/appData.svelte.ts` — connection-init handling
- `src/server/index.ts` — `resolveStartupProject` and CWD bootstrap conditions
- `openspec/specs/client-project-binding/spec.md`
- `openspec/specs/project-registry/spec.md`
