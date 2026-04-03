export type AiTool = 'default' | 'claude-code';

export const CORE_COMMANDS = ['propose', 'explore', 'apply', 'archive'] as const;
export type CoreCommand = (typeof CORE_COMMANDS)[number];

export const EXPANDED_COMMANDS = ['new', 'continue', 'ff', 'verify', 'sync', 'bulk-archive'] as const;
export type ExpandedCommand = (typeof EXPANDED_COMMANDS)[number];

export type WorkflowCommand = CoreCommand | ExpandedCommand;

export const EXPANDED_COMMAND_LABELS: Record<ExpandedCommand, string> = {
  new: 'New',
  continue: 'Continue',
  ff: 'Fast Forward',
  verify: 'Verify',
  sync: 'Sync',
  'bulk-archive': 'Bulk Archive',
};
