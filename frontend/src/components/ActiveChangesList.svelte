<script lang="ts">
  import type { ChangeSummary } from '../lib/api';
  import TaskProgress from './TaskProgress.svelte';

  export let changes: ChangeSummary[] = [];
  export let onSelect: (changeName: string) => void = () => {};
</script>

<div class="divide-y divide-gray-700">
  {#if changes.length === 0}
    <div class="px-6 py-8 text-center text-gray-400">No active changes</div>
  {:else}
    {#each changes as change}
      <button class="w-full px-6 py-4 hover:bg-gray-700/50 text-left" onclick={() => onSelect(change.name)}>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <div class="font-medium text-gray-100">{change.name}</div>
              <div class="text-sm text-gray-400 flex items-center gap-2 mt-1">
                <span>{change.specDeltaCount} spec delta{change.specDeltaCount !== 1 ? 's' : ''}</span>
                {#if change.hasDesign}
                  <span class="px-1.5 py-0.5 text-xs bg-purple-900 text-purple-300 rounded">design</span>
                {/if}
              </div>
            </div>
          </div>
          <div class="w-32">
            <TaskProgress progress={change.taskProgress} size="sm" />
          </div>
        </div>
      </button>
    {/each}
  {/if}
</div>
