<script lang="ts">
  import {
    initializeData,
    setupWebSocket,
  } from './stores/index.svelte.ts';
  import { commandPreferencesStore } from './stores/commandPreferences.svelte.ts';
  import { themeStore } from './stores/theme.svelte.ts';
  import AppLayout from './components/layout/AppLayout.svelte';
  import { Toaster } from '$lib/components/ui/sonner';

  $effect(() => {
    themeStore.initialize();

    void initializeData();
    void commandPreferencesStore.initialize();
    const unsubscribe = setupWebSocket();

    return () => {
      unsubscribe();
      themeStore.destroy();
    };
  });
</script>

<div class="h-screen overflow-hidden bg-background text-foreground">
  <AppLayout />
  <Toaster position="bottom-right" duration={3000} />
</div>
