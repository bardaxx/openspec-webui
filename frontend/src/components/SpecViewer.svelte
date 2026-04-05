<script lang="ts">
  import { onMount } from 'svelte';
  import { getSpec, type Spec } from '../lib/api';
  import { navigateTo, specsRefreshTrigger } from '../stores/index';
  import Icon from './Icon.svelte';
  import MarkdownRenderer from './MarkdownRenderer.svelte';

  export let specName: string;

  let spec: Spec | null = null;
  let loading = true;
  let error: string | null = null;
  let activeTab: 'spec' | 'design' = 'spec';
  let lastRefreshTrigger = 0;

  onMount(async () => {
    await loadSpec();
    lastRefreshTrigger = $specsRefreshTrigger;
  });

  // React to WebSocket refresh signals - preserve state on hot reload
  $: if ($specsRefreshTrigger > lastRefreshTrigger) {
    lastRefreshTrigger = $specsRefreshTrigger;
    loadSpec(true);
  }

  async function loadSpec(preserveState = false) {
    // Only show loading state on initial load, not hot reload
    if (!preserveState) {
      loading = true;
    }
    error = null;
    try {
      spec = await getSpec(specName);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load spec';
    } finally {
      loading = false;
    }
  }

  $: if (specName) loadSpec();
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center gap-4">
    <button
      type="button"
      aria-label="Back to specs list"
      title="Back to specs list"
      class="p-2 hover:bg-surface rounded-lg"
      onclick={() => navigateTo('/specs')}
    >
      <Icon name="chevron-left" class="h-5 w-5 text-on-surface-muted" />
    </button>
    <div>
      <h1 class="text-2xl font-bold text-on-bg">{specName}</h1>
      <p class="text-on-surface-muted">Specification</p>
    </div>
  </div>

  {#if loading}
    <div class="flex items-center justify-center h-64">
      <div class="text-on-surface-muted">Loading...</div>
    </div>
  {:else if error}
    <div class="rounded-lg border border-danger-border bg-danger-bg p-4">
      <p class="text-danger">{error}</p>
    </div>
  {:else if spec}
    <!-- Tabs -->
    {#if spec.designContent}
      <div class="border-b border-border">
        <nav class="flex space-x-4">
          <button
            class="px-4 py-2 border-b-2 font-medium text-sm transition-colors {activeTab === 'spec'
              ? 'border-brand text-brand'
              : 'border-transparent text-on-surface-muted hover:text-on-surface'}"
            onclick={() => (activeTab = 'spec')}
          >
            Specification
          </button>
          <button
            class="px-4 py-2 border-b-2 font-medium text-sm transition-colors {activeTab === 'design'
              ? 'border-brand text-brand'
              : 'border-transparent text-on-surface-muted hover:text-on-surface'}"
            onclick={() => (activeTab = 'design')}
          >
            Design
          </button>
        </nav>
      </div>
    {/if}

    <!-- Content -->
    <div class="bg-surface rounded-lg shadow-lg border border-border p-6">
      {#if activeTab === 'spec'}
        <MarkdownRenderer content={spec.specContent} />
      {:else if spec.designContent}
        <MarkdownRenderer content={spec.designContent} />
      {/if}
    </div>
  {/if}
</div>
