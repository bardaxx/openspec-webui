## 1. Tab Type System

- [x] 1.1 Add `'settings'` to `TabType` union in `frontend/src/lib/state/tabs.svelte.ts`
- [x] 1.2 Add `createSettingsTab()` function returning `{ id: 'settings:home', type: 'settings', name: <localized label>, path: '/settings', pinned: false, preview: false }`
- [x] 1.3 Add `openSettings()` method to tab store that focuses existing settings tab or creates a new one via `createSettingsTab()`
- [x] 1.4 Update `normalizePath()` to map `/settings` to home path (settings tabs are not path-routable)

## 2. Settings View Component

- [x] 2.1 Create `frontend/src/lib/components/layout/SettingsView.svelte` with two-column layout: left section menu (14rem, `lg:grid-cols-[14rem_minmax(0,1fr)]`) and right scrollable content area
- [x] 2.2 Migrate all section content (General, Workflow, Commands, Versions) from `SettingsModal.svelte` into the right scrollable panel as stacked card sections, each with a section anchor `id="settings-{section-id}"` and `<h2>` heading
- [x] 2.3 Implement left menu buttons that call `scrollIntoView({ behavior: 'smooth' })` on section anchors
- [x] 2.4 Implement `IntersectionObserver` to track the active section and highlight the corresponding menu item
- [x] 2.5 Add responsive layout: on narrow viewports, left menu stacks above content with horizontal scroll
- [x] 2.6 Delete `frontend/src/lib/components/layout/SettingsModal.svelte`

## 3. Main Viewer Routing

- [x] 3.1 Add `SettingsView` import and settings tab branch in `MainViewer.svelte` that renders `<SettingsView />` inside the same centered `max-w-7xl px-4 py-6 lg:px-6` page frame used by Dashboard
- [x] 3.2 Add `settings` entry to `TAB_ICONS` in `TabBar.svelte` with `Settings` icon and `text-muted-foreground` color

## 4. Activity Bar Integration

- [x] 4.1 Change Settings button in `ActivityBar.svelte` from `layoutStore.toggleOverlay('settings')` to `tabStore.openSettings()`
- [x] 4.2 Remove `'settings'` from `LayoutOverlay` type in `layout.svelte.ts`
- [x] 4.3 Remove `settingsInitialSection` state from `layout.svelte.ts`
- [x] 4.4 Remove `<SettingsModal>` rendering from `AppLayout.svelte`

## 5. Verification

- [x] 5.1 Verify clicking Settings icon in Activity Bar opens a regular (non-pinned, non-preview) settings tab with a close button
- [x] 5.2 Verify section menu scrolling works and active section highlights correctly
- [x] 5.3 Verify all settings controls (theme, language, workflow, commands, versions) function correctly
- [x] 5.4 Verify responsive layout on narrow viewport
- [x] 5.5 Verify browser back/forward navigation works when switching between settings and other tabs
