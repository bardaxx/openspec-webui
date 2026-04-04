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
            class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  bg-green-900 text-gray-300 hover:bg-gray-600"
            title={`Copy ${buildCommand(command, $commandPreferencesStore.aiTool, changeName ?? undefined)}`}
            onclick={() => copyCommand(command)}
          >
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
            <span class="text-sm font-medium">{command}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}
