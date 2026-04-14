## 1. Layout store extension

- [x] 1.1 Add `searchInitialQuery` reactive state to `layoutStore`
- [x] 1.2 Extend `openOverlay()` to accept `{ initialQuery?: string }` options
- [x] 1.3 Add `searchInitialQuery` getter to layout store

## 2. SearchDialog initial query support

- [x] 2.1 Import `layoutStore` in `SearchDialog.svelte`
- [x] 2.2 On dialog open, read `layoutStore.searchInitialQuery` and pre-fill `searchQuery` when non-empty
- [x] 2.3 Trigger automatic search when initial query is present

## 3. ExplorerPane context menus

- [x] 3.1 Import `ContextMenu` components and `Clipboard` / `Search` icons
- [x] 3.2 Import `toast` from `svelte-sonner` for copy feedback
- [x] 3.3 Add `copyToClipboard()` helper function
- [x] 3.4 Add `searchForSpec()` helper function that calls `layoutStore.openOverlay('search', { initialQuery })`
- [x] 3.5 Wrap Active Changes items with `ContextMenu.Root` and add "Copy Name" menu item
- [x] 3.6 Wrap Archive items with `ContextMenu.Root` and add "Copy Name" menu item
- [x] 3.7 Wrap Specs items with `ContextMenu.Root` and add "Copy Name" + "Search Related Changes" menu items

## 4. SpecViewer search button

- [x] 4.1 Import `Search` icon and `Button` component in `SpecViewer.svelte`
- [x] 4.2 Import `layoutStore` in `SpecViewer.svelte`
- [x] 4.3 Add `searchRelatedChanges()` function
- [x] 4.4 Add ghost icon button in `h1` title, matching Dashboard's button style (icon-only, right-aligned)

## 5. Validation

- [x] 5.1 Run `svelte-check` — 0 errors, 0 warnings
- [x] 5.2 Run `npm run build` — success
