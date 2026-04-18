<script lang="ts">
  import { Archive, FileText, House, PanelLeftClose, PanelLeftOpen, Search, Settings } from '@lucide/svelte';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { decodeName } from '$lib/utils';
  import { archivedChanges, project } from '$lib/state/appData.svelte.ts';
  import { projectStore } from '$lib/state/projects.svelte.ts';
  import { layoutStore, type ActivityPreset } from '$lib/state/layout.svelte.ts';
  import { tabStore } from '$lib/state/tabs.svelte.ts';

  function sectionFromPath(path: string): ActivityPreset {
    if (path === '/specs' || path.startsWith('/specs/')) {
      return 'specs';
    }

    if (path === '/changes') {
      return 'archive';
    }

    if (path.startsWith('/changes/')) {
      const changeName = decodeName(path.slice('/changes/'.length));
      return archivedChanges.value.some((change) => change.name === changeName) ? 'archive' : 'home';
    }

    return 'home';
  }

  let lastSyncedContext = $state('');

  $effect(() => {
    const path = tabStore.activeTab.path;
    const archivedNames = archivedChanges.value.map((change) => change.name).join('\u0000');
    const syncContext = `${path}::${archivedNames}`;

    if (syncContext === lastSyncedContext) {
      return;
    }

    lastSyncedContext = syncContext;
    layoutStore.syncActivityPreset(sectionFromPath(path));
  });

  let activeSection = $derived.by(() => {
    if (layoutStore.overlay === 'search') {
      return 'search';
    }

    if (layoutStore.overlay === 'settings') {
      return 'settings';
    }

    return layoutStore.activityPreset;
  });

  function openPreset(preset: ActivityPreset) {
    const isCurrentSection = activeSection === preset;

    layoutStore.closeOverlay();

    if (isCurrentSection && layoutStore.responsiveMode !== 'narrow' && !layoutStore.explorerCollapsed) {
      layoutStore.toggleExplorerCollapsed();
      return;
    }

    layoutStore.setActivityPreset(preset);

    if (preset === 'home') {
      tabStore.focus('/');
    }
  }

  function buttonClass(section: string) {
    return activeSection === section
      ? 'bg-primary text-primary-foreground shadow-sm'
      : 'text-muted-foreground hover:bg-primary/10 hover:text-primary';
  }

  function toggleExplorer() {
    layoutStore.closeOverlay();

    if (!projectStore.activeProjectId) {
      layoutStore.openOverlay('project-selector');
      return;
    }

    if (layoutStore.responsiveMode === 'narrow') {
      layoutStore.toggleNarrowDrawer();
      return;
    }

    layoutStore.toggleExplorerCollapsed();
  }

  let explorerOpen = $derived(
    projectStore.activeProjectId
      ? layoutStore.responsiveMode === 'narrow'
        ? layoutStore.narrowDrawerOpen
        : !layoutStore.explorerCollapsed
      : false
  );

  let topControlLabel = $derived(
    !projectStore.activeProjectId
      ? 'Open project selector'
      : explorerOpen
        ? 'Collapse explorer'
        : 'Expand explorer'
  );
</script>

<aside class="relative z-60 flex h-full w-12 shrink-0 flex-col items-center border-r border-border bg-secondary/70 py-2">
  <Tooltip.Root>
    <Tooltip.Trigger
      class={`flex h-10 w-10 items-center justify-center rounded-lg bg-transparent transition-colors ${projectStore.activeProjectId && explorerOpen ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground ${layoutStore.overlay === 'project-selector' ? 'text-primary' : ''}`}
      aria-label={topControlLabel}
      onclick={toggleExplorer}
    >
      {#if projectStore.activeProjectId}
        {#if explorerOpen}
          <PanelLeftClose class="h-5 w-5" />
        {:else}
          <PanelLeftOpen class="h-5 w-5" />
        {/if}
      {:else}
        <img src="/app-icon.svg" alt="" aria-hidden="true" class="h-6 w-6 rounded-sm" />
      {/if}
      <span class="sr-only">{project.value?.name ?? 'OpenSpec WebUI'}</span>
    </Tooltip.Trigger>
    <Tooltip.Content side="right">
      <span>{topControlLabel}</span>
    </Tooltip.Content>
  </Tooltip.Root>

  <div class="mt-3 flex flex-col gap-2">
    <Tooltip.Root>
      <Tooltip.Trigger
        class={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${buttonClass('home')}`}
        aria-label="Dashboard"
        onclick={() => openPreset('home')}
      >
        <House class="h-5 w-5" />
      </Tooltip.Trigger>
      <Tooltip.Content side="right">Dashboard</Tooltip.Content>
    </Tooltip.Root>

    <Tooltip.Root>
      <Tooltip.Trigger
        class={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${buttonClass('archive')}`}
        aria-label="Archive"
        onclick={() => openPreset('archive')}
      >
        <Archive class="h-5 w-5" />
      </Tooltip.Trigger>
      <Tooltip.Content side="right">Archive</Tooltip.Content>
    </Tooltip.Root>

    <Tooltip.Root>
      <Tooltip.Trigger
        class={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${buttonClass('specs')}`}
        aria-label="Specs"
        onclick={() => openPreset('specs')}
      >
        <FileText class="h-5 w-5" />
      </Tooltip.Trigger>
      <Tooltip.Content side="right">Specs</Tooltip.Content>
    </Tooltip.Root>
  </div>
  
  <div class="flex flex-col gap-2">
    <Tooltip.Root>
      <Tooltip.Trigger
        class={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${buttonClass('search')}`}
        aria-label="Search"
        onclick={() => layoutStore.toggleOverlay('search')}
      >
        <Search class="h-5 w-5" />
      </Tooltip.Trigger>
      <Tooltip.Content side="right">Search</Tooltip.Content>
    </Tooltip.Root>
  </div>

  <div class="mt-auto flex flex-col gap-2">
    <Tooltip.Root>
      <Tooltip.Trigger
        class={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${buttonClass('settings')}`}
        aria-label="Settings"
        onclick={() => layoutStore.toggleOverlay('settings')}
      >
        <Settings class="h-5 w-5" />
      </Tooltip.Trigger>
      <Tooltip.Content side="right">Settings</Tooltip.Content>
    </Tooltip.Root>
  </div>
</aside>
