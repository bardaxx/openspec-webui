<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **openspec-webui** (8354 symbols, 11566 relationships, 282 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/openspec-webui/context` | Codebase overview, check index freshness |
| `gitnexus://repo/openspec-webui/clusters` | All functional areas |
| `gitnexus://repo/openspec-webui/processes` | All execution flows |
| `gitnexus://repo/openspec-webui/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->

## OpenSpec Roadmap (PRD -> multiple changes)

Use this layer when a PRD or epic would otherwise become one oversized OpenSpec change.

| Step | What | Where |
|------|------|--------|
| 1 | PRD or issue | Issue tracker / `PRD.md` file |
| 2 | Decompose into prioritized slices | `openspec/roadmap.md` |
| 3 | Per slice with status `Ready` | `openspec-propose` -> `openspec/changes/<Candidate OpenSpec change id>/` (exact id from roadmap) |
| 4 | Implement | `openspec-apply-change` (slice -> `Applying` -> `Applied`) |
| 5 | Complete | `openspec-archive-change` (slice -> `Archived`) |

**Rules**

- `openspec/roadmap.md` is the planning file only — do not copy `proposal.md` / `design.md` / `tasks.md` into it.
- Implementable slices are **1:1** with OpenSpec changes (`Candidate OpenSpec change id`).
- On propose, pass the slice's `Candidate OpenSpec change id` verbatim to `openspec-propose` — format `<slice-id-lower>-<slice-title-kebab>`.
- Slice lifecycle: `Ready` -> `Spec Proposed` -> `Applying` -> `Applied` -> `Archived` (`Blocked` when decisions are pending).
- Keep `next` atomic (one gate per command) and enforce `Applying` WIP limits from roadmap policy.
- Run OpenSpec spec verification after each lifecycle gate and fix issues before the next gate.
- Pick the next slice by priority and recommended execution order in the roadmap.
- Update the roadmap after every propose, apply, and archive step.
- Keep roadmap entries concise and operational.
- Enforce context/token limits via `openspec/config.yaml` (`openspec_roadmap`).

**Skill**

| Task | Skill file |
|------|------------|
| Bootstrap roadmap, add slices, update lifecycle | `.agents/skills/openspec-roadmap/SKILL.md` |
| Roadmap template and checklists | `.agents/skills/openspec-roadmap/REFERENCE.md` |

@RTK.md
