<script lang="ts">
  import { tick } from 'svelte';
  import { ArrowRight, CircleDot, GitBranch, ListTodo, Map, Milestone } from '@lucide/svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { EmptyState } from '$lib/components/shared/empty-state';
  import { InsetPanel, SectionHeader, SurfaceCard } from '$lib/components/shared/surface';
  import { project } from '$lib/state/appData.svelte.ts';
  import type { SearchNavigationState } from '$lib/state/search.svelte.ts';
  import { tabStore } from '$lib/state/tabs.svelte.ts';
  import { FIXED_LABELS } from '$lib/uiText';

  let roadmap = $derived(project.value?.roadmap ?? null);
  let viewerState = $derived(tabStore.getViewerState<{ searchNavigation?: SearchNavigationState }>(tabStore.activeTab.id));
  let selectedSliceId = $derived(viewerState?.searchNavigation?.matchLocation?.roadmapSliceId ?? null);

  $effect(() => {
    if (!selectedSliceId) {
      return;
    }

    void tick().then(() => {
      document.getElementById(`roadmap-slice-${selectedSliceId}`)?.scrollIntoView({ behavior: 'auto', block: 'center' });
    });
  });

  function statusVariant(status: string) {
    switch (status) {
      case 'Applied':
      case 'Archived':
        return 'success';
      case 'Applying':
      case 'Spec Proposed':
        return 'info';
      case 'Blocked':
        return 'destructive';
      default:
        return 'outline';
    }
  }
</script>

{#if !roadmap}
  <SurfaceCard shadow="sm">
    <div class="p-6">
      <EmptyState message={FIXED_LABELS.viewer.roadmap.empty} icon={Map} />
    </div>
  </SurfaceCard>
{:else}
  <div class="space-y-6">
    <SurfaceCard shadow="sm">
      <SectionHeader>
        <div class="flex items-start justify-between gap-3">
          <div>
            <h1 class="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Map class="h-5 w-5 text-info" />
              {FIXED_LABELS.common.roadmap}
            </h1>
            {#if roadmap.prd}
              <p class="mt-1 text-sm text-muted-foreground">{roadmap.prd}</p>
            {/if}
          </div>
          {#if roadmap.statusModel}
            <Badge variant="outline">{roadmap.statusModel}</Badge>
          {/if}
        </div>
      </SectionHeader>

      <div class="grid gap-3 p-4 md:grid-cols-3">
        <InsetPanel class="space-y-2">
          <div class="flex items-center gap-2 text-sm font-medium text-foreground">
            <Milestone class="h-4 w-4 text-muted-foreground" />
            {FIXED_LABELS.dashboard.roadmapSummary}
          </div>
          <div class="text-3xl font-semibold text-foreground">{roadmap.slices.length}</div>
          <div class="text-sm text-muted-foreground">Slices registered in `openspec/roadmap.md`.</div>
        </InsetPanel>

        <InsetPanel class="space-y-2">
          <div class="flex items-center gap-2 text-sm font-medium text-foreground">
            <ListTodo class="h-4 w-4 text-muted-foreground" />
            {FIXED_LABELS.viewer.roadmap.recommendedOrder}
          </div>
          {#if roadmap.recommendedExecutionOrder.length > 0}
            <ol class="space-y-1 text-sm text-foreground">
              {#each roadmap.recommendedExecutionOrder as entry}
                <li>{entry}</li>
              {/each}
            </ol>
          {:else}
            <div class="text-sm text-muted-foreground">No recommended execution order was parsed.</div>
          {/if}
        </InsetPanel>

        <InsetPanel class="space-y-2">
          <div class="flex items-center gap-2 text-sm font-medium text-foreground">
            <GitBranch class="h-4 w-4 text-muted-foreground" />
            {FIXED_LABELS.viewer.roadmap.statusModel}
          </div>
          <div class="text-sm text-foreground">{roadmap.statusModel || 'No status model was parsed.'}</div>
        </InsetPanel>
      </div>
    </SurfaceCard>

    <SurfaceCard shadow="sm">
      <SectionHeader>
        <h2 class="text-lg font-semibold text-foreground">{FIXED_LABELS.common.roadmap}</h2>
      </SectionHeader>

      {#if roadmap.slices.length === 0}
        <div class="p-4">
          <EmptyState message={FIXED_LABELS.viewer.roadmap.noSlices} icon={CircleDot} />
        </div>
      {:else}
        <div class="space-y-3 p-4">
          {#each roadmap.slices as slice}
            <InsetPanel
              id={`roadmap-slice-${slice.id}`}
              class={`scroll-mt-6 space-y-4 border ${selectedSliceId === slice.id ? 'border-info bg-info-bg/40' : 'border-border'}`}
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="space-y-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{slice.id}</Badge>
                    <Badge variant={statusVariant(slice.status)}>{slice.status}</Badge>
                    {#if slice.candidateChangeId}
                      <Badge variant="secondary">{slice.candidateChangeId}</Badge>
                    {/if}
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-foreground">{slice.title}</h3>
                    {#if slice.goal}
                      <p class="mt-1 text-sm text-muted-foreground">{slice.goal}</p>
                    {/if}
                  </div>
                </div>
                {#if slice.specLink}
                  <div class="text-xs text-muted-foreground">{slice.specLink}</div>
                {/if}
              </div>

              {#if slice.notes}
                <div class="space-y-1">
                  <div class="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{FIXED_LABELS.viewer.roadmap.goal}</div>
                  <div class="text-sm text-foreground">{slice.notes}</div>
                </div>
              {/if}

              <div class="grid gap-3 lg:grid-cols-3">
                <div class="space-y-2">
                  <div class="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{FIXED_LABELS.viewer.roadmap.files}</div>
                  {#if slice.files.length > 0}
                    <ul class="space-y-1 text-sm text-foreground">
                      {#each slice.files as file}
                        <li>{file}</li>
                      {/each}
                    </ul>
                  {:else}
                    <div class="text-sm text-muted-foreground">No scoped files listed.</div>
                  {/if}
                </div>

                <div class="space-y-2">
                  <div class="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{FIXED_LABELS.viewer.roadmap.dependencies}</div>
                  {#if slice.dependency}
                    <div class="space-y-1 text-sm text-foreground">
                      <div>Depends on: {slice.dependency.dependsOn.length > 0 ? slice.dependency.dependsOn.join(', ') : 'none'}</div>
                      <div>Blocks: {slice.dependency.blocks.length > 0 ? slice.dependency.blocks.join(', ') : 'none'}</div>
                      <div>Parallel: {slice.dependency.canRunInParallel == null ? 'unknown' : slice.dependency.canRunInParallel ? 'yes' : 'no'}</div>
                    </div>
                  {:else}
                    <div class="text-sm text-muted-foreground">No dependency metadata parsed.</div>
                  {/if}
                </div>

                <div class="space-y-2">
                  <div class="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{FIXED_LABELS.viewer.roadmap.progressLog}</div>
                  {#if slice.progress.length > 0}
                    <ul class="space-y-1 text-sm text-foreground">
                      {#each slice.progress as entry}
                        <li class="flex items-start gap-2">
                          <ArrowRight class="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span><strong>{entry.label}:</strong> {entry.value}</span>
                        </li>
                      {/each}
                    </ul>
                  {:else}
                    <div class="text-sm text-muted-foreground">No progress log parsed.</div>
                  {/if}
                </div>
              </div>
            </InsetPanel>
          {/each}
        </div>
      {/if}
    </SurfaceCard>
  </div>
{/if}
