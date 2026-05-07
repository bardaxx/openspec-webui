## 1. Summary Derivation

- [x] 1.1 Recheck the final V1 validation state API and define Dashboard summary derivation for not-run, running, passed, failed, and stale/unknown states
- [x] 1.2 Add tests for deriving primary value, description, icon variant, and failed count from validation state

## 2. Dashboard Card UI

- [x] 2.1 Add a Validation card to the Dashboard top summary card grid using the existing InteractiveCard/IconBox pattern
- [x] 2.2 Render concise content for not-run, running, passed, and failed states
- [x] 2.3 Ensure the card remains readable in the Dashboard responsive grid when the row has five cards

## 3. Navigation Wiring

- [x] 3.1 Wire card activation to open the Explorer Pane with the `validate` preset from V1
- [x] 3.2 Ensure clicking the card does not open a validation Main Viewer tab or trigger a validation run by itself
- [x] 3.3 Verify the Validation panel opens with the current validation result preserved

## 4. Verification

- [x] 4.1 Add Dashboard tests for card rendering and click behavior
- [x] 4.2 Run `npm test`
- [x] 4.3 Run `npm run typecheck`
- [x] 4.4 Run `openspec validate add-validation-dashboard-summary --strict`
