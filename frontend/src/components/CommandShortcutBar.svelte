<script lang="ts">
  import type { WorkflowCommand } from '../lib/commandTypes';
  import { buildCommand } from '../lib/commandShortcuts';
  import { addToast } from '../stores/index';
  import { commandPreferencesStore } from '../stores/commandPreferences';

  export let commands: WorkflowCommand[] = [];
  export let changeName: string | null = null;
  export let title = 'OpenSpec Commands';
  export let description = '';

  async function copyCommand(command: WorkflowCommand) {
    const text = buildCommand(command, $commandPreferencesStore.aiTool, changeName ?? undefined);

    try {
      await navigator.clipboard.writeText(text);
      addToast('Copied to clipboard!', 'success');
    } catch {
      addToast('Failed to copy', 'error');
    }
  }
</script>

{#if commands.length > 0}
  <div class="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-lg">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-400">{title}</h2>
        {#if description}
          <p class="mt-1 text-sm text-gray-400">{description}</p>
        {/if}
      </div>

      <div class="flex flex-wrap gap-2">
        {#each commands as command}
          <button
            type="button"
            class="rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-left text-sm text-gray-200 transition-colors hover:border-blue-500 hover:bg-gray-950 hover:text-white"
            title={`Copy ${buildCommand(command, $commandPreferencesStore.aiTool, changeName ?? undefined)}`}
            onclick={() => copyCommand(command)}
          >
            <code class="font-mono text-xs sm:text-sm">{buildCommand(command, $commandPreferencesStore.aiTool, changeName ?? undefined)}</code>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}
