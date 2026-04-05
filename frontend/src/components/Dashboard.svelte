<script lang="ts">
  import { activeChanges, project, navigateTo } from '../stores/index';
  import { commandPreferencesStore } from '../stores/commandPreferences';
  import { getWorkspaceCommands } from '../lib/commandShortcuts';
  import MarkdownRenderer from './MarkdownRenderer.svelte';
  import ActiveChangesList from './ActiveChangesList.svelte';
  import CommandShortcutBar from './CommandShortcutBar.svelte';

  $: workspaceCommands = getWorkspaceCommands($activeChanges, $commandPreferencesStore);
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-2xl font-bold text-gray-100">Home</h1>
    {#if $project?.description}
      <p class="text-gray-400 mt-1">{$project.description}</p>
    {/if}
  </div>

  <!-- Active Changes -->
  <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
    <div class="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-100">
        Active Changes
        <span class="ml-2 px-1.5 py-0.5 text-xs bg-gray-600 text-gray-300 rounded-full">{$activeChanges.length}</span>
      </h2>
      <CommandShortcutBar commands={workspaceCommands} />
    </div>
    <ActiveChangesList changes={$activeChanges} onSelect={(name) => navigateTo(`/changes/${name}`)} />
  </div>

  <!-- Project Info -->
  {#if $project?.content}
    <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <div class="px-6 py-4 border-b border-gray-700">
        <h2 class="text-lg font-semibold text-gray-100">Project Documentation</h2>
      </div>
      <div class="px-6 py-4">
        <MarkdownRenderer content={$project.content} />
      </div>
    </div>
  {/if}
</div>
