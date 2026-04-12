## MODIFIED Requirements

### Requirement: IconBox component
The system SHALL provide an `IconBox` component in `$lib/components/ui/icon-box/` that renders a colored icon inside a rounded background box. The component SHALL accept `size` (`"sm"` | `"md"` | `"lg"`), `variant` (`"info"` | `"success"` | `"muted"` | `"warning"` | `"danger"`), and `icon` (Svelte component) props.

#### Scenario: Render info icon box
- **WHEN** an IconBox is rendered with `size="md"` and `variant="info"` and `icon={FileText}`
- **THEN** it renders a rounded box with info background color containing the FileText icon

#### Scenario: Render small success icon box
- **WHEN** an IconBox is rendered with `size="sm"` and `variant="success"` and `icon={FileText}`
- **THEN** it renders a small rounded box with success background color
