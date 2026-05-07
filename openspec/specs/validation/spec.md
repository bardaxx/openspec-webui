## ADDED Requirements

### Requirement: Execute project validation from the WebUI
The system SHALL expose a project-scoped validation action that runs OpenSpec validation for the active workspace using strict all-item validation semantics equivalent to `openspec validate --all --strict --json`. The action SHALL return a normalized validation result containing overall status, pass/fail counts, per-item issue summaries, last-run timestamp, and raw command failure context when command execution fails outside normal validation failure semantics.

#### Scenario: Validation passes
- **WHEN** the operator runs validation for an active project whose OpenSpec content is valid
- **THEN** the system returns a validation result with overall status `passed`
- **AND** the failed item count is `0`
- **AND** the result records the validation run timestamp

#### Scenario: Validation fails with invalid OpenSpec content
- **WHEN** the operator runs validation for an active project whose OpenSpec content has validation errors
- **THEN** the system returns a validation result with overall status `failed`
- **AND** the result includes one or more failed validation items
- **AND** the API response is treated as validation domain data rather than a generic server error

#### Scenario: Validation cannot execute
- **WHEN** validation cannot be executed because the project context is missing or the command cannot be launched
- **THEN** the system reports an API error using the existing structured error pattern
- **AND** the previous validation result, if any, is not replaced by an incomplete result

### Requirement: Normalize validation items for UI navigation
The system SHALL normalize validation output into item records that identify the affected item type, item name, severity, issue count, and human-readable messages when available. Item types SHALL include at least `spec` and `change`; project-level or unclassified failures SHALL be represented without breaking the result list. For navigable item types, the result SHALL include enough information for the client to open the existing corresponding Main Viewer tab.

#### Scenario: Spec validation item is navigable
- **WHEN** validation reports a failure for capability spec `ui-localization`
- **THEN** the normalized item has type `spec` and name `ui-localization`
- **AND** selecting the item can open or focus the existing spec tab for `ui-localization`

#### Scenario: Change validation item is navigable
- **WHEN** validation reports a failure for change `add-validation-panel`
- **THEN** the normalized item has type `change` and name `add-validation-panel`
- **AND** selecting the item can open or focus the existing change tab for `add-validation-panel`

#### Scenario: Unclassified validation item remains visible
- **WHEN** validation reports a project-level or otherwise unclassified failure
- **THEN** the normalized result includes the failure in the Validation panel list
- **AND** the item does not require document navigation to remain visible

### Requirement: Manage validation run state in the client
The system SHALL maintain frontend validation state for the active project, including the latest normalized result, loading state, API error state, and stale-response protection. Starting a new validation run SHALL prevent older in-flight responses from overwriting newer results.

#### Scenario: Run button shows loading state
- **WHEN** the operator starts validation from the Validation panel
- **THEN** the client marks validation as loading
- **AND** duplicate validation submissions are disabled until the current run resolves

#### Scenario: Stale validation response is ignored
- **WHEN** an older validation request resolves after a newer validation request
- **THEN** the older response does not replace the latest validation result

#### Scenario: Active project changes
- **WHEN** the active project context changes
- **THEN** validation state for the previous project is not displayed as the current project's fresh result

### Requirement: Render Validation panel in the Explorer Pane
The system SHALL provide a dedicated Validation panel in the Explorer Pane. The panel SHALL display a header, explanatory text, Run Validate action, last-run status, pass/fail counts, loading and error states, and a list of failed validation items. The panel SHALL follow the existing Explorer Pane visual language and SHALL remain visible after a validation item opens a Main Viewer tab.

#### Scenario: Open Validation panel from Activity Bar
- **WHEN** the operator clicks the Validate icon in the Activity Bar
- **THEN** the Explorer Pane opens if collapsed
- **AND** the Explorer Pane switches to the Validation panel

#### Scenario: Initial Validation panel state
- **WHEN** the Validation panel is opened before any validation run has completed
- **THEN** the panel shows a Run Validate action
- **AND** it explains that validation checks the active project's specs and changes

#### Scenario: Display failed validation items
- **WHEN** the latest validation result has failed items
- **THEN** the Validation panel lists the failed items with item type, item name, severity, and issue count
- **AND** the panel shows the total failed item count

#### Scenario: Display passing validation state
- **WHEN** the latest validation result passed
- **THEN** the Validation panel shows a passing status
- **AND** it does not show stale failed items from an earlier run

### Requirement: Navigate from validation failures to existing document tabs
Selecting a navigable validation item in the Validation panel SHALL open or focus the existing spec or change tab for that item in the Main Viewer. The Validation panel SHALL remain the active Explorer Pane panel so operators can continue working through multiple failures.

#### Scenario: Open spec from validation item
- **WHEN** the operator selects a failed validation item of type `spec` named `activity-bar`
- **THEN** the Main Viewer opens or focuses the spec tab for `activity-bar`
- **AND** the Validation panel remains visible in the Explorer Pane

#### Scenario: Open change from validation item
- **WHEN** the operator selects a failed validation item of type `change` named `add-validation-panel`
- **THEN** the Main Viewer opens or focuses the change tab for `add-validation-panel`
- **AND** the Validation panel remains visible in the Explorer Pane

#### Scenario: Select non-navigable validation item
- **WHEN** the operator selects a validation item without a supported navigation target
- **THEN** the system does not open an invalid tab
- **AND** the item remains visible in the Validation panel
