<script lang="ts">
  import { Clipboard } from '@lucide/svelte';
  import { CommandChip } from '$lib/components/ui/command-chip';
  import type { WorkflowCommand } from '../lib/commandTypes';
  import { buildCommand } from '../lib/commandShortcuts';
  import { toast } from 'svelte-sonner';
  import { commandPreferencesStore } from '../stores/commandPreferences.svelte.ts';

  interface Props {
    commands?: WorkflowCommand[];
    changeName?: string | null;
  }

  let { commands = [], changeName = null }: Props = $props();

  function commandText(command: WorkflowCommand): string {
    return buildCommand(command, commandPreferencesStore.format, changeName ?? undefined);
  }

  async function copyCommand(command: WorkflowCommand) {
    const text = commandText(command);

    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  }
</script>

{#if commands.length > 0}
  <div class="flex max-w-full flex-wrap items-center gap-1.5">
    {#each commands as command}
      {@const text = commandText(command)}
      <CommandChip
        label={command}
        icon={Clipboard}
        title={`Copy ${text}`}
        onclick={() => copyCommand(command)}
      />
    {/each}
  </div>
{/if}
