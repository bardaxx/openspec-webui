## Context

The explorer panel already supports local `Date` / `Name` sorting for active changes, archives, and specs. Dashboard Active Changes and Recent Activity are separate derived lists in `Dashboard.svelte` and currently use fixed date-first ordering. This creates inconsistent behavior for users who move between dashboard summaries and explorer lists.

## Goals / Non-Goals

**Goals:**
- Provide date/name sorting controls for dashboard Active Changes and Recent Activity.
- Default both dashboard lists to date sorting.
- Share sort types and comparator helpers between explorer and dashboard so behavior stays consistent.
- Preserve the current explorer panel defaults, including Specs defaulting to name.

**Non-Goals:**
- Persist sort choices across reloads or projects.
- Change server-side parser ordering, API response shapes, or stored data.
- Add sorting dimensions beyond date and name.

## Decisions

1. **Extract sorting primitives into a shared frontend module.**
   - Decision: Move `ExplorerSortMode` and common date/name comparator helpers into a shared TypeScript module used by explorer sections and dashboard.
   - Rationale: The sort mode is no longer explorer-specific once dashboard uses the same control model.
   - Alternative considered: Duplicate sort logic in `Dashboard.svelte`; rejected because tie-breakers and future changes would diverge.

2. **Reuse the existing sort control component.**
   - Decision: Keep `ExplorerSortControl` as the visual control, but back it with shared sort-mode types/helpers. It may remain in the explorer-section folder unless broader component organization is needed.
   - Rationale: The current UI already matches the desired interaction and labels.
   - Alternative considered: Create a dashboard-specific control; rejected because it would add duplicate UI behavior.

3. **Sort Recent Activity by the selected activity item label/name when in name mode.**
   - Decision: Date mode sorts newest first using each item's timestamp; name mode sorts alphabetically by the visible item name with date as a stable tie-breaker.
   - Rationale: Recent Activity mixes changes and specs, so the common comparable field is the displayed item name.

## Risks / Trade-offs

- **Control density in dashboard sections** → Keep controls compact and place them in section headers, matching the explorer pattern.
- **Recent Activity name sorting weakens “recent” semantics** → Date remains the default, and the user explicitly opts into name sorting.
- **Shared helpers could over-generalize** → Keep the shared base small: sort mode type plus comparator builders for timestamp/name records.
