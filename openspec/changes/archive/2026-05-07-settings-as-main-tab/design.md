## Context

Settings is currently a 583-line modal dialog (`SettingsModal.svelte`) that opens as an overlay via `layoutStore.toggleOverlay('settings')`. The modal has a two-column layout: left section menu (4 sections) and right content panel with section-switching via `activeSection` state.

The main tab system supports 3 tab types (`dashboard`, `spec`, `change`) with state-based routing through `tabs.svelte.ts` and content rendering in `MainViewer.svelte`.

## Goals / Non-Goals

**Goals:**
- Convert settings from modal overlay to a main tab with `settings` tab type
- Replace modal section switching with a single scrollable content area where menu buttons scroll to corresponding card sections
- Make settings layout responsive-friendly (left menu stacks on narrow viewports)
- Enable easy addition of new settings sections without changing navigation logic

**Non-Goals:**
- Changing the actual settings content or options (theme, locale, workflow, commands, versions)
- Adding new settings sections in this change (just the structural conversion)
- Removing the modal infrastructure entirely (Dialog components remain available for other overlays)
- Changing how settings state is persisted (existing stores remain as-is)

## Decisions

### 1. Settings as regular closeable tab (not pinned, not preview)
**Decision**: Settings tab opens as a normal (non-pinned, non-preview) tab via `tabStore.openSettings()`. The user closes it manually when done, just like closing a spec or change tab.

**Rationale**: Settings doesn't need to be always-visible. Opening it from the Activity Bar is sufficient — it behaves like any other content tab. Using a regular tab keeps the interaction model consistent (open from Activity Bar → close when done).

**Alternative considered**: Pinned always-visible tab — rejected because the user prefers on-demand access where they close the tab themselves.

### 2. Single scrollable content area with anchor-based section navigation
**Decision**: Right panel renders all settings groups in one scrollable container as discrete card sections. Left menu buttons use `scrollIntoView()` to navigate to section anchors on those cards. Active section is tracked via `IntersectionObserver`.

**Rationale**: User explicitly requested this layout. It's more extensible than conditional rendering — adding a section only requires appending HTML, no routing logic. It also handles narrow viewports naturally (stack to vertical scroll).

**Alternative considered**: Keep conditional rendering (`activeSection` state) — rejected per user request for a scrollable, connected settings surface. A later visual refinement keeps the single scroll container but separates the right-side content into card sections so it does not feel like one undifferentiated page.

### 3. Extract content into `SettingsView.svelte`, delete `SettingsModal.svelte`
**Decision**: Create `SettingsView.svelte` as the new component with the left-menu + scrollable content layout. Delete `SettingsModal.svelte` entirely.

**Rationale**: No other code opens the settings modal directly. The overlay-based settings opening is only triggered from the Activity Bar gear icon. Clean extraction with no backward compatibility needed.

### 4. Settings tab is a regular closeable tab
**Decision**: Settings tab is NOT pinned and NOT in preview mode. It opens as a regular tab with a close button, like spec/change tabs. The operator closes it when no longer needed.

**Rationale**: The Activity Bar gear icon always allows re-opening settings. Keeping it as a normal tab avoids cluttering the tab bar when settings isn't in use.

### 5. Dashboard-aligned `max-w-7xl` page frame
**Decision**: Settings view uses the same centered `max-w-7xl px-4 py-6 lg:px-6` page frame as Dashboard, while preserving its internal two-column layout and scrollable right content area.

**Rationale**: Rendering Settings at full browser width made the page feel stretched and inconsistent with Dashboard. Constraining the overall frame to the same maximum width as Dashboard keeps the app's main content rhythm consistent, while the settings content area still handles its own responsive two-column grid (`lg:grid lg:grid-cols-[14rem_minmax(0,1fr)]`) and internal section spacing.

### 6. Card sections for the right-side settings content
**Decision**: Each top-level settings group (General, Workflow, Commands, Versions) is rendered as a design-system surface card with a section header and card body. Nested version status groups use inset panels.

**Rationale**: The initial single right-side page technically satisfied scroll navigation, but visually read as one long connected page. Card sections match Dashboard's surface treatment and make each settings group easier to scan without changing the anchor-based navigation model.

## Risks / Trade-offs

- **Scroll state loss on tab switch**: Switching away from the Settings tab and back will reset scroll position → Acceptable since settings interactions are typically quick. Could add scroll position restoration later if needed.
- **IntersectionObserver overhead**: Tracking active section via IntersectionObserver adds a small runtime cost → Negligible for a static settings page with 4 sections.
- **No modal fallback**: Some users may prefer the modal pattern → Can be re-added later if requested, but the tab approach is more consistent with the app's navigation model.
