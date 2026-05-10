## 1. Investigation

- [x] **1.1** Confirm that the Search panel currently keeps explanatory copy in the sticky header while the scroll body is blank when there are no results.
- [x] **1.2** Confirm that `searchOpenSpec()` currently matches only markdown body content and does not search source names or paths.

## 2. Search matching changes

- [x] **2.1** Update the search parser/API contract so supported project/spec/change results can match source metadata as well as markdown body content.
- [x] **2.2** Ensure metadata-only matches produce one understandable result row per document without duplicating rows when content also matches.

## 3. Search panel empty-state alignment

- [x] **3.1** Remove the persistent explanatory description from the Search header while preserving sticky controls and result status behavior.
- [x] **3.2** Add Search body placeholders for short-query and no-results states, visually aligned with the Validation panel pattern.

## 4. Verification

- [x] **4.1** Add or update regression coverage for metadata-based matches and Search empty-state rendering.
- [x] **4.2** Verify Search clear behavior, sticky-header behavior, archived/active change result semantics, and result navigation still work.
