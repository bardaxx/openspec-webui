# Roadmap

PRD: see conversation 2026-05-29 (roadmap support in openspec-webui)

This roadmap is a short execution map used to generate OpenSpec changes per slice.
Keep entries concise. Do not duplicate proposal/design/tasks content.

## How To Use This Roadmap

1. Pick the highest-priority `Ready` slice.
2. Create/update one OpenSpec change for that slice.
3. Move lifecycle forward and update the progress log.
4. Keep scope limited to that slice.

## Status Model

`Ready` -> `Spec Proposed` -> `Applying` -> `Applied` -> `Archived` (plus `Blocked`)

## Parallelism and WIP limits

- Multiple slices may be `Spec Proposed` in parallel.
- Global cap: max **2** slices in `Applying`.
- Critical-domain cap (for example auth, payments, checkout): max **1** slice in `Applying`.
- `next` remains atomic: one command moves one lifecycle gate for one slice.

## Spec verification gate (mandatory)

- Run the repository OpenSpec spec verification command after each lifecycle gate.
- `propose` must be verified before `apply`.
- `apply` must be verified before `archive`.
- `archive` must be verified before selecting the next slice.
- If verification reports issues, resolve them and re-run verification before continuing.

## Slices

### F01 - Roadmap Register In WebUI
Status: `Ready`
Goal: Add roadmap support to openspec-webui with structured parsing, explorer/dashboard exposure, dedicated viewer, and search integration.
Candidate OpenSpec change id: `f01-roadmap-register-in-webui`
Spec link: `openspec/changes/f01-roadmap-register-in-webui/`
Files:
- `src/parser/index.ts`
- `src/shared/types.ts`
- `src/watcher/file-watcher.ts`
- `frontend/src/lib/state/appData.svelte.ts`
- `frontend/src/lib/views/Dashboard.svelte`
Notes: Read-only lifecycle in UI; agent skills remain responsible for propose/apply/archive transitions.
Progress:
- Proposed: pending
- Applying: pending
- Applied: pending
- Archived: pending

### F02 - Roadmap UX Refinements
Status: `Ready`
Goal: Improve roadmap usability after F01 with dependency visualization refinements and navigation ergonomics.
Candidate OpenSpec change id: `f02-roadmap-ux-refinements`
Spec link: `openspec/changes/f02-roadmap-ux-refinements/`
Files:
- `frontend/src/lib/components/layout/ExplorerPane.svelte`
- `frontend/src/lib/views/RoadmapViewer.svelte`
- `frontend/src/lib/state/tabs.svelte.ts`
Notes: Scope may be reduced if F01 already covers required ergonomics.
Progress:
- Proposed: pending
- Applying: pending
- Applied: pending
- Archived: pending

## Dependencies

### F01
Depends on: none
Blocks: F02
Can run in parallel: no

### F02
Depends on: F01
Blocks: none
Can run in parallel: no

## Recommended Execution Order

1. F01 - Roadmap Register In WebUI
2. F02 - Roadmap UX Refinements

## Compacted history

Keep only short archived summaries after the configured threshold.

- pending

## Post-implementation reality check

For every `Applied` slice, append:

- What changed from original plan:
- Unexpected issues:
- Follow-up needed:
