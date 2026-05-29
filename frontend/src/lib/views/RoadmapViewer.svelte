<script lang="ts">
  import { tick } from 'svelte';
  import {
    CircleDot,
    FileText,
    GitMerge,
    Link2,
    ListTodo,
    Map as MapIcon,
    Target,
  } from '@lucide/svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { EmptyState } from '$lib/components/shared/empty-state';
  import { InteractiveCard, InsetPanel, SectionHeader, SurfaceCard } from '$lib/components/shared/surface';
  import { project } from '$lib/state/appData.svelte.ts';
  import type { SearchNavigationState } from '$lib/state/search.svelte.ts';
  import { tabStore } from '$lib/state/tabs.svelte.ts';
  import { FIXED_LABELS } from '$lib/uiText';
  import type { BadgeVariant } from '$lib/visualSemantics';

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

  function progressVariant(label: string): BadgeVariant {
    const lower = label.toLowerCase();

    if (lower.includes('archived') || lower.includes('applied')) {
      return 'success';
    }

    if (lower.includes('applying') || lower.includes('proposed')) {
      return 'info';
    }

    if (lower.includes('validation') || lower.includes('blocked')) {
      return 'warning';
    }

    return 'outline';
  }

  function progressDotClass(label: string): string {
    const lower = label.toLowerCase();

    if (lower.includes('archived') || lower.includes('applied')) {
      return 'bg-success';
    }

    if (lower.includes('applying') || lower.includes('proposed')) {
      return 'bg-info';
    }

    if (lower.includes('validation') || lower.includes('blocked')) {
      return 'bg-warning';
    }

    return 'bg-muted-foreground/60';
  }

  function fileName(path: string): string {
    const parts = path.split('/');
    return parts.at(-1) ?? path;
  }

  function fileDirectory(path: string): string {
    const parts = path.split('/');
    if (parts.length <= 1) {
      return '';
    }

    return parts.slice(0, -1).join('/');
  }

  function dependencyValues(values: string[]): string[] {
    return values.length > 0 ? values : ['none'];
  }

  function sliceIdFromRecommendedEntry(entry: string): string | null {
    const match = entry.match(/^([A-Za-z]+\d+)/i);
    return match?.[1]?.toUpperCase() ?? null;
  }

  let roadmapStatusCounts = $derived.by(() => {
    const counts = new Map<string, number>();

    for (const slice of roadmap?.slices ?? []) {
      counts.set(slice.status, (counts.get(slice.status) ?? 0) + 1);
    }

    return Array.from(counts.entries()).sort((left, right) => left[0].localeCompare(right[0]));
  });

  let roadmapOverviewItems = $derived.by(() => {
    if (!roadmap) {
      return [];
    }

    const orderMap = new Map<string, number>();

    for (const [index, entry] of roadmap.recommendedExecutionOrder.entries()) {
      const sliceId = sliceIdFromRecommendedEntry(entry);
      if (sliceId) {
        orderMap.set(sliceId, index + 1);
      }
    }

    return [...roadmap.slices]
      .filter((slice) => slice.status !== 'Archived')
      .map((slice) => ({
        id: slice.id,
        title: slice.title,
        status: slice.status,
        goal: slice.goal,
        executionOrder: orderMap.get(slice.id.toUpperCase()) ?? null,
        latestProgressLabel: slice.progress.at(-1)?.label ?? null,
        fileCount: slice.files.length,
      }))
      .sort((left, right) => {
        if (left.executionOrder != null && right.executionOrder != null) {
          return left.executionOrder - right.executionOrder;
        }

        if (left.executionOrder != null) {
          return -1;
        }

        if (right.executionOrder != null) {
          return 1;
        }

        return left.id.localeCompare(right.id);
      });
  });

  function focusSlice(sliceId: string) {
    const currentViewerState = tabStore.getViewerState<Record<string, unknown>>(tabStore.activeTab.id) ?? {};

    tabStore.setViewerState(tabStore.activeTab.id, {
      ...currentViewerState,
      searchNavigation: {
        requestKey: Date.now(),
        matchLocation: { roadmapSliceId: sliceId },
      },
    });
  }
</script>

{#if !roadmap}
  <SurfaceCard shadow="sm">
    <div class="p-6">
      <EmptyState message={FIXED_LABELS.viewer.roadmap.empty} icon={MapIcon} />
    </div>
  </SurfaceCard>
{:else}
  <div class="space-y-6">
    <SurfaceCard shadow="sm">
      <SectionHeader compact={true}>
        <div class="space-y-2">
          <h1 class="flex items-center gap-2 text-xl font-semibold text-foreground">
            <MapIcon class="h-5 w-5 text-info" />
            {FIXED_LABELS.common.roadmap}
          </h1>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-muted-foreground">
              {#if roadmap.prd}
                {roadmap.prd}
              {:else}
                Slices registered in `openspec/roadmap.md`.
              {/if}
            </p>
            <div class="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline">{roadmap.slices.length} slices</Badge>
              {#each roadmapStatusCounts as [status, count]}
                <Badge variant={statusVariant(status)}>{status}: {count}</Badge>
              {/each}
              {#if roadmap.statusModel}
                <Badge variant="secondary">{roadmap.statusModel}</Badge>
              {/if}
            </div>
          </div>
        </div>
      </SectionHeader>

      {#if roadmapOverviewItems.length > 0}
        <div class="border-t border-border/70 px-4 pt-3">
          <div class="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {FIXED_LABELS.viewer.roadmap.pipeline}
          </div>
        </div>
        <div class="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-3">
          {#each roadmapOverviewItems as item}
            <InteractiveCard
              tone="inset"
              radius="sm"
              class={`overflow-hidden p-0 shadow-none ${selectedSliceId === item.id ? 'ring-1 ring-info/60' : ''}`}
            >
              <button
                type="button"
                class="group flex w-full items-start gap-3 px-4 py-3 text-left"
                onclick={() => focusSlice(item.id)}
              >
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-info-bg text-info"
                  aria-hidden="true"
                >
                  {#if item.executionOrder != null}
                    <span class="text-sm font-semibold">#{item.executionOrder}</span>
                  {:else}
                    <span class="px-0.5 text-[10px] font-mono font-semibold">{item.id}</span>
                  {/if}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex min-w-0 items-start gap-2">
                    <div class="min-w-0 flex-1 truncate font-medium text-foreground" title={item.title}>
                      {item.title}
                    </div>
                    <Badge variant={statusVariant(item.status)} class="shrink-0">{item.status}</Badge>
                  </div>
                  {#if item.goal}
                    <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.goal}</p>
                  {/if}
                  <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <Badge variant="outline" class="font-mono text-[10px]">{item.id}</Badge>
                    {#if item.fileCount > 0}
                      <span class="inline-flex items-center gap-1">
                        <FileText class="h-3 w-3 shrink-0" />
                        {item.fileCount}
                      </span>
                    {/if}
                    {#if item.latestProgressLabel}
                      <span class="truncate" title={item.latestProgressLabel}>{item.latestProgressLabel}</span>
                    {/if}
                  </div>
                </div>
              </button>
            </InteractiveCard>
          {/each}
        </div>
      {:else if roadmap.slices.length > 0}
        <div class="border-t border-border/70 p-4 text-sm text-muted-foreground">
          {FIXED_LABELS.viewer.roadmap.pipelineEmpty}
        </div>
      {/if}
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
              class={`scroll-mt-6 min-w-0 space-y-4 border ${selectedSliceId === slice.id ? 'border-info bg-info-bg/40' : 'border-border'}`}
            >
              <div class="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div class="min-w-0 space-y-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{slice.id}</Badge>
                    <Badge variant={statusVariant(slice.status)}>{slice.status}</Badge>
                    {#if slice.candidateChangeId}
                      <Badge variant="secondary" class="max-w-full truncate" title={slice.candidateChangeId}>
                        {slice.candidateChangeId}
                      </Badge>
                    {/if}
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-lg font-semibold text-foreground">{slice.title}</h3>
                    {#if slice.goal}
                      <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{slice.goal}</p>
                    {/if}
                  </div>
                </div>
                {#if slice.specLink}
                  <div class="flex min-w-0 shrink-0 items-center gap-1.5 rounded-sm border border-border/60 bg-background/50 px-2.5 py-1.5 lg:max-w-sm">
                    <Link2 class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <code class="min-w-0 truncate text-xs text-muted-foreground" title={slice.specLink}>{slice.specLink}</code>
                  </div>
                {/if}
              </div>

              {#if slice.notes}
                <InsetPanel dashed class="space-y-1.5">
                  <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <Target class="h-3.5 w-3.5" />
                    {FIXED_LABELS.viewer.roadmap.goal}
                  </div>
                  <p class="text-sm leading-relaxed text-foreground">{slice.notes}</p>
                </InsetPanel>
              {/if}

              <div class="grid min-w-0 gap-3 xl:grid-cols-12">
                <InsetPanel class="min-w-0 space-y-2 xl:col-span-5">
                  <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <FileText class="h-3.5 w-3.5" />
                    {FIXED_LABELS.viewer.roadmap.files}
                    {#if slice.files.length > 0}
                      <Badge variant="secondary" class="ml-auto normal-case tracking-normal">{slice.files.length}</Badge>
                    {/if}
                  </div>
                  {#if slice.files.length > 0}
                    <ul class="max-h-52 space-y-1 overflow-y-auto overscroll-contain pr-1">
                      {#each slice.files as file}
                        <li class="min-w-0 rounded-sm border border-transparent px-2 py-1.5 transition-colors hover:border-border/60 hover:bg-secondary/40">
                          <div class="flex min-w-0 items-center gap-2">
                            <span class="min-w-0 truncate font-mono text-xs text-foreground" title={file}>{fileName(file)}</span>
                          </div>
                          {#if fileDirectory(file)}
                            <div class="mt-0.5 truncate pl-0 font-mono text-[11px] text-muted-foreground" title={file}>
                              {fileDirectory(file)}/
                            </div>
                          {/if}
                        </li>
                      {/each}
                    </ul>
                  {:else}
                    <div class="text-sm text-muted-foreground">No scoped files listed.</div>
                  {/if}
                </InsetPanel>

                <InsetPanel class="min-w-0 space-y-3 xl:col-span-3">
                  <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <GitMerge class="h-3.5 w-3.5" />
                    {FIXED_LABELS.viewer.roadmap.dependencies}
                  </div>
                  {#if slice.dependency}
                    <dl class="space-y-3 text-sm">
                      <div class="space-y-1.5">
                        <dt class="text-xs text-muted-foreground">Depends on</dt>
                        <dd class="flex flex-wrap gap-1.5">
                          {#each dependencyValues(slice.dependency.dependsOn) as dependency}
                            <Badge variant={dependency === 'none' ? 'outline' : 'secondary'}>{dependency}</Badge>
                          {/each}
                        </dd>
                      </div>
                      <div class="space-y-1.5">
                        <dt class="text-xs text-muted-foreground">Blocks</dt>
                        <dd class="flex flex-wrap gap-1.5">
                          {#each dependencyValues(slice.dependency.blocks) as dependency}
                            <Badge variant={dependency === 'none' ? 'outline' : 'secondary'}>{dependency}</Badge>
                          {/each}
                        </dd>
                      </div>
                      <div class="space-y-1.5">
                        <dt class="text-xs text-muted-foreground">Parallel</dt>
                        <dd>
                          <Badge variant="outline">
                            {slice.dependency.canRunInParallel == null
                              ? 'unknown'
                              : slice.dependency.canRunInParallel
                                ? 'yes'
                                : 'no'}
                          </Badge>
                        </dd>
                      </div>
                    </dl>
                  {:else}
                    <div class="text-sm text-muted-foreground">No dependency metadata parsed.</div>
                  {/if}
                </InsetPanel>

                <InsetPanel class="min-w-0 space-y-2 xl:col-span-4">
                  <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <ListTodo class="h-3.5 w-3.5" />
                    {FIXED_LABELS.viewer.roadmap.progressLog}
                    {#if slice.progress.length > 0}
                      <Badge variant="secondary" class="ml-auto normal-case tracking-normal">{slice.progress.length}</Badge>
                    {/if}
                  </div>
                  {#if slice.progress.length > 0}
                    <ol class="max-h-52 space-y-0 overflow-y-auto overscroll-contain border-l border-border/70 pl-4 pr-1">
                      {#each slice.progress as entry}
                        <li class="relative min-w-0 pb-3 last:pb-0">
                          <span
                            class={`absolute -left-[4.5px] top-[7px] h-2 w-2 rounded-full ring-2 ring-background ${progressDotClass(entry.label)}`}
                            aria-hidden="true"
                          ></span>
                          <div class="min-w-0 space-y-1">
                            <Badge variant={progressVariant(entry.label)} class="max-w-full truncate" title={entry.label}>
                              {entry.label}
                            </Badge>
                            <p class="break-words text-xs leading-relaxed text-muted-foreground">{entry.value}</p>
                          </div>
                        </li>
                      {/each}
                    </ol>
                  {:else}
                    <div class="text-sm text-muted-foreground">No progress log parsed.</div>
                  {/if}
                </InsetPanel>
              </div>
            </InsetPanel>
          {/each}
        </div>
      {/if}
    </SurfaceCard>
  </div>
{/if}
