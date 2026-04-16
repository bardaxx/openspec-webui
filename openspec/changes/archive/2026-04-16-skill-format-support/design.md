## Context

The WebUI generates copyable command strings for OpenSpec workflows. Currently two workflow options exist (`default` → `/opsx-X`, `claude-code` → `/opsx:X`), both OPSX-based. OpenSpec also provides installable skills (`openspec-*/SKILL.md`) for AI tools that support the skills standard, and the current upstream docs use `/openspec-*` as the skill-based invocation form for tools without command adapters. The WebUI needs to offer that skill-based workflow as a third option.

Additionally, core commands (propose, explore, apply, archive) are hardcoded as always-visible with no user toggle. Some OpenSpec workflow configurations may not use all core commands, making fixed display undesirable.

The change affects four frontend files with no server-side impact (command availability remains CLI-driven).

## Goals / Non-Goals

**Goals:**
- Add "Skill" as a third workflow option, generating `/openspec-<skill-name>` strings
- Map workflow IDs to their non-obvious skill names (e.g., `apply` → `openspec-apply-change`)
- Make core commands individually togglable in settings
- Rename "AI Tool" section to "Workflow", "Default" label to "Standard"
- Maintain backward compatibility — existing stored preferences continue to work

**Non-Goals:**
- Tool-specific command-adapter detection beyond the three user-selected formats
- Auto-detecting which format the user's tool supports
- Adding the `onboard` command (out of scope)
- Server-side changes (command availability detection stays as-is)

## Decisions

### D1: Skill name lookup table rather than naming convention

The mapping from workflow ID to skill name is irregular: some use `openspec-{id}`, others use `openspec-{id}-change`, and `sync` maps to `openspec-sync-specs`. A hardcoded lookup table is the simplest correct approach.

**Alternative considered:** Derive skill names algorithmically (e.g., always append `-change`). Rejected because the naming is not consistent and is defined by OpenSpec's upstream code generation.

### D2: Unify core and expanded visibility under one structure

Rename `expandedVisibility` to `commandVisibility` covering all 10 commands. Core commands default to visible, expanded commands default to visible but gated by availability. This simplifies the mental model — every command has a visibility toggle, and availability is a separate concern.

**Alternative considered:** Keep separate `coreVisibility` and `expandedVisibility` objects. Rejected because the logic is identical (just a boolean toggle per command), and the settings UI will group them visually anyway.

### D3: Rename AiTool to CommandFormat

The type `AiTool` with values `'default' | 'claude-code'` doesn't semantically fit a three-way choice that includes "Skill". Rename to `CommandFormat` with values `'standard' | 'claude-code' | 'skill'`, while exposing the setting in the UI as a workflow choice.

**Migration:** Stored localStorage values use `'default'` → treat as `'standard'` on load (backward compat). New saves write `'standard'`.

### D4: Settings section renamed from "AI Tool" to "Workflow"

Short label that better matches the official docs distinction: normal OPSX workflow vs skill workflow, with Claude Code as an OPSX-specific edge case in command syntax.

### D5: Skill availability is determined by user installation, not repo contents

The WebUI must not infer skill support from which skill files are visible in this repository. Skills are installed by the user into their coding tool environment. The `SKILL_NAMES` lookup exists to generate the right invocation string for each surfaced workflow; it is not a probe of what happens to be present in this repo checkout.

## Risks / Trade-offs

- **[localStorage migration]** Users with stored `aiTool: 'default'` must be gracefully handled → normalization function maps `'default'` → `'standard'` on load
- **[Skill name drift]** If OpenSpec changes skill naming in future, the lookup table must be updated → table is isolated in `commandShortcuts.ts`, easy to update
- **[Core command toggle confusion]** Users might accidentally hide all core commands → core commands default to ON, and the toggle is clearly labeled
