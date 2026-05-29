# OpenSpec WebUI

OpenSpec WebUI is a local-first interface for exploring and managing OpenSpec projects.  
This glossary defines the product language used in planning and execution workflows.

## Language

**Roadmap register**:  
The canonical planning file at `openspec/roadmap.md` that tracks slices, status, and execution order for a larger epic. It is a planning artifact, not an OpenSpec change.
_Avoid_: timeline file, backlog file, program file

**Slice**:  
A bounded unit of work inside the roadmap, identified by a stable id such as `F01` or `T03`. One implementable slice maps to one OpenSpec change folder.
_Avoid_: ticket, story

**Slice status**:  
The lifecycle state of a slice in the roadmap: `Ready`, `Spec Proposed`, `Applying`, `Applied`, `Archived`, or `Blocked`. This status is distinct from git branch state.
_Avoid_: stage, generic phase

**OpenSpec change**:  
A concrete change artifact under `openspec/changes/<change-id>/` containing proposal/design/tasks and implementation scope for one slice.
_Avoid_: spec folder, package

**Candidate OpenSpec change id**:  
The roadmap-declared id used verbatim to create and track the corresponding change folder, using `<slice-id-lower>-<slice-title-kebab>`.
_Avoid_: generated slug from conversation, ad-hoc folder name

**Recommended execution order**:  
The ordered sequence of slices that should run next based on dependencies and priority, recorded in `openspec/roadmap.md`.
_Avoid_: implicit queue, unstated order
