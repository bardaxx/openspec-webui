## 1. Frontend persistence layer

- [x] 1.1 Update `frontend/src/lib/state/projectsCore.ts` to read and write the preferred project ID from `localStorage` instead of `sessionStorage` (rename the constant and update `getSessionStorage` default behavior)
- [x] 1.2 Update `frontend/src/lib/state/projectsCore.test.ts` to test `localStorage` behavior and verify fallback when the stored project is absent from the registry

## 2. Frontend store wiring

- [x] 2.1 Update `frontend/src/lib/state/projects.svelte.ts` so that `applyProjectSelection` persists to the updated storage mechanism
- [x] 2.2 Verify `frontend/src/lib/state/appData.svelte.ts` uses the updated `loadPreferredProjectId` and that `handleConnectionInit` restores the last-viewed project correctly on reconnect

## 3. Server startup behavior

- [x] 3.1 Update `src/server/index.ts` to skip `resolveStartupProject()` / `addProject()` when the registry already contains projects or has an active project
- [x] 3.2 Update `src/server/server.integration.test.ts` to cover the "existing projects suppress CWD bootstrap" scenario
- [x] 3.3 Update `src/server/project-registry.test.ts` if any startup-related assertions need adjustment

## 4. Spec synchronization

- [x] 4.1 Apply the delta from `openspec/changes/restore-last-viewed-project/specs/client-project-binding/spec.md` into `openspec/specs/client-project-binding/spec.md`
- [x] 4.2 Apply the delta from `openspec/changes/restore-last-viewed-project/specs/project-registry/spec.md` into `openspec/specs/project-registry/spec.md`

## 5. Verification

- [x] 5.1 Run the frontend test suite (`npm run test:frontend` or equivalent) and fix failures
- [x] 5.2 Run the server test suite (`npm run test:server` or equivalent) and fix failures
- [x] 5.3 Manual end-to-end check: register multiple projects, select one, restart the server, reload the browser, and confirm the last-viewed project is restored
- [x] 5.4 Fix the Svelte `state_referenced_locally` warning in `frontend/src/lib/views/ChangeViewer.svelte` discovered during verification
