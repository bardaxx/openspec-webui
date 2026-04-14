<script lang="ts">
  import { FileArchive, FolderPlus } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import { layoutStore } from '../stores/layout.svelte.ts';
</script>

<div class="flex h-full w-full items-center justify-center bg-background p-4 text-center">
  <div class="flex max-w-md flex-col items-center gap-6">
    <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <FileArchive class="h-8 w-8" />
    </div>

    <div class="flex flex-col gap-2">
      <h2 class="text-2xl font-bold tracking-tight">No Active Project</h2>
      <p class="text-muted-foreground">
        OpenSpec requires a project to store specifications and changes.
        Browse for a directory containing an <code>openspec/</code> folder.
      </p>
    </div>

    <Button size="lg" onclick={() => layoutStore.openOverlay('add-project')}>
      <FolderPlus class="mr-2 h-5 w-5" />
      Add Project
    </Button>
  </div>
</div>
