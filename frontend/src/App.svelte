<script lang="ts">
  import { onMount } from 'svelte';
  import {
    initializeData,
    setupWebSocket,
    currentRoute,
    isLoading,
    error,
    project,
    toasts,
    navigateTo,
  } from './stores/index';
  import { commandPreferencesStore } from './stores/commandPreferences';
  import { themeStore } from './stores/theme';
  import Navigation from './components/Navigation.svelte';
  import Dashboard from './components/Dashboard.svelte';
  import SpecsList from './components/SpecsList.svelte';
  import SpecViewer from './components/SpecViewer.svelte';
  import ChangesList from './components/ChangesList.svelte';
  import ChangeViewer from './components/ChangeViewer.svelte';
  import Toast from './components/Toast.svelte';

  onMount(() => {
    // Set initial route from URL
    currentRoute.set(window.location.pathname);

    // Initialize theme
    themeStore.initialize();

    // Initialize data and WebSocket
    initializeData();
    void commandPreferencesStore.initialize();
    const unsubscribe = setupWebSocket();

    return () => {
      unsubscribe();
      themeStore.destroy();
    };
  });

  // Parse route to get component and params
  function parseRoute(route: string): { component: string; param?: string } {
    if (route === '/' || route === '') {
      return { component: 'dashboard' };
    }
    if (route === '/specs') {
      return { component: 'specs-list' };
    }
    if (route.startsWith('/specs/')) {
      return { component: 'spec-viewer', param: decodeURIComponent(route.slice(7)) };
    }
    if (route === '/changes') {
      return { component: 'changes-list' };
    }
    if (route.startsWith('/changes/')) {
      return { component: 'change-viewer', param: decodeURIComponent(route.slice(9)) };
    }
    return { component: 'dashboard' };
  }

  $: routeInfo = parseRoute($currentRoute);
</script>

<div class="min-h-screen bg-bg">
  <Navigation projectName={$project?.name || 'OpenSpec WebUI'} />

  <main class="max-w-7xl mx-auto px-4 py-6">
    {#if $isLoading}
      <div class="flex items-center justify-center h-64">
        <div class="text-on-surface-muted">Loading...</div>
      </div>
    {:else if $error}
      <div class="rounded-lg border border-danger-border bg-danger-bg p-4">
        <h2 class="font-semibold text-danger">Error</h2>
        <p class="text-danger">{$error}</p>
        <button
          class="mt-2 rounded px-4 py-2 bg-danger-solid text-on-brand transition-colors hover:bg-danger-solid-hover"
          onclick={() => initializeData()}
        >
          Retry
        </button>
      </div>
    {:else if routeInfo.component === 'dashboard'}
      <Dashboard />
    {:else if routeInfo.component === 'specs-list'}
      <SpecsList />
    {:else if routeInfo.component === 'spec-viewer' && routeInfo.param}
      <SpecViewer specName={routeInfo.param} />
    {:else if routeInfo.component === 'changes-list'}
      <ChangesList />
    {:else if routeInfo.component === 'change-viewer' && routeInfo.param}
      <ChangeViewer changeName={routeInfo.param} />
    {:else}
      <Dashboard />
    {/if}
  </main>

  <!-- Toast notifications -->
  <div class="fixed bottom-4 right-4 space-y-2">
    {#each $toasts as toast (toast.id)}
      <Toast message={toast.message} type={toast.type} />
    {/each}
  </div>
</div>
