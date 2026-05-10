## Context

Two separate implementation drifts are visible in the Validation Explorer:

1. `info` badges are inconsistent across surfaces.
   - Header filter chips in `validation-explorer-section.svelte` use manual `info` classes.
   - Shared badge-format status indicators use `StatusIndicator` + `visualSemantics.ts`.
   - `visualSemantics.ts` currently maps `info` badge usage to `secondary` because the shared Badge primitive has no `info` variant.

2. Validation list row selection is not wired to the active tab.
   - `ExplorerListItemButton` already supports an `active` prop.
   - other explorer/search rows compare their item path to `tabStore.activeTab?.path`
   - validation rows never pass `active`, so they can never render as selected.

## Decisions

### 1. Add a real informational badge tone

The fix should introduce a dedicated `info` badge variant in the shared Badge primitive instead of keeping ad-hoc local classes or mapping `info` to `secondary`.

This keeps the shared validation status/severity semantics truthful in badge format and avoids special-casing the Validation Explorer rows.

### 2. Reuse Main Viewer path matching for Validation row selection

Validation rows should derive an item path using the same navigation rules as `validationStore.openItem()` and compare it to `tabStore.activeTab?.path`.

Conceptually:

```text
validation item
   │
   ├─ type=spec   ──> /specs/<name>
   └─ type=change ──> /changes/<name>
                         │
                         ▼
              compare with tabStore.activeTab?.path
                         │
                         ▼
                 selected row styling
```

### 3. Keep the navigation source of truth aligned

The path computation used for active-row comparison should match the path computation used for opening/focusing the tab, so the list highlight cannot drift from actual navigation behavior.

## Risks and Checks

- avoid changing icon-box semantics; they already render `info` correctly
- confirm no shared consumers intentionally rely on `info -> secondary`
- ensure non-navigable validation rows do not claim active selection
- verify the Validation panel remains persistent after row selection, matching current explorer behavior
