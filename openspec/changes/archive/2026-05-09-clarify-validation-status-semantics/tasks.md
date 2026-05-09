## 1. Data Model and Normalization

- [x] 1.1 Add or update shared validation types for file-level `info` status and issue-bearing item lists/counts.
- [x] 1.2 Centralize file-level status derivation from `valid` and highest issue severity.
- [x] 1.3 Update server validation normalization to populate `failedItems`, issue-bearing items, and status counts consistently.
- [x] 1.4 Preserve existing validation execution options and command failure behavior.

## 2. Frontend State and Display Semantics

- [x] 2.1 Update `deriveValidationTargetSummary` to distinguish failed, warning, info, passed, stale, not-run, and unknown states.
- [x] 2.2 Update shared validation status visuals to include `info` status.
- [x] 2.3 Update Validation Explorer list data source to render non-passed issue-bearing items instead of only invalid failed items.
- [x] 2.4 Ensure Explorer rows and inline validation summaries use file-level status labels while issue details use issue severity labels.

## 3. Tests and Verification

- [x] 3.1 Add/update server tests for invalid items, warning-only valid items, and info-only valid items.
- [x] 3.2 Add/update validation core tests for failed, warning, info, passed, stale, not-run, and unknown summaries.
- [x] 3.3 Run project test/typecheck/build validation and fix regressions.
