<script lang="ts">
  import { decodeName } from '$lib/utils';
  import { ErrorBanner } from '$lib/components/ui/error-banner';
  import { LoadingState } from '$lib/components/ui/loading-state';
  import { error, initializeData, isLoading } from '../../stores/index.svelte.ts';
  import { tabStore } from '../../stores/tabs.svelte.ts';
  import Dashboard from '../Dashboard.svelte';
  import ChangeViewer from '../ChangeViewer.svelte';
  import SpecViewer from '../SpecViewer.svelte';
  import TabBar from './TabBar.svelte';

  let activeTab = $derived(tabStore.activeTab);
  let activePath = $derived(activeTab.path);
  let specName = $derived(activePath.startsWith('/specs/') ? decodeName(activePath.slice('/specs/'.length)) : null);
  let changeName = $derived(activePath.startsWith('/changes/') ? decodeName(activePath.slice('/changes/'.length)) : null);
</script>

<div class="flex h-full min-h-0 min-w-0 flex-col bg-background">
  <TabBar />

  <div class="flex min-h-0 min-w-0 flex-1">
    <div class="min-h-0 min-w-0 flex-1 overflow-auto">
      <div class="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        {#if isLoading.value}
          <LoadingState />
        {:else if error.value}
          <ErrorBanner error={error.value} onRetry={() => initializeData()} />
        {:else if activePath === '/'}
          <Dashboard />
        {:else if specName}
          <SpecViewer specName={specName} />
        {:else if changeName}
          <ChangeViewer changeName={changeName} />
        {:else}
          <Dashboard />
        {/if}
      </div>
    </div>
  </div>
</div>
