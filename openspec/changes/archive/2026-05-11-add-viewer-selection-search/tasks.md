# Tasks for Add viewer selection search context menu

## 1. Shared selection-search rules

- [x] **1.1** Add shared viewer-selection search validation/normalization rules for trimmed single-line keywords with the 2-to-80 character guardrail.
- [x] **1.2** Reuse or add the localized menu label and icon wiring needed for a viewer `Search` action.

## 2. Viewer context menus

- [x] **2.1** Add the `Search` item to ChangeViewer selection context menus for both regular change markdown files and spec delta markdown content.
- [x] **2.2** Add the `Search` item to the SpecViewer selection context menu.
- [x] **2.3** Ensure invalid selections disable the `Search` action while existing `Copy` and `Quote Copy` behavior remains unchanged.
- [x] **2.4** Ensure valid selections route through the existing Explorer contextual search flow and execute immediately.

## 3. Verification

- [x] **3.1** Add or update tests for menu enablement rules covering short, long, multiline, carriage-return, and tab-containing selections.
- [x] **3.2** Add or update tests confirming valid viewer selections populate Explorer Search and show results for both ChangeViewer and SpecViewer entry points.
- [x] **3.3** Run the project's relevant frontend checks.
- [x] **3.4** Run `openspec validate add-viewer-selection-search --strict`.
