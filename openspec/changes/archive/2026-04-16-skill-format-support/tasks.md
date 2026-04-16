## 1. Shared Command Types

- [x] 1.1 In `commandTypes.ts`, replace `AiTool` with `CommandFormat` using `'standard' | 'claude-code' | 'skill'`
- [x] 1.2 In `commandTypes.ts`, export `ALL_COMMANDS`, `CORE_COMMAND_LABELS`, and keep `WorkflowCommand` as the shared command ID union for unified visibility state
- [x] 1.3 In `commandPreferencesCore.ts`, add shared normalization/persistence helpers for `format` and unified `commandVisibility`, including legacy `default` / `expandedVisibility` migration

## 2. Command Building Logic

- [x] 2.1 In `commandShortcuts.ts`, add a `SKILL_NAMES` lookup mapping every surfaced workflow ID to its corresponding skill name
- [x] 2.2 In `commandShortcuts.ts`, update `buildCommand()` to accept `CommandFormat` and return skill invocations using the `SKILL_NAMES` lookup
- [x] 2.3 In `commandShortcuts.ts`, update `CommandPreferencesSnapshot` to use `format` and unified `commandVisibility` covering all 10 commands
- [x] 2.4 In `commandShortcuts.ts`, add `isCoreCommand()` and `isCommandEnabled()` so core commands respect visibility and expanded commands respect visibility + availability
- [x] 2.5 In `commandShortcuts.ts`, update `getWorkspaceCommands()` / `getChangeCommands()` to filter only the commands relevant to each context and respect unified visibility state

## 3. Preferences Store

- [x] 3.1 In `commandPreferences.svelte.ts`, wrap the new `commandPreferencesCore.ts` helpers so the runtime store exposes `format`, `commandVisibility`, and availability state
- [x] 3.2 In `commandPreferences.svelte.ts`, load legacy `aiTool: 'default'` data as `format: 'standard'` and migrate legacy `expandedVisibility` into unified `commandVisibility`
- [x] 3.3 In `commandPreferences.svelte.ts`, update persistence/setters to use `setFormat()` and `setCommandVisibility()` with default core command visibility set to `true`

## 4. Settings UI

- [x] 4.1 In `SettingsModal.svelte`, rename the sidebar section from `AI Tool` to `Workflow`
- [x] 4.2 In `SettingsModal.svelte`, render three workflow radio options: Standard (`/opsx-X`), Claude Code (`/opsx:X`), and Skill (`/openspec-X`), with preview examples for workspace and change commands
- [x] 4.3 In `SettingsModal.svelte`, add a `Core Commands` group above `Expanded Commands` using unified `commandVisibility`
- [x] 4.4 In `SettingsModal.svelte`, keep expanded-command availability gating and switch it to unified `commandVisibility`

## 5. Integration + Verification

- [x] 5.1 Update `CommandShortcutBar.svelte` and any callers to use `format` for OPSX / Claude Code / Skill workflow output safely
- [x] 5.2 Verify `command-chip.svelte` usage still renders short labels while tooltips/copy payloads use the selected format
- [x] 5.3 Add / adjust unit tests for command preferences migration / persistence and command-shortcut workflow command generation / visibility
- [x] 5.4 Verify command rows respect visibility toggles across workspace/change contexts in both slash-command and skill formats
