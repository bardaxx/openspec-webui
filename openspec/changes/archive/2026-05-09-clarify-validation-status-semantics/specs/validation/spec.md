## ADDED Requirements

### Requirement: Validation distinguishes file status from issue severity
The system SHALL distinguish file-level validation status from issue-level severity. File-level status SHALL describe a validation target such as a spec, change, project, or unknown item. Issue-level severity SHALL describe an individual validation issue. The system SHALL NOT use issue severity labels as the file-level status label for a validation target.

#### Scenario: Failed file with error issue
- **WHEN** a validation item is invalid or contains an `ERROR` issue
- **THEN** the item-level status is `failed`
- **AND** the issue detail preserves the `ERROR` severity

#### Scenario: Warning file with warning issue
- **WHEN** a validation item is valid, contains no `ERROR` issues, and contains at least one `WARNING` issue
- **THEN** the item-level status is `warning`
- **AND** issue details preserve their `WARNING` severity

#### Scenario: Info file with only info issues
- **WHEN** a validation item is valid, contains no `ERROR` or `WARNING` issues, and contains at least one `INFO` issue
- **THEN** the item-level status is `info`
- **AND** issue details preserve their `INFO` severity

#### Scenario: Passed file without issues
- **WHEN** a validation item is valid and contains no issues
- **THEN** the item-level status is `passed`

### Requirement: Validation result exposes issue-bearing items
The validation result returned to the client SHALL expose invalid/failed items separately from issue-bearing items. `failedItems` SHALL contain items that are invalid or have failed item status. The result SHALL also expose `issueItems` or an equivalent field containing every item with one or more issues, including valid items with `WARNING` or `INFO` issues. Summary counts SHALL allow the client to render failed, warning, and info item counts without reinterpreting issue severities in each UI surface.

#### Scenario: Invalid item appears in both failed and issue lists
- **WHEN** a validation item is invalid and has at least one issue
- **THEN** the result includes the item in `failedItems`
- **AND** the result includes the item in `issueItems`

#### Scenario: Valid warning item appears only in issue list
- **WHEN** a validation item is valid and has a `WARNING` issue without an `ERROR` issue
- **THEN** the result does not include the item in `failedItems`
- **AND** the result includes the item in `issueItems`
- **AND** the item's derived status is `warning`

#### Scenario: Valid info item appears only in issue list
- **WHEN** a validation item is valid and has only `INFO` issues
- **THEN** the result does not include the item in `failedItems`
- **AND** the result includes the item in `issueItems`
- **AND** the item's derived status is `info`

## MODIFIED Requirements

### Requirement: Execute project validation from the WebUI
The system SHALL expose a project-scoped validation action that runs OpenSpec validation for the active workspace using all-item validation semantics equivalent to `openspec validate --all [--strict] [--concurrency <n>] --json`. Strict mode SHALL default to enabled for backward compatibility. The action SHALL return a normalized validation result containing overall status, pass/fail counts, per-item issue summaries, issue-bearing items, item-level status counts, last-run timestamp, and raw command failure context when command execution fails outside normal validation failure semantics.

#### Scenario: Validation passes
- **WHEN** the operator runs validation for an active project whose OpenSpec content is valid and contains no issues
- **THEN** the system returns a validation result with overall status `passed`
- **AND** the failed item count is `0`
- **AND** the issue item count is `0`
- **AND** the result records the validation run timestamp

#### Scenario: Validation fails with invalid OpenSpec content
- **WHEN** the operator runs validation for an active project whose OpenSpec content has validation errors
- **THEN** the system returns a validation result with overall status `failed`
- **AND** the result includes one or more failed validation items
- **AND** the API response is treated as validation domain data rather than a generic server error

#### Scenario: Validation returns informational issues without failing
- **WHEN** the operator runs validation and the active project has only valid items with `INFO` issues
- **THEN** the system returns a validation result with overall status `passed`
- **AND** the failed item count is `0`
- **AND** the issue item count is greater than `0`
- **AND** at least one item-level status count is recorded as `info`

#### Scenario: Validation defaults to strict mode
- **WHEN** the client runs validation without explicit execution options
- **THEN** the server executes validation with `--strict`
- **AND** existing validation callers retain strict validation behavior

#### Scenario: Validation runs without strict mode
- **WHEN** the client runs validation with strict mode disabled
- **THEN** the server omits `--strict` from the OpenSpec validation command

#### Scenario: Validation runs with concurrency
- **WHEN** the client runs validation with a positive integer concurrency value
- **THEN** the server includes `--concurrency <n>` in the OpenSpec validation command

#### Scenario: Invalid concurrency is ignored
- **WHEN** the client sends a missing, non-integer, or non-positive concurrency value
- **THEN** the server omits `--concurrency`
- **AND** validation still runs with the remaining normalized options

#### Scenario: Validation cannot execute
- **WHEN** validation cannot be executed because the project context is missing or the command cannot be launched
- **THEN** the system reports an API error using the existing structured error pattern
- **AND** the previous validation result, if any, is not replaced by an incomplete result
- **AND** command failure context records the actual validation command that was attempted

### Requirement: Render Validation panel in the Explorer Pane
The system SHALL provide a dedicated Validation panel in the Explorer Pane. The panel SHALL display a compact header, Run Validate action, last-run metadata, loading and error states, validation result summary, and a list of validation items requiring attention. The panel SHALL keep persistent validation preferences out of the Explorer header, SHALL avoid duplicating summary counts between the header and result list, SHALL place last-run metadata on its own line so the run button loading spinner does not cause horizontal layout shift, and SHALL remain visible after a validation item opens a Main Viewer tab. The list SHALL render non-passed validation items using file-level status rather than issue severity labels.

#### Scenario: Open Validation panel from Activity Bar
- **WHEN** the operator clicks the Validate icon in the Activity Bar
- **THEN** the Explorer Pane opens if collapsed
- **AND** the Explorer Pane switches to the Validation panel

#### Scenario: Initial Validation panel state
- **WHEN** the Validation panel is opened before any validation run has completed
- **THEN** the panel shows a Run Validate action
- **AND** it explains how to run validation without duplicating result summary counts

#### Scenario: Last-run metadata remains stable during loading
- **WHEN** the operator starts validation and the Run button adds a loading spinner
- **THEN** the last-run metadata remains on a separate line from the button
- **AND** the metadata does not shift horizontally because the button width changed

#### Scenario: Display attention validation items
- **WHEN** the latest validation result has failed, warning, or info items
- **THEN** the Validation panel lists those non-passed items
- **AND** each row displays the file-level status and issue count
- **AND** the row does not use `ERROR`, `WARNING`, or `INFO` issue severity as the file-level status label

#### Scenario: Display passing validation state
- **WHEN** the latest validation result has no failed, warning, or info items
- **THEN** the Validation panel shows a passing status
- **AND** it does not show stale failed or issue items from an earlier run
