## Context

ChangeViewer and SpecViewer already share a pattern: both render markdown, both expose a text-selection context menu, and both currently offer `Copy` and `Quote Copy` actions sourced from `window.getSelection()`. Separately, the Explorer already has contextual search entry points that open the Search panel with a preset query and execute the search immediately.

That makes this feature mostly a coordination problem between two existing systems:

- viewer-local selected-text context menus
- shared Explorer search routing

The main product question is not whether search can run from a viewer selection; it is how to keep that action high-signal and unsurprising.

## Goals / Non-Goals

**Goals:**

- Add a `Search` item to markdown selection context menus in both ChangeViewer and SpecViewer.
- Reuse the existing Explorer search panel and contextual search behavior instead of inventing a second search flow.
- Guard the action so only likely-useful single-line keywords can trigger it.
- Keep behavior consistent for change file content, change spec delta content, and spec content.
- Preserve existing copy and quote-copy interactions.

**Non-Goals:**

- Change the backend search algorithm or add fuzzy/multiline query support.
- Normalize invalid selections into something else.
- Add a new viewer-local search bar, modal, or confirmation step.
- Broaden the selection scope beyond the current `window.getSelection()` approach already used by copy actions.

## Decisions

### Decision 1: Add `Search` as a third selected-text viewer action

Both viewer context menus should expose three actions for selected text:

- `Copy`
- `Quote Copy`
- `Search`

This keeps the new capability adjacent to the existing text actions instead of hiding it in separate chrome.

### Decision 2: Disable `Search` unless the selection is already a good literal query

The viewer `Search` action should only enable when the current selection becomes a valid keyword after trimming outer whitespace.

A valid keyword must satisfy all of the following:

- trimmed length is at least 2 characters
- trimmed length is at most 80 characters
- contains no `\n`
- contains no `\r`
- contains no `\t`

Rationale: the current search implementation is literal and case-insensitive, but it does not normalize multiline whitespace. Multiline or oversized selections are therefore more likely to confuse than help.

### Decision 3: Forward the trimmed keyword directly into Explorer search and execute immediately

When the operator selects `Search`, the system should send the trimmed keyword into the existing Explorer Search panel flow and run the search immediately, matching the behavior already used by other contextual Explorer search actions.

```text
[viewer text selection]
        │
        ▼
  Context menu: Search
        │
        ▼
 searchStore.open(keyword)
        │
        ▼
 Explorer Search panel opens
 keyword is populated
 search runs immediately
```

Rationale: this preserves one shared search surface and avoids a viewer-specific search mode.

### Decision 4: Snapshot the selection before menu-triggered routing

The viewer should capture the relevant selected text before menu-triggered routing occurs, rather than trusting that `window.getSelection()` will remain stable after the menu closes and the Explorer panel changes state.

Rationale: context-menu interaction and focus changes can clear DOM selection in some environments.

### Decision 5: Keep the guardrail logic shared across both viewers

The keyword validation and normalization rules should live in shared viewer-selection search logic rather than being duplicated independently in ChangeViewer and SpecViewer.

Rationale: both viewers use the same selection model and should not drift on edge-case behavior.

## Risks / Trade-offs

- [Risk] Operators may expect multiline selections to be searchable. → Mitigation: keep the item visibly disabled for invalid selections instead of running a surprising normalized query.
- [Risk] The 80-character maximum could exclude some long-but-legitimate phrases. → Mitigation: choose a limit large enough for names, paths, and short phrases while keeping out paragraph-scale selections; this can be revisited later if real usage shows pressure.
- [Risk] Snapshotting selection adds a small amount of extra viewer state. → Mitigation: keep the state local and scoped to menu enablement/routing only.
