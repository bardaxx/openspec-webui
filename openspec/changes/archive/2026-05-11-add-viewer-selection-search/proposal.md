# Feature: Add viewer selection search context menu

## Summary

Add a `Search` action to the selected-text context menus in ChangeViewer and SpecViewer so operators can send a valid markdown selection directly into the Explorer Search panel and run that search immediately.

## Motivation

The markdown viewers already support `Copy` and `Quote Copy`, and other Explorer surfaces already support contextual keyword search. Today, when an operator finds an interesting phrase inside a change or spec, they have to manually copy it and move to the Search panel. That breaks the reading flow and makes cross-referencing slower than it needs to be.

The new action should feel like the existing contextual search affordances, while guarding against low-signal selections such as multiline snippets, tabs, or oversized excerpts that are unlikely to produce useful literal search matches.

## Proposed Solution

- Extend the markdown selection context menus in ChangeViewer and SpecViewer to include `Search` alongside the existing copy actions.
- Treat the selected text as a valid search keyword only when the trimmed selection is between 2 and 80 characters and contains no newline, carriage-return, or tab characters.
- Disable the `Search` item when the current selection is invalid instead of attempting to normalize or partially execute it.
- Reuse the existing Explorer contextual search path so the Search panel opens, the keyword is populated, and the search runs immediately.
- Snapshot and validate the selection before routing so the chosen keyword survives menu interaction and panel switching.
- Keep existing `Copy` and `Quote Copy` behavior unchanged.

## Alternatives Considered

### Allow any selected text and normalize it aggressively

Rejected because multiline or very long viewer selections are usually copy/reference material rather than good literal search queries. Disabling the action for invalid selections keeps the interaction simple and predictable.

### Open the Search panel without executing the search

Rejected because existing contextual search affordances already forward a keyword and run immediately. A viewer-only exception would feel inconsistent.

### Add a separate viewer-local search surface

Rejected because the product already has a persistent Explorer Search panel and shared search-state behavior.

## Impact

- [ ] Breaking changes
- [ ] Database migrations
- [ ] API changes

Affected capabilities:

- `context-copy`
- `search`
