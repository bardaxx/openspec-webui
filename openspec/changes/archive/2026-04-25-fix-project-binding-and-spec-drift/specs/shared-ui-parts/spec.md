## MODIFIED Requirements

### Requirement: CommandChip component
The system SHALL provide a `CommandChip` component in `$lib/components/shared/command-chip/` that renders a compact, emphasized command shortcut control. The component SHALL accept `label` (string), optional `title` (string), and optional `icon` (Svelte component) props, and SHALL forward standard button attributes and click handling. The component SHALL be visually distinct from standard Button variants by using a compact pill-style shape and command-emphasis styling.

#### Scenario: Render command chip with icon
- **WHEN** a CommandChip is rendered with `label="propose"` and `icon={Clipboard}`
- **THEN** it renders a compact pill-style control with the icon and label

#### Scenario: Render emphasized compact styling
- **WHEN** a CommandChip is rendered next to a standard action button
- **THEN** it uses a smaller visual height and denser spacing than the standard button
- **AND** it keeps command-emphasis colors instead of inheriting the default Button look

### Requirement: ItemContextMenu shared component
The system SHALL provide an `ItemContextMenu` component in `$lib/components/shared/item-context-menu/` as part of the shared UI parts. The component SHALL be importable via `$lib/components/shared/item-context-menu`.

#### Scenario: Import ItemContextMenu
- **WHEN** a component imports from `$lib/components/shared/item-context-menu`
- **THEN** the `ItemContextMenu` component is available for use
