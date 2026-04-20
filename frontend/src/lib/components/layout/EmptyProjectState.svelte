<script lang="ts">
  import { FileArchive, FolderPlus } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n';
  import * as m from '$lib/paraglide/messages.js';
  import { layoutStore } from '$lib/state/layout.svelte.ts';
  import { FIXED_LABELS } from '$lib/uiText';
</script>

<div class="flex h-full w-full items-center justify-center bg-background p-4 text-center">
  <div class="flex max-w-md flex-col items-center gap-6">
    <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <FileArchive class="h-8 w-8" />
    </div>

    <div class="flex flex-col gap-2">
      <h2 class="text-2xl font-bold tracking-tight">{FIXED_LABELS.emptyProject.title}</h2>
      <p class="text-muted-foreground">
        {t(m.empty_project_description)}
      </p>
    </div>

    <Button size="lg" onclick={() => layoutStore.openOverlay('add-project')}>
      <FolderPlus class="mr-2 h-5 w-5" />
      {FIXED_LABELS.emptyProject.addProject}
    </Button>
  </div>
</div>
