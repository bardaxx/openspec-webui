## MODIFIED Requirements

### Requirement: TaskProgress removed in favor of shadcn Progress
The system SHALL NOT provide a custom `TaskProgress` component. All call sites SHALL use the shared `<Progress>` component from `$lib/components/ui/progress/` directly, passing `value={progress.percentage}`. The `size` prop SHALL be handled via standard CSS classes (`h-2` for compact, default height otherwise).

#### Scenario: Progress bar renders with percentage
- **WHEN** a change's task progress is displayed
- **THEN** it uses `<Progress value={progress.percentage} />` from `$lib/components/ui/progress/`
- **AND** no custom `TaskProgress` component exists in `frontend/src/components/`

#### Scenario: Compact progress bar in ExplorerPane
- **WHEN** the ExplorerPane renders a change's progress
- **THEN** it uses `<Progress value={progress.percentage} class="h-2" />` for a compact variant
