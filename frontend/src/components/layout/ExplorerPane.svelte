<script lang="ts">
  import { Archive, Calendar, CheckSquare, FileText, Folder, FolderPen, SquarePen } from '@lucide/svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { EmptyState } from '$lib/components/ui/empty-state';
  import { ExplorerSection as SharedExplorerSection } from '$lib/components/ui/explorer-section';
  import * as ScrollArea from '$lib/components/ui/scroll-area';
  import { getWorkspaceCommands } from '../../lib/commandShortcuts';
  import { activeChanges, archivedChanges, project, specs } from '../../stores/index.svelte.ts';
  import { commandPreferencesStore } from '../../stores/commandPreferences.svelte.ts';
  import { layoutStore, type ExplorerSection } from '../../stores/layout.svelte.ts';
  import { tabStore } from '../../stores/tabs.svelte.ts';
  import CommandShortcutBar from '../CommandShortcutBar.svelte';
  import { Progress } from '$lib/components/ui/progress';
  import { formatChangeName } from '../../lib/utils';
  import * as utils from '../../lib/utils';

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

  let workspaceCommands = $derived(getWorkspaceCommands(activeChanges.value, commandPreferencesStore));
  const formatExplorerDate = ((utils as Record<string, unknown>).formatDate ?? (() => '')) as (
    iso: string | null | undefined,
  ) => string;

  type TimestampedChange = {
    lastModified?: string | null;
  };

  type TimestampedSpec = {
    lastModified?: string | null;
  };

  function sectionOpen(section: ExplorerSection) {
    return !layoutStore.sectionCollapsed[section];
  }

  function openTab(path: string, section: ExplorerSection) {
    layoutStore.focusSection(section);
    tabStore.open(path);
    onItemSelected();
  }

  function itemClass(path: string) {
    return tabStore.activeTab.path === path
      ? 'bg-primary/10 text-foreground'
      : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground';
  }

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

      <SharedExplorerSection
        title="Active Changes"
        icon={SquarePen}
        count={activeChanges.value.length}
        open={sectionOpen('active-changes')}
        focused={layoutStore.focusedSection === 'active-changes'}
        onToggle={() => {
          const nextOpen = !sectionOpen('active-changes');
          layoutStore.setSectionCollapsed('active-changes', !nextOpen);
          if (nextOpen) {
            layoutStore.focusSection('active-changes');
          }
        }}
        headerExtra={activeChangesExtra}
      >
        <div class="divide-y divide-border/70">
          {#if activeChanges.value.length === 0}
            <EmptyState message="No active changes" icon={SquarePen} class="px-3 py-6" />
          {:else}
            {#each activeChanges.value as change}
              <button
                type="button"
                class={`flex w-full items-start gap-3 px-3 py-3 text-left transition-colors ${itemClass(`/changes/${encodeURIComponent(change.name)}`)}`}
                onclick={() => openTab(`/changes/${encodeURIComponent(change.name)}`, 'active-changes')}
              >
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm font-medium" title={change.name}>{change.name}</div>
                  <div class="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <div class="flex items-center gap-2">
                      {#if (change as TimestampedChange).lastModified}
                        <span class="flex items-center gap-0.5"><Calendar class="h-3 w-3" />{formatExplorerDate((change as TimestampedChange).lastModified)}</span>
                      {/if}
                      <span class="flex items-center gap-0.5"><FileText class="h-3 w-3" />{change.specDeltaCount}</span>
                      <span class="flex items-center gap-0.5"><CheckSquare class="h-3 w-3" />{change.taskProgress.done}/{change.taskProgress.total}</span>
                    </div>
                    <div class="w-14 shrink-0">
                      <Progress value={change.taskProgress.percentage} />
                    </div>
                  </div>
                </div>
              </button>
            {/each}
          {/if}
        </div>
      </SharedExplorerSection>

      <SharedExplorerSection
        title="Archive"
        icon={Archive}
        count={archivedChanges.value.length}
        open={sectionOpen('archive')}
        focused={layoutStore.focusedSection === 'archive'}
        onToggle={() => {
          const nextOpen = !sectionOpen('archive');
          layoutStore.setSectionCollapsed('archive', !nextOpen);
          if (nextOpen) {
            layoutStore.focusSection('archive');
          }
        }}
      >
        <div class="divide-y divide-border/70">
          {#if archivedChanges.value.length === 0}
            <EmptyState message="No archived changes" icon={Archive} class="px-3 py-6" />
          {:else}
            {#each archivedChanges.value as change}
              <button
                type="button"
                class={`flex w-full items-start gap-3 px-3 py-3 text-left transition-colors ${itemClass(`/changes/${encodeURIComponent(change.name)}`)}`}
                onclick={() => openTab(`/changes/${encodeURIComponent(change.name)}`, 'archive')}
              >
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm font-medium" title={change.name}>{formatChangeName(change.name)}</div>
                  <div class="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    {#if change.archivedDate}
                      <span class="flex items-center gap-0.5"><Calendar class="h-3 w-3" />{change.archivedDate}</span>
                    {/if}
                    <span class="flex items-center gap-0.5"><FileText class="h-3 w-3" />{change.specDeltaCount}</span>
                    <span class="flex items-center gap-0.5"><CheckSquare class="h-3 w-3" />{change.taskProgress.done}/{change.taskProgress.total}</span>
                  </div>
                </div>
              </button>
            {/each}
          {/if}
        </div>
      </SharedExplorerSection>

      <SharedExplorerSection
        title="Specs"
        icon={FileText}
        count={specs.value.length}
        open={sectionOpen('specs')}
        focused={layoutStore.focusedSection === 'specs'}
        onToggle={() => {
          const nextOpen = !sectionOpen('specs');
          layoutStore.setSectionCollapsed('specs', !nextOpen);
          if (nextOpen) {
            layoutStore.focusSection('specs');
          }
        }}
      >
        <div class="divide-y divide-border/70">
          {#if specs.value.length === 0}
            <EmptyState message="No specs found" icon={FileText} class="px-3 py-6" />
          {:else}
            {#each specs.value as spec}
              <button
                type="button"
                class={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors ${itemClass(`/specs/${encodeURIComponent(spec.name)}`)}`}
                onclick={() => openTab(`/specs/${encodeURIComponent(spec.name)}`, 'specs')}
              >
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm font-medium">{spec.name}</div>
                  <div class="mt-1 flex items-center gap-0.5 text-xs text-muted-foreground">
                    {#if (spec as TimestampedSpec).lastModified}
                      <Calendar class="h-3 w-3" />{formatExplorerDate((spec as TimestampedSpec).lastModified)}
                    {/if}
                  </div>
                </div>

                {#if spec.hasDesign}
                  <Badge variant="outline" class="text-[10px] font-medium">Design</Badge>
                {/if}
              </button>
            {/each}
          {/if}
        </div>
      </SharedExplorerSection>
    </div>
  </ScrollArea.Root>
</aside>
