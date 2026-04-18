# Capability: Frontend Module Organization

## Purpose
Defines the canonical directory layout and import conventions for the Svelte 5 frontend, ensuring reusable modules, shared state, view components, and shared TypeScript modules live under `frontend/src/lib/` with role-based organization.

## Requirements

### Requirement: Frontend root stays thin
The frontend SHALL keep only entrypoint assets at `frontend/src` root. Reusable modules, shared state, view components, and shared TypeScript modules SHALL live under `frontend/src/lib/`.

#### Scenario: Root contains only entrypoint files
- **WHEN** an operator inspects `frontend/src/`
- **THEN** the root contains `App.svelte`, `main.ts`, and `app.css`
- **AND** reusable frontend modules are not placed directly in `frontend/src/stores/` or `frontend/src/components/`

### Requirement: App-wide rune state lives under $lib/state
App-wide Svelte 5 rune state modules SHALL live under `frontend/src/lib/state/` and SHALL be imported via `$lib/state/...` paths.

#### Scenario: Nested component imports app-wide state
- **WHEN** a component under `frontend/src/lib/components/` depends on app-wide state
- **THEN** it imports the state module from `$lib/state/...`
- **AND** it does not use deep relative paths to reach the moved state module

### Requirement: Reusable components are organized by role under $lib/components
Reusable frontend components SHALL be organized under `frontend/src/lib/components/` using role-based buckets: `ui/` for shadcn-svelte generated primitives only, `layout/` for app shell and shell-owned overlays, and `shared/` for non-shell reusable components and app-specific wrappers.

#### Scenario: Layout components resolve from the layout bucket
- **WHEN** the app shell imports `AppLayout`, `ExplorerPane`, `TabBar`, dialog overlays, or empty-shell states
- **THEN** those components resolve from `$lib/components/layout/...`

#### Scenario: Shared helpers resolve from the shared bucket
- **WHEN** a viewer component imports markdown or command shortcut helpers
- **THEN** those helpers resolve from `$lib/components/shared/...`

#### Scenario: App-specific wrappers do not stay in ui
- **WHEN** a reusable component composes shadcn primitives into an app-specific wrapper such as dialog headers, error banners, empty states, explorer sections, or underline tab bars
- **THEN** it resolves from `$lib/components/shared/...`
- **AND** it is not placed under `$lib/components/ui/...`

### Requirement: View components and shared types use alias-friendly locations
Page-like viewer components SHALL live under `frontend/src/lib/views/`, and shared frontend TypeScript types SHALL live under `frontend/src/lib/types/`.

#### Scenario: Main viewer imports a page-like component
- **WHEN** `MainViewer` renders the dashboard, change, or spec view
- **THEN** it imports those view components from `$lib/views/...`

#### Scenario: Shared types are not buried in implementation files
- **WHEN** multiple frontend modules need reusable API or command types
- **THEN** those types resolve from `$lib/types/...`
- **AND** they are not kept only inside a large implementation file when shared across modules
