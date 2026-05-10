## Context

The Search panel currently keeps a localized explanatory paragraph in the sticky header and only renders the scroll body when results exist. That means the panel body goes visually empty for both the initial state and the "no results" state.

The Validation panel already uses the opposite pattern:

```text
Validation
├─ compact sticky header
└─ scroll body
   ├─ placeholder card before first run
   ├─ success state
   └─ result list
```

Search also has a discovery gap in the backend. `searchOpenSpec()` only checks project content, spec content, and change proposal content. It does not query source identifiers such as spec names, change names, or source paths, so filename-oriented lookup can fail even when the matching document is clearly present in the workspace.

## Goals / Non-Goals

**Goals**
- Align Search empty-state behavior with the Validation panel by rendering guidance inside the body area.
- Remove persistent explanatory prose from the Search header.
- Make search match source metadata in addition to document body content.
- Keep one result row per document and preserve existing navigation behavior.

**Non-Goals**
- Introduce full-text indexing or ranking beyond the current lightweight search flow.
- Redesign the Validation panel or unrelated Explorer sections.
- Expand search to new OpenSpec artifact categories beyond the currently supported project/spec/change surfaces.

## Decisions

### 1. Use body placeholders for Search guidance and empty results

The Search header should stay focused on controls:

```text
Search header
├─ title
├─ optional count
├─ search input
└─ clear / transient status surfaces
```

Guidance belongs in the body area instead:

```text
Search body
├─ short-query placeholder
├─ no-results placeholder
└─ result list
```

The placeholder treatment should visually track the Validation panel pattern (dashed panel/card in the scroll body) so the Search panel does not feel like a blank container when there is nothing to list yet.

### 2. Search documents by metadata as well as markdown body content

Each searchable document should be evaluated against two buckets:

```text
searchable document
├─ metadata: name, path/file identifier
└─ content: markdown body
```

Search should return a document when either bucket matches.

- If body content matches, keep the current excerpt-around-match behavior.
- If only metadata matches, still return the document once and provide a metadata-derived preview string so the result is understandable in the list.
- If both metadata and body match, return only one row for that document.

### 3. Keep the search result contract honest about metadata-only matches

Metadata-only hits do not naturally have a markdown line excerpt. The implementation should therefore preserve enough result metadata for the UI to describe what matched instead of pretending every hit came from body content.

Two acceptable implementation shapes:

1. extend `SearchResult` with an explicit match-source field such as `name | path | content`
2. keep the existing shape but emit a metadata-derived excerpt and a sentinel/non-content line marker for metadata-only hits

The preferred direction is the first option because it keeps filename/path matches explicit and avoids UI guesswork.

### 4. Preserve existing Explorer semantics around result navigation

The change should not alter:

- debounce and stale-response handling
- the sticky header while results scroll
- archived vs active change result semantics
- opening/focusing tabs from Search results

## Risks / Trade-offs

- Searching raw paths can make generic terms like `spec` or `proposal` broad; deduplicating to one result per document keeps this manageable.
- If metadata-only results are rendered with body-style excerpts, the UI becomes misleading; match-source handling should stay explicit.
- Moving copy from header to body changes panel density, so regression coverage should verify the sticky header remains compact and that empty states remain visible without scrolling.
