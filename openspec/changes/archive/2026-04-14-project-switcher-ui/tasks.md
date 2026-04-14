## 1. Project selection data model

- [x] 1.1 Keep server and frontend project entry types focused on core project metadata only
- [x] 1.2 Keep registry parsing, sanitizing, and persistence simple while preserving existing `projects.json` compatibility
- [x] 1.3 Keep project switching API focused on selection rather than appearance editing

## 2. Project context UI

- [x] 2.1 Remove project avatar / appearance customization UI and keep project context text-first
- [x] 2.2 Replace the top ActivityBar project tile with a dedicated Explorer open/close control while preserving no-project selector fallback
- [x] 2.3 Update `Dashboard.svelte`, `ExplorerPane.svelte`, and `AppLayout.svelte` so project selector entry points are `folder-pen` buttons and the top toggle is visually separated from nav icons

## 3. Project selector entry points

- [x] 3.1 Add a `folder-pen` button to the Dashboard header that opens the project selector
- [x] 3.2 Add a `folder-pen` button to the Explorer header that opens the project selector
- [x] 3.3 Keep project selector list presentation simple and consistent with the text-first design

## 4. Selector and responsive integration

- [x] 4.1 Update `ProjectSelector.svelte` to render each project with simple folder icon + text presentation
- [x] 4.2 Verify narrow drawer behavior keeps the Activity Bar visible while the drawer opens to its right and keeps current project identity in the drawer header
- [x] 4.3 Preserve no-active-project behavior so the app icon fallback still opens project selection from the Activity Bar

## 5. Validation

- [x] 5.1 Add unit / integration coverage for core registry behavior and project switching flows
- [x] 5.2 Add frontend coverage for selector synchronization and project context UI actions
- [x] 5.3 Verify expanded, collapsed, narrow, and no-project layouts against the updated OpenSpec requirements

## 6. Directory browser and add-project dialog separation

- [x] 6.1 Add `GET /api/fs/browse` backend endpoint to list subdirectories with `hasOpenSpec` flag
- [x] 6.2 Add `browseDirectory` / `BrowseResult` frontend API function
- [x] 6.3 Create dedicated `AddProjectDialog.svelte` with wide layout and directory browser as primary UX
- [x] 6.4 Refactor `ProjectSelector.svelte` to switch-only (list existing projects + "Add Project" button that opens AddProjectDialog)
- [x] 6.5 Update `EmptyProjectState.svelte` to use the same AddProjectDialog via layoutStore overlay
- [x] 6.6 Add `add-project` overlay type to `layoutStore` and wire it in `AppLayout.svelte`
- [x] 6.7 Verify type-check passes for both server and frontend
