## Context

V1 adds the Validation Explorer Pane panel and manual validation run state. V2 adds item-local viewer status. V3 adds a small Dashboard glance so validation becomes visible from the app's landing/status surface.

The Dashboard already uses top summary cards for high-level project counts and navigational shortcuts. The Validation card should sit beside those cards, not replace the Validation panel. Its job is to answer: "Is this workspace currently valid, and where do I click to investigate?"

## Goals / Non-Goals

**Goals:**
- Add one Validation card to the Dashboard top summary card row.
- Show latest validation health in a compact form: passed, failed count, not run, running, or stale/unknown as supported by V1 state.
- Route card clicks to the Validation Explorer Pane panel.
- Match existing Dashboard card visual patterns.

**Non-Goals:**
- No validation issue list inside the Dashboard card.
- No automatic validation run when Dashboard loads.
- No Dashboard-specific validation API.
- No new `/validate` route or Main Viewer tab.
- No Settings configuration for validation behavior.

## Decisions

### 1. Dashboard card links to the Validation panel

**Decision**: Clicking the Validation card SHALL set the Activity/Explorer preset to `validate`, opening the Explorer Pane panel introduced in V1.

**Rationale**: The Dashboard is only a glance surface. The Explorer Pane remains the issue index, so the card should navigate there instead of duplicating details.

**Alternative considered**: Open a validation page in Main Viewer. Rejected for the same reason as V1: validation does not need a standalone route.

### 2. Compact summary, no issue list

**Decision**: The card shows a short status label and key number, such as failed item count or a passed indicator. It does not render individual failure messages.

**Rationale**: The card row must remain scannable and consistent with existing Dashboard cards. Detailed lists belong in the Validation panel and V2 viewer details.

**Alternative considered**: Put top failures in the card. Rejected because it quickly becomes cramped and stale.

### 3. No auto-run from Dashboard

**Decision**: The Dashboard reads the latest validation state and may show `Not run` or equivalent when no result exists. It does not automatically execute validation on render.

**Rationale**: Manual validation from V1 is predictable and avoids a potentially expensive CLI run just from viewing the Dashboard.

**Alternative considered**: Auto-run validation when Dashboard opens. Rejected until the cost and UX are better understood.

## Risks / Trade-offs

- **Summary row crowding** → Use the existing responsive grid and allow the row to wrap naturally.
- **Stale or missing validation result** → Label the state clearly as not run/unknown rather than implying pass.
- **V1 state shape may change** → Recheck V3 before implementation and derive card values from the final validation store API.
- **Badge color semantics** → Keep colors aligned with existing IconBox/status variants and avoid overly alarming styling for not-run states.

## Open Questions

- Whether the card should include a small `Run Validate` affordance or only navigate to the panel should be decided after V1 UI is implemented.
- Whether the Dashboard grid should become 5 cards or reorganize at larger breakpoints should be checked visually during implementation.
