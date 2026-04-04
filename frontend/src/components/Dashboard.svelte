<script lang="ts">
  import { stats, activeChanges, project, navigateTo } from '../stores/index';
  import { commandPreferencesStore } from '../stores/commandPreferences';
  import { getWorkspaceCommands } from '../lib/commandShortcuts';
  import TaskProgress from './TaskProgress.svelte';
  import MarkdownRenderer from './MarkdownRenderer.svelte';
  import ActiveChangesList from './ActiveChangesList.svelte';
  import CommandShortcutBar from './CommandShortcutBar.svelte';

  $: workspaceCommands = getWorkspaceCommands($activeChanges, $commandPreferencesStore);
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-2xl font-bold text-gray-100">Dashboard</h1>
    {#if $project?.description}
      <p class="text-gray-400 mt-1">{$project.description}</p>
    {/if}
  </div>

  <!-- Stats Cards -->
  {#if $stats}
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
        <div class="text-sm font-medium text-gray-400">Total Specs</div>
        <div class="text-3xl font-bold text-gray-100 mt-1">{$stats.totalSpecs}</div>
      </div>
      <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
        <div class="text-sm font-medium text-gray-400">Active Changes</div>
        <div class="text-3xl font-bold text-blue-400 mt-1">{$stats.activeChanges}</div>
      </div>
      <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
        <div class="text-sm font-medium text-gray-400">Archived Changes</div>
        <div class="text-3xl font-bold text-gray-100 mt-1">{$stats.archivedChanges}</div>
      </div>
      <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
        <div class="text-sm font-medium text-gray-400">Overall Progress</div>
        <div class="mt-2">
          <TaskProgress progress={$stats.overallTaskProgress} showLabel={true} />
        </div>
      </div>
    </div>
  {/if}

  <!-- Active Changes -->
  <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
    <div class="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-100">Active Changes</h2>
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
