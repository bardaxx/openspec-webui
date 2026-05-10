## 1. Investigation

- [x] **1.1** Confirm that Validation Explorer header filters render `info` with informational styling while row badges render `info` as a muted secondary badge.
- [x] **1.2** Confirm that Validation Explorer rows never receive active selection state from the current Main Viewer tab.

## 2. Shared info badge semantics

- [x] **2.1** Add a shared Badge `info` variant for informational status/severity surfaces.
- [x] **2.2** Update shared validation status/severity badge mappings so file-level `info` uses the informational tone instead of `secondary`.

## 3. Validation row selection sync

- [x] **3.1** Derive validation row paths using the same spec/change path rules used when opening a validation item.
- [x] **3.2** Pass active selection state to validation rows when their path matches the active Main Viewer tab.

## 4. Verification

- [x] **4.1** Add or update regression coverage for informational badge tone and validation-row active selection.
- [x] **4.2** Verify existing validation navigation, filters, and persistent-panel behavior still work.
- [x] **4.3** Run relevant frontend validation and review for side effects in other shared status/severity indicators.
