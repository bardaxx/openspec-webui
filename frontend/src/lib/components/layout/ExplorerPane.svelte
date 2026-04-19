<script lang="ts">
  import { Folder, FolderPen } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    ActiveChangesExplorerSection,
    ArchiveExplorerSection,
    SpecsExplorerSection,
  } from '$lib/components/shared/explorer-section';
  import * as ScrollArea from '$lib/components/ui/scroll-area';
  import { getWorkspaceCommands } from '$lib/commandShortcuts';
  import { activeChanges, archivedChanges, project, specs } from '$lib/state/appData.svelte.ts';
  import { commandPreferencesStore } from '$lib/state/commandPreferences.svelte.ts';
  import { layoutStore } from '$lib/state/layout.svelte.ts';
  import CommandShortcutBar from '$lib/components/shared/CommandShortcutBar.svelte';

  interface Props {
    temporary?: boolean;
    onItemSelected?: () => void;
    onRequestClose?: () => void;
  }

  let {
    temporary = false,
    onItemSelected = () => {},
    onRequestClose = () => {},
  }: Props = $props();

  function commandPreferencesSnapshot() {
    return {
      format: commandPreferencesStore.format,
      commandVisibility: commandPreferencesStore.commandVisibility,
      availability: commandPreferencesStore.availability,
    };
  }

  let workspaceCommands = $derived(getWorkspaceCommands(activeChanges.value, commandPreferencesSnapshot()));

  function openProjectSelector() {
    layoutStore.openOverlay('project-selector');
  }
</script>

<aside class="flex h-full min-h-0 flex-col bg-card">
  <div class={`gap-3 border-b border-border px-3 py-2 ${!temporary ? 'bg-secondary/70' : ''}`}>
    <div class="flex min-w-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <Folder class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span class="truncate">Current Project</span>
    </div>
    <div class="mt-1 flex min-w-0 items-center gap-1 rounded-md border border-border px-2 py-1 bg-background" >
      <span class="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{project.value?.name ?? 'OpenSpec WebUI'}</span>
      <Button
        variant="ghost"
        size="icon"
        class="ml-auto size-7 shrink-0 text-muted-foreground hover:text-foreground"
        aria-label="Open project selector"
        onclick={openProjectSelector}
      >
        <FolderPen class="h-4 w-4" />
      </Button>
    </div>
  </div>

  <ScrollArea.Root class="min-h-0 flex-1" viewportClass="h-full">
    <div class="space-y-4 p-3">
      {#snippet activeChangesExtra()}
        {#if workspaceCommands.length > 0}
          <CommandShortcutBar commands={workspaceCommands} />
        {/if}
      {/snippet}

      <ActiveChangesExplorerSection
        changes={activeChanges.value}
        {onItemSelected}
        headerExtra={activeChangesExtra}
      />

      <ArchiveExplorerSection
        changes={archivedChanges.value}
        {onItemSelected}
      />

      <SpecsExplorerSection
        specs={specs.value}
        {onItemSelected}
      />
    </div>
  </ScrollArea.Root>
</aside>
